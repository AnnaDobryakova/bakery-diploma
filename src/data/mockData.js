export const mockDataProducts = [
  {
    id: 1,
    imageURL: '/img/bun_1.png',
    name: "Булочка с корицей",
    description: "Мука, масло, вода, молоко, дрожжи",
    category: "Выпечка",
    price: 160,
    remainder: 23,
    updateDate: "2023-07-04",
    weight: 120, 
    nutrition: {
      calories: 380,
      proteins: 6,
      fats: 18,
      carbs: 48
    }
  },
  {
    id: 2,
    imageURL: '/img/bun_2.png',
    name: "Хлеб ржаной",
    description: "Мука, вода, соль, дрожжи",
    category: "Хлеб",
    price: 80,
    remainder: 10,
    updateDate: "2023-07-03",
    weight: 500,
    nutrition: {
      calories: 210,
      proteins: 6,
      fats: 1,
      carbs: 44
    }
  },
  {
    id: 3,
    imageURL: '/img/bun_3.png',
    name: "Пирожное 'Наполеон'",
    description: "Мука, масло, вода, молоко, дрожжи",
    category: "Пирожные",
    price: 150,
    remainder: 1,
    updateDate: "2023-07-05",
    weight: 150,
    nutrition: {
      calories: 420,
      proteins: 5,
      fats: 28,
      carbs: 40
    }
  },
  {
    id: 4,
    imageURL: '/img/bun_2.png',
    name: "Круассан с шоколадом",
    description: "Мука, масло, вода, молоко, дрожжи",
    category: "Выпечка",
    price: 100,
    remainder: 10,
    updateDate: "2023-07-02",
    weight: 90,
    nutrition: {
      calories: 410,
      proteins: 7,
      fats: 22,
      carbs: 45
    }
  },
  {
    id: 5,
    imageURL: '/img/bun_1.png',
    name: "Маффин с черникой",
    description: "Мука, масло, вода, молоко, дрожжи",
    category: "Пирожные",
    price: 130,
    remainder: 0,
    updateDate: "2023-07-01",
    weight: 110,
    nutrition: {
      calories: 390,
      proteins: 5,
      fats: 19,
      carbs: 52
    }
  },
];

export const mockDataCustomers = [
  {
    id: 1,
    name: "Иван Иванов",
    phone: "+7 (999) 123-45-67",
    email: "ivan.ivanov@example.com",
    registeredAt: "2023-01-15",
    status: "Активен",
    ordersCount: 5,
  },
  {
    id: 2,
    name: "Мария Петрова",
    phone: "+7 (999) 987-65-43",
    email: "maria.petrova@example.com",
    registeredAt: "2023-03-22",
    status: "Неактивен",
    ordersCount: 2,

  },
  {
    id: 3,
    name: "Алексей Смирнов",
    phone: "+7 (999) 555-12-34",
    email: "aleksey.smirnov@example.com",
    registeredAt: "2023-02-10",
    status: "Активен",
    ordersCount: 8,
  },
  {
    id: 4,
    name: "Елена Волкова",
    phone: "+7 (999) 555-56-78",
    email: "elena.volkova@example.com",
    registeredAt: "2023-04-05",
    status: "Активен",
    ordersCount: 3,
  },
  {
    id: 5,
    name: "Сергей Кузнецов",
    phone: "+7 (999) 555-90-12",
    email: "sergey.kuznetsov@example.com",
    registeredAt: "2023-05-10",
    status: "Активен",
    ordersCount: 1,
  },
];

