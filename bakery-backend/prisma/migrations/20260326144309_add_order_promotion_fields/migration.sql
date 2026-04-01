-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "discountAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "giftLabel" TEXT,
ADD COLUMN     "promoCode" TEXT,
ADD COLUMN     "promotionTitle" TEXT,
ADD COLUMN     "subtotalAmount" DECIMAL(10,2) NOT NULL DEFAULT 0;
