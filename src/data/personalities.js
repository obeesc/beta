// Мок-данные. В проде заменяются запросом к Supabase / Express API.
// Поля совпадают со схемой docs/DATABASE_SCHEMA.md → таблица `personalities`.

export const SPHERES = [
  { id: 'all',       label: 'Все' },
  { id: 'science',   label: 'Наука' },
  { id: 'art',       label: 'Искусство' },
  { id: 'sport',     label: 'Спорт' },
  { id: 'politics',  label: 'Политика' },
  { id: 'buddhism',  label: 'Буддизм' },
  { id: 'shamanism', label: 'Шаманизм' },
];

export const SPHERE_LABEL = Object.fromEntries(
  SPHERES.filter(s => s.id !== 'all').map(s => [s.id, s.label])
);

export const PERSONALITIES = [
  {
    id: 'p_001',
    slug: 'agvan-dorzhiev',
    full_name: 'Агван Доржиев',
    full_name_bur: 'Агваан Доржиев',
    birth_year: 1853,
    death_year: 1938,
    birth_place: 'улус Хара-Шибирь, Забайкальская область',
    district_code: 'zaigraevsky',
    sphere: ['buddhism', 'politics'],
    summary:
      'Бурятский лама, дипломат и просветитель, наставник Далай-ламы XIII; инициатор строительства буддийского храма в Санкт-Петербурге.',
    cover_image_url:
      'https://images.unsplash.com/photo-1545569310-e3e3a52fe630?auto=format&fit=crop&w=1600&q=80',
    quotes: [
      { text: 'Знание идёт в обе стороны: к Востоку и к Западу.', source: 'Письма из Лхасы' },
    ],
    like_count: 1284,
    comment_count: 76,
  },
  {
    id: 'p_002',
    slug: 'dashi-namdakov',
    full_name: 'Даши Намдаков',
    birth_year: 1967,
    birth_place: 'с. Укурик, Читинская область',
    district_code: 'khilok',
    sphere: ['art'],
    summary:
      'Скульптор и художник, чьи бронзовые работы соединяют монгольскую эпику и современную пластику; выставлялся в Tate, Hermitage и Saatchi.',
    cover_image_url:
      'https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?auto=format&fit=crop&w=1600&q=80',
    quotes: [
      { text: 'Я леплю не людей, а память степи.', source: 'Интервью «Сноб», 2018' },
    ],
    like_count: 2410,
    comment_count: 134,
  },
  {
    id: 'p_003',
    slug: 'irina-pantaeva',
    full_name: 'Ирина Пантаева',
    birth_year: 1971,
    birth_place: 'г. Улан-Удэ',
    district_code: 'ulan-ude',
    sphere: ['art'],
    summary:
      'Первая бурятка-супермодель мирового уровня, икона 90-х, актриса и автор автобиографии «Сибирская мечта».',
    cover_image_url:
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1600&q=80',
    quotes: [
      { text: 'Сибирь учит держать спину прямо — даже на подиуме в Милане.', source: 'Vogue, 1997' },
    ],
    like_count: 1873,
    comment_count: 92,
  },
  {
    id: 'p_004',
    slug: 'lyubov-tungalag',
    full_name: 'Любовь Тунгалаг',
    birth_year: 1985,
    birth_place: 'г. Кяхта',
    district_code: 'kyakhtinsky',
    sphere: ['science'],
    summary:
      'Биолог-эколог, ведущий научный сотрудник Байкальского института СО РАН; исследует устойчивость эндемиков озера к потеплению.',
    cover_image_url:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1600&q=80',
    quotes: [
      { text: 'Байкал — это не вода. Это часовой механизм планеты.', source: 'Доклад РАН, 2022' },
    ],
    like_count: 542,
    comment_count: 21,
  },
  {
    id: 'p_005',
    slug: 'bair-baldanov',
    full_name: 'Баир Балданов',
    birth_year: 1990,
    birth_place: 'с. Орлик, Окинский район',
    district_code: 'okinsky',
    sphere: ['sport'],
    summary:
      'Мастер спорта по вольной борьбе, призёр чемпионатов Европы; известен техникой захвата, унаследованной от деда-бухэ-барилдаана.',
    cover_image_url:
      'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1600&q=80',
    quotes: [
      { text: 'Ковер — это степь, только маленькая.', source: 'Пресс-конференция, 2021' },
    ],
    like_count: 988,
    comment_count: 37,
  },
  {
    id: 'p_006',
    slug: 'sayana-tsydenova',
    full_name: 'Саяна Цыденова',
    birth_year: 1978,
    birth_place: 'г. Закаменск',
    district_code: 'zakamensky',
    sphere: ['politics', 'science'],
    summary:
      'Юрист и общественный деятель, автор закона о защите эндемичной флоры; работает с международными фондами по охране Байкала.',
    cover_image_url:
      'https://images.unsplash.com/photo-1573497019418-b400bb3ab074?auto=format&fit=crop&w=1600&q=80',
    quotes: [
      { text: 'Закон без культуры — мёртвая буква.', source: 'Лекция в МГУ, 2020' },
    ],
    like_count: 612,
    comment_count: 18,
  },
  {
    id: 'p_007',
    slug: 'bato-galsanov',
    full_name: 'Бато Галсанов',
    birth_year: 1962,
    death_year: 2019,
    birth_place: 'улус Аршан, Тункинский район',
    district_code: 'tunkinsky',
    sphere: ['shamanism'],
    summary:
      'Известный шаман и собиратель устных преданий Тункинской долины; основал музей-юрту в селе Аршан.',
    cover_image_url:
      'https://images.unsplash.com/photo-1473662712005-90c6e25c6b1d?auto=format&fit=crop&w=1600&q=80',
    quotes: [
      { text: 'Память земли громче любого голоса.', source: 'Полевые записи, 2003' },
    ],
    like_count: 1422,
    comment_count: 64,
  },
  {
    id: 'p_008',
    slug: 'tsybik-rinchino',
    full_name: 'Цыбик Ринчино',
    birth_year: 1948,
    birth_place: 'с. Хоринск',
    district_code: 'khorinsky',
    sphere: ['science'],
    summary:
      'Физик-теоретик, академик; внёс вклад в моделирование процессов в верхней атмосфере, лауреат государственной премии.',
    cover_image_url:
      'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1600&q=80',
    quotes: [
      { text: 'Уравнение красиво ровно настолько, насколько честен его автор.', source: 'Лекция, 1999' },
    ],
    like_count: 374,
    comment_count: 9,
  },
];

export const QUOTES_OF_DAY = [
  { text: 'Кто знает прошлое — спокоен за будущее.', author: 'Бурятская поговорка' },
  { text: 'Гора уважает того, кто поднимается медленно.', author: 'Окинская мудрость' },
  { text: 'Слово, сказанное у огня, долетает до неба.', author: 'Эпос «Гэсэр»' },
];

// Детерминированный выбор «личности дня» — стабилен в течение суток.
export function pickPersonalityOfDay(list = PERSONALITIES, date = new Date()) {
  const dayKey = date.getUTCFullYear() * 1000 + (date.getUTCMonth() + 1) * 50 + date.getUTCDate();
  return list[dayKey % list.length];
}

export function pickQuoteOfDay(list = QUOTES_OF_DAY, date = new Date()) {
  const dayKey = date.getUTCFullYear() * 1000 + (date.getUTCMonth() + 1) * 50 + date.getUTCDate();
  return list[dayKey % list.length];
}