export const mockDataEmployees = [
  {
    id: 1,
    name: "Алексей Смирнов",
    email: "aleksey.smirnov@example.com",
    age: 30,
    phone: "+7 (999) 555-12-34",
    position: "Пекарь",
    status: "Активен",
  },
  {
    id: 2,
    name: "Елена Волкова",
    email: "elena.volkova@example.com",
    age: 28,
    phone: "+7 (999) 555-56-78",
    position: "Менеджер",
    status: "Активен",
  },
  {
    id: 3,
    name: "Сергей Кузнецов",
    email: "sergey.kuznetsov@example.com",
    age: 35,
    phone: "+7 (999) 555-90-12",
    position: "Кассир",
    status: "Уволен",
  },
  {
    id: 4,
    name: "Анна Соколова",
    email: "anna.sokolova@example.com",
    age: 26,
    phone: "+7 (999) 555-34-56",
    position: "Администратор",
    status: "Активен",
  },
  {
    id: 5,
    name: "Дмитрий Иванов",
    email: "dmitriy.ivanov@example.com",
    age: 32,
    phone: "+7 (999) 555-78-90",
    position: "Директор",
    status: "Активен",
  },
];

export const mockDataOrders = [
  {
    id: 1,
    customer: "Иван Иванов",
    date: "2023-06-01",
    total: 1200,
    status: "Новый",
  },
  {
    id: 2,
    customer: "Мария Петрова",
    date: "2023-06-02",
    total: 850,
    status: "Готовится",
  },
  {
    id: 3,
    customer: "Алексей Смирнов",
    date: "2023-06-03",
    total: 1500,
    status: "Готово",
  },
  {
    id: 4,
    customer: "Елена Волкова",
    date: "2023-06-04",
    total: 900,
    status: "Отменен",
  },
  {
    id: 5,
    customer: "Сергей Кузнецов",
    date: "2023-06-05",
    total: 700,
    status: "Новый",
  },
];

export const mockDataCategories = [
  {
    id: 1,
    name: "Выпечка",
    description: "Булочки, круассаны, пироги и многое другое.",
    productsCount: 25,
    status: "Активен",
  },
  {
    id: 2,
    name: "Хлеб",
    description: "Ржаной, пшеничный, цельнозерновой и другие.",
    productsCount: 0  ,
    status: "Активен",
  },
  {
    id: 3,
    name: "Пирожные",
    description: "Эклеры, макароны, чизкейки и многое другое.",
    productsCount: 20,
    status: "Активен",
  },
  {
    id: 4,
    name: "Печенье",
    description: "Овсяное, шоколадное, с орехами и другие.",
    productsCount: 10,
    status: "Активен",
  },
  {
    id: 5,
    name: "Торты",
    description: "Шоколадные, фруктовые, кремовые и другие.",
    productsCount: 8,
    status: "Неактивен",
  }
];

export const mockDataPromotions = [
  {
    id: 1,
    name: "Скидка 10% на все булочки",
    type: "Скидка",
    value: 10,                   
    startDate: "2023-07-01",
    endDate: "2023-07-31",
    status: "Активен",
    limitations: "Действует только на булочки, не суммируется с другими акциями.",
  },
  {
    id: 2,
    name: "Подарок при покупке торта",
    type: "Подарок",
    value: "Печенье в подарок",
    startDate: "2023-07-05",
    endDate: "2023-07-20",
    status: "Активен",
    limitations: "При покупке любого торта, получите печенье в подарок. Не суммируется с другими акциями.",
  },
  {
    id: 3,
    name: "Скидка 15% на хлеб",
    type: "Скидка",
    value: 15,
    startDate: "2023-07-10",
    endDate: "2023-07-25",
    status: "Неактивен",
    limitations: "Действует только на хлеб, не суммируется с другими акциями.",
  },
  {
    id: 4,
    name: "Скидка 20% на пирожные",
    type: "Скидка",
    value: 20,
    startDate: "2023-07-20",
    endDate: "2023-07-30",
    status: "Активен",
    limitations: "Действует только на пирожные, не суммируется с другими акциями.",
  },
  {
    id: 5,
    name: "Подарок при покупке хлеба",
    type: "Подарок",
    value: "Булочка в подарок",
    startDate: "2023-07-25",
    endDate: "2023-07-31",
    status: "Запланирован",
    limitations: "При покупке любого хлеба, получите булочку в подарок. Не суммируется с другими акциями.",
  }
];

