const MASTER = {
  name: 'Алиса',
  city: 'Воронеж',
  tagline: 'Создаю взгляд, который запоминается',
  tg: 'Telegram',
  phone: '+7 (900) 000-00-00',
  instagram: '@alice.lash',
  schedule: '2/2, с 10:00 до 20:00',
  about: [
    'Я мастер наращивания ресниц в Воронеже. Влюблена в свою работу и в то, как преображаются глаза после процедуры.',
    'Использую только премиум-материалы, слежу за новыми техниками и подбираю всё индивидуально.'
  ],
  stats: [
    { value: '2+', label: 'года опыта' },
    { value: '50+', label: 'довольных клиенток' },
    { value: '200+', label: 'выполненных работ' }
  ]
};

const SERVICES = [
  {
    id: 1, name: 'Классическое наращивание', price: 1500, duration: '60 мин',
    category: 'lash', description: '1 искусственная на 1 натуральную. Естественный объём, натуральный вид.',
    gradient: 'linear-gradient(135deg, #667eea, #764ba2)', isPopular: true
  },
  {
    id: 2, name: '2D объём', price: 1800, duration: '90 мин',
    category: 'lash', description: '2 тонкие реснички на 1 натуральную. Лёгкая пушистость без тяжести.',
    gradient: 'linear-gradient(135deg, #f093fb, #f5576c)', isPopular: true
  },
  {
    id: 3, name: '3D объём', price: 2200, duration: '120 мин',
    category: 'lash', description: 'Объёмный эффект. Взгляд становится выразительным, но остаётся естественным.',
    gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)', isPopular: true
  },
  {
    id: 4, name: 'Голливудский объём', price: 2800, duration: '150 мин',
    category: 'lash', description: 'Максимальный объём для особых случаев. Глаза как у звезды.',
    gradient: 'linear-gradient(135deg, #fa709a, #fee140)', isPopular: true
  },
  {
    id: 5, name: 'Ламинирование', price: 2000, duration: '60 мин',
    category: 'lamination', description: 'Подкрутка и укрепление натуральных ресниц. Эффект туши на месяц.',
    gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', isPopular: true
  },
  {
    id: 6, name: 'Коррекция', price: 800, duration: '40 мин',
    category: 'correction', description: 'Обновление наращённых ресниц. Рекомендуется каждые 2-3 недели.',
    gradient: 'linear-gradient(135deg, #ffecd2, #fcb69f)', isPopular: true
  },
  {
    id: 7, name: 'Снятие ресниц', price: 400, duration: '20 мин',
    category: 'removal', description: 'Аккуратное снятие наращённых ресниц без повреждения натуральных.',
    gradient: 'linear-gradient(135deg, #89f7fe, #66a6ff)', isPopular: false
  },
  {
    id: 8, name: 'Ботокс для ресниц', price: 1500, duration: '40 мин',
    category: 'lamination', description: 'Укрепляющая процедура для тонких и ослабленных ресниц.',
    gradient: 'linear-gradient(135deg, #fddb92, #d1fdff)', isPopular: false
  }
];

const CATEGORIES = [
  { id: 'all', label: 'Все работы' },
  { id: 'lash', label: 'Наращивание' },
  { id: 'lamination', label: 'Ламинирование' },
  { id: 'correction', label: 'Коррекция' },
  { id: 'removal', label: 'Снятие' }
];

const WORKS = [
  { id: 1, category: 'lash', serviceName: 'Классическое наращивание', date: 'Май 2026' },
  { id: 2, category: 'lash', serviceName: '2D объём', date: 'Май 2026' },
  { id: 3, category: 'lamination', serviceName: 'Ламинирование', date: 'Апрель 2026' },
  { id: 4, category: 'lash', serviceName: '3D объём', date: 'Апрель 2026' },
  { id: 5, category: 'correction', serviceName: 'Коррекция', date: 'Май 2026' },
  { id: 6, category: 'lash', serviceName: 'Голливудский объём', date: 'Апрель 2026' },
  { id: 7, category: 'lamination', serviceName: 'Ламинирование', date: 'Май 2026' },
  { id: 8, category: 'lash', serviceName: 'Классическое наращивание', date: 'Апрель 2026' },
  { id: 9, category: 'removal', serviceName: 'Снятие ресниц', date: 'Март 2026' },
  { id: 10, category: 'lash', serviceName: '2D объём', date: 'Март 2026' },
  { id: 11, category: 'correction', serviceName: 'Коррекция', date: 'Апрель 2026' },
  { id: 12, category: 'lash', serviceName: '3D объём', date: 'Март 2026' },
];

const REVIEWS = [
  {
    id: 1, name: 'Екатерина', rating: 5,
    text: 'Ходила к Алисе первый раз — очень довольна! Реснички получились невероятно красивые, взгляд сразу изменился. Обязательно приду ещё.',
    service: 'Классическое наращивание', date: '15.05.2026'
  },
  {
    id: 2, name: 'Анна', rating: 5,
    text: 'Делаю ламинирование у Алисы уже второй раз. Ресницы стали заметно гуще и длиннее, никакой туши не надо. Очень аккуратная работа.',
    service: 'Ламинирование', date: '10.05.2026'
  },
  {
    id: 3, name: 'Марина', rating: 5,
    text: 'Записалась на 3D объём по рекомендации подруги. Результат превзошёл ожидания! Алиса приятная в общении, всё объяснила и подобрала идеальный изгиб.',
    service: '3D объём', date: '02.05.2026'
  },
  {
    id: 4, name: 'Ольга', rating: 5,
    text: 'Очень трепетное отношение к клиентам. Алиса учла все мои пожелания, подсказала какой объём лучше подойдёт. Носить комфортно, не чувствуются.',
    service: '2D объём', date: '25.04.2026'
  },
  {
    id: 5, name: 'Светлана', rating: 4,
    text: 'Хороший мастер, работает аккуратно. Реснички держатся долго, отпадают равномерно. Единственное — хотелось бы побольше времени на процедуру.',
    service: 'Классическое наращивание', date: '18.04.2026'
  },
  {
    id: 6, name: 'Дарья', rating: 5,
    text: 'Делала голливудский объём на выпускной. Все гости спрашивали где я делала ресницы! Алиса — настоящий профессионал, рекомендую всем.',
    service: 'Голливудский объём', date: '10.04.2026'
  }
];
