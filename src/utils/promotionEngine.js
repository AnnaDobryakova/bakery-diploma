const safeString = (value) => {
  return typeof value === "string" ? value : "";
};

const parseRestrictions = (restrictions) => {
  const normalized = safeString(restrictions).trim();

  if (!normalized) return {};

  return normalized
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((acc, part) => {
      const [rawKey, ...rest] = part.split("=");
      if (!rawKey || !rest.length) return acc;

      const key = rawKey.trim();
      const value = rest.join("=").trim();

      if (!key || !value) return acc;

      acc[key] = value;
      return acc;
    }, {});
};

const isPromotionDateValid = (promotion) => {
  if (!promotion) return false;
  if (promotion.status !== "Активен") return false;

  const now = new Date();
  const start = new Date(promotion.startDate);
  const end = new Date(promotion.endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;

  end.setHours(23, 59, 59, 999);

  return now >= start && now <= end;
};

const checkAfterTime = (afterValue) => {
  if (!afterValue) return true;

  const [hours, minutes] = safeString(afterValue)
    .split(":")
    .map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return false;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const requiredMinutes = hours * 60 + minutes;

  return currentMinutes >= requiredMinutes;
};

const getSubtotal = (cartItems = []) => {
  return cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
};

const getCategorySubtotal = (cartItems = [], categoryCode) => {
  return cartItems
    .filter((item) => item.category === categoryCode)
    .reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );
};

const extractMinTotalFromText = (promotion) => {
  const rules = parseRestrictions(promotion?.restrictions);

  if (rules.minTotal && !Number.isNaN(Number(rules.minTotal))) {
    return Number(rules.minTotal);
  }

  const sources = [promotion?.title, promotion?.restrictions]
    .map(safeString)
    .filter(Boolean);

  for (const text of sources) {
    // Ищет "от 1000", "от 700 рублей" и т.п.
    const match = text.match(/от\s+(\d{2,6})/i);
    if (match) {
      return Number(match[1]);
    }
  }

  return null;
};

const isGiftPromotionEligible = (promotion, subtotal) => {
  const minTotal = extractMinTotalFromText(promotion);

  // если не нашли условие суммы — автоматом подарок НЕ применяем
  if (!minTotal || Number.isNaN(minTotal)) return false;

  return subtotal >= minTotal;
};

const isAutomaticDiscountEligible = (promotion, cartItems, subtotal) => {
  const rules = parseRestrictions(promotion?.restrictions);

  if (rules.minTotal && subtotal < Number(rules.minTotal)) {
    return false;
  }

  if (rules.after && !checkAfterTime(rules.after)) {
    return false;
  }

  if (rules.category) {
    const categorySubtotal = getCategorySubtotal(cartItems, rules.category);
    if (categorySubtotal <= 0) return false;
  }

  return true;
};

const calculateDiscountForPromotion = (promotion, cartItems, subtotal) => {
  const percent = Number(promotion?.value || 0);
  if (!percent || percent <= 0) return 0;

  const rules = parseRestrictions(promotion?.restrictions);

  let base = subtotal;

  if (rules.category) {
    base = getCategorySubtotal(cartItems, rules.category);
  }

  if (base <= 0) return 0;

  return Math.round(base * (percent / 100));
};

export const applyPromotions = ({
  promotions = [],
  cartItems = [],
  promoCode = "",
}) => {
  const subtotal = getSubtotal(cartItems);

  if (!cartItems.length) {
    return {
      subtotal: 0,
      discountAmount: 0,
      finalTotal: 0,
      appliedPromotion: null,
      promoError: "",
      giftLabel: "",
    };
  }

  const normalizedCode = safeString(promoCode).trim().toLowerCase();
  const validPromotions = promotions.filter(isPromotionDateValid);

  // 1. Сначала проверяем промокод, если он введен
  if (normalizedCode) {
    const manualPromotion = validPromotions.find(
      (promotion) =>
        safeString(promotion.promoCode).trim().toLowerCase() === normalizedCode
    );

    if (!manualPromotion) {
      return {
        subtotal,
        discountAmount: 0,
        finalTotal: subtotal,
        appliedPromotion: null,
        promoError: "Промокод не найден или акция неактивна",
        giftLabel: "",
      };
    }

    if (manualPromotion.type === "Скидка") {
      const isEligible = isAutomaticDiscountEligible(
        manualPromotion,
        cartItems,
        subtotal
      );

      if (!isEligible) {
        return {
          subtotal,
          discountAmount: 0,
          finalTotal: subtotal,
          appliedPromotion: null,
          promoError: "Условия акции не выполнены",
          giftLabel: "",
        };
      }

      const discountAmount = calculateDiscountForPromotion(
        manualPromotion,
        cartItems,
        subtotal
      );

      return {
        subtotal,
        discountAmount,
        finalTotal: Math.max(subtotal - discountAmount, 0),
        appliedPromotion: manualPromotion,
        promoError: "",
        giftLabel: "",
      };
    }

    if (manualPromotion.type === "Подарок") {
      const isEligible = isGiftPromotionEligible(manualPromotion, subtotal);

      if (!isEligible) {
        return {
          subtotal,
          discountAmount: 0,
          finalTotal: subtotal,
          appliedPromotion: null,
          promoError: "Для подарка не выполнено условие суммы заказа",
          giftLabel: "",
        };
      }

      return {
        subtotal,
        discountAmount: 0,
        finalTotal: subtotal,
        appliedPromotion: manualPromotion,
        promoError: "",
        giftLabel: manualPromotion.value || "",
      };
    }
  }

  // 2. Если промокода нет — ищем автоматическую скидку
  const automaticPromotions = validPromotions.filter(
    (promotion) => !safeString(promotion.promoCode).trim()
  );

  const automaticDiscounts = automaticPromotions
    .filter((promotion) => promotion.type === "Скидка")
    .filter((promotion) =>
      isAutomaticDiscountEligible(promotion, cartItems, subtotal)
    )
    .map((promotion) => ({
      promotion,
      discountAmount: calculateDiscountForPromotion(
        promotion,
        cartItems,
        subtotal
      ),
    }))
    .filter((item) => item.discountAmount > 0)
    .sort((a, b) => b.discountAmount - a.discountAmount);

  if (automaticDiscounts.length > 0) {
    const best = automaticDiscounts[0];

    return {
      subtotal,
      discountAmount: best.discountAmount,
      finalTotal: Math.max(subtotal - best.discountAmount, 0),
      appliedPromotion: best.promotion,
      promoError: "",
      giftLabel: "",
    };
  }

  // 3. Если автоматической скидки нет — ищем автоматический подарок
  const automaticGift = automaticPromotions.find(
    (promotion) =>
      promotion.type === "Подарок" &&
      isGiftPromotionEligible(promotion, subtotal)
  );

  if (automaticGift) {
    return {
      subtotal,
      discountAmount: 0,
      finalTotal: subtotal,
      appliedPromotion: automaticGift,
      promoError: "",
      giftLabel: automaticGift.value || "",
    };
  }

  return {
    subtotal,
    discountAmount: 0,
    finalTotal: subtotal,
    appliedPromotion: null,
    promoError: "",
    giftLabel: "",
  };
};