export const mockBarData = [
  {
    day: "Понедельник",
    "Выпечка": 120,
    "Хлеб": 80,
    "Пирожные": 150,
    "Печенье": 100,
    "Торты": 60,
  },
  {
    day: "Вторник",
    "Выпечка": 110,
    "Хлеб": 75,
    "Пирожные": 140,
    "Печенье": 95,
    "Торты": 55,
  },
  {
    day: "Среда",
    "Выпечка": 140,
    "Хлеб": 90,
    "Пирожные": 160,
    "Печенье": 110,
    "Торты": 70,
  },
  {
    day: "Четверг",
    "Выпечка": 130,
    "Хлеб": 85,
    "Пирожные": 155,
    "Печенье": 105,
    "Торты": 65,
  },
  {
    day: "Пятница",
    "Выпечка": 180,
    "Хлеб": 110,
    "Пирожные": 210,
    "Печенье": 140,
    "Торты": 120,
  },
  {
    day: "Суббота",
    "Выпечка": 170,
    "Хлеб": 100,
    "Пирожные": 220,
    "Печенье": 150,
    "Торты": 130,
  },
  {
    day: "Воскресенье",
    "Выпечка": 150,
    "Хлеб": 95,
    "Пирожные": 200,
    "Печенье": 135,
    "Торты": 110,
  },
];


export const mockPieData = [
  { id: "Выпечка", label: "Выпечка", value: 52000 },
  { id: "Пирожные", label: "Пирожные", value: 68000 },
  { id: "Печенье", label: "Печенье", value: 39000 },
  { id: "Хлеб", label: "Хлеб", value: 28000 },
  { id: "Торты", label: "Торты", value: 74000 },
];

export const mockLineData = [
  {
    id: "Выручка",
    color: "hsl(50, 80%, 55%)",
    data: [
      { x: "Пн", y: 120 },
      { x: "Вт", y: 90 },
      { x: "Ср", y: 150 },
      { x: "Чт", y: 110 },
      { x: "Пт", y: 200 },
      { x: "Сб", y: 180 },
      { x: "Вс", y: 140 },
    ],
  },
  {
    id: "Заказы",
    color: "hsl(10, 80%, 55%)",
    data: [
      { x: "Пн", y: 35 },
      { x: "Вт", y: 28 },
      { x: "Ср", y: 42 },
      { x: "Чт", y: 30 },
      { x: "Пт", y: 55 },
      { x: "Сб", y: 60 },
      { x: "Вс", y: 40 },
    ],
  },
  {
    id: "Средний чек",
    color: "hsl(30, 30%, 75%)",
    data: [
      { x: "Пн", y: 34 },
      { x: "Вт", y: 32 },
      { x: "Ср", y: 36 },
      { x: "Чт", y: 33 },
      { x: "Пт", y: 37 },
      { x: "Сб", y: 35 },
      { x: "Вс", y: 34 },
    ],
  },
];

export const mockTransactions = [
  {
    txId: "01e4dsa",
    user: "johndoe",
    date: "2021-09-01",
    cost: "43.95",
  },
  {
    txId: "0315dsaa",
    user: "jackdower",
    date: "2022-04-01",
    cost: "133.45",
  },
  {
    txId: "01e4dsa",
    user: "aberdohnny",
    date: "2021-09-01",
    cost: "43.95",
  },
  {
    txId: "51034szv",
    user: "goodmanave",
    date: "2022-11-05",
    cost: "200.95",
  },
  {
    txId: "0a123sb",
    user: "stevebower",
    date: "2022-11-02",
    cost: "13.55",
  },
  {
    txId: "01e4dsa",
    user: "aberdohnny",
    date: "2021-09-01",
    cost: "43.95",
  },
  {
    txId: "120s51a",
    user: "wootzifer",
    date: "2019-04-15",
    cost: "24.20",
  },
  {
    txId: "0315dsaa",
    user: "jackdower",
    date: "2022-04-01",
    cost: "133.45",
  },
];


