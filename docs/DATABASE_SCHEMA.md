# База данных платформы «Известные личности Бурятии»

Документ описывает структуру БД для веб-платформы. За референс взят PostgreSQL
(Supabase), но схема легко переносится на любой реляционный движок. Все таблицы
используют `uuid` в качестве первичных ключей и Unix-таймстампы `timestamptz`.

## 1. Общие принципы

- **uuid v4** в качестве `id` — безопасно для публичных URL и шардирования.
- **soft delete** через `deleted_at` для модерируемых сущностей (`comments`,
  `personalities`). Хранение истории важнее физического удаления.
- **timezone-aware timestamps** (`timestamptz`) — всё UTC, конверсия на фронте.
- **RLS (Row Level Security)** — политики ниже описаны для Supabase: «читать
  всем, писать — только владельцу». На Express + Postgres логика
  переезжает в middleware.
- **денормализованные счётчики** (`like_count`, `comment_count`) для горячих
  списков; обновляются триггерами, чтобы не делать `COUNT(*)` на каждом запросе.

---

## 2. Таблица `users`

Профиль пользователя. Связана 1:1 с записью в `auth.users` Supabase или
эквиваленте (Firebase, Auth0).

| Колонка         | Тип            | Описание                                              |
|-----------------|----------------|-------------------------------------------------------|
| `id`            | uuid PK        | Тот же `id`, что и в провайдере авторизации.          |
| `email`         | citext UNIQUE  | Email (case-insensitive).                             |
| `display_name`  | text           | Отображаемое имя.                                     |
| `avatar_url`    | text           | URL аватара (S3 / Storage).                           |
| `provider`      | text           | `email` / `google` / `yandex` / `telegram`.           |
| `role`          | text           | `user` / `moderator` / `admin`. По умолчанию `user`.  |
| `bio`           | text           | Краткое о себе.                                       |
| `created_at`    | timestamptz    | DEFAULT `now()`.                                      |
| `last_seen_at`  | timestamptz    | Обновляется по heartbeat.                             |

**Индексы:** `(email)`, `(provider)`.

**RLS:**
- `SELECT`: всем (профиль публичный).
- `UPDATE`: только `auth.uid() = users.id`.

---

## 3. Таблица `personalities`

Сущность «известная личность». Каждая запись = отдельная страница.

| Колонка             | Тип             | Описание                                                                |
|---------------------|-----------------|-------------------------------------------------------------------------|
| `id`                | uuid PK         |                                                                         |
| `slug`              | text UNIQUE     | URL-идентификатор (`agvan-dorzhiev`).                                   |
| `full_name`         | text NOT NULL   | ФИО на русском.                                                         |
| `full_name_bur`     | text            | ФИО на бурятском.                                                       |
| `birth_year`        | int             | Год рождения. Может быть NULL для исторических.                         |
| `death_year`        | int             | Год смерти (NULL если жив).                                             |
| `birth_place`       | text            | Место рождения.                                                         |
| `district_code`     | text            | Код района Бурятии для интерактивной карты (см. `districts`).           |
| `sphere`            | text[]          | Сферы: `science`, `art`, `sport`, `politics`, `buddhism`, `shamanism`.  |
| `summary`           | text            | Краткое описание (1-2 предложения для карточки).                        |
| `biography_early`   | text (markdown) | Ранние годы.                                                            |
| `biography_career`  | text (markdown) | Достижения.                                                             |
| `biography_legacy`  | text (markdown) | След в истории.                                                         |
| `cover_image_url`   | text            | Большое фото на странице.                                               |
| `gallery`           | jsonb           | `[{url, caption}]` — мини-галерея.                                      |
| `quotes`            | jsonb           | `[{text, source}]` — цитаты.                                            |
| `video_embeds`      | jsonb           | `[{provider, id, title}]` — видео-виджеты (YouTube / VK).               |
| `like_count`        | int             | Денормализованный счётчик. DEFAULT 0.                                   |
| `comment_count`     | int             | Денормализованный счётчик. DEFAULT 0.                                   |
| `is_published`      | bool            | Скрывает черновики. DEFAULT false.                                      |
| `created_at`        | timestamptz     |                                                                         |
| `updated_at`        | timestamptz     | Триггер `on update`.                                                    |
| `deleted_at`        | timestamptz     | Soft delete.                                                            |

**Индексы:**
- `(slug)` UNIQUE — для роутинга `/personalities/:slug`.
- GIN `(sphere)` — для фильтра по сферам.
- `(district_code)` — для интерактивной карты.
- `(is_published, deleted_at)` partial — горячий список главной.

**RLS:**
- `SELECT`: `is_published = true AND deleted_at IS NULL` для всех; полный доступ для роли `moderator`/`admin`.
- `INSERT/UPDATE/DELETE`: только `moderator` / `admin`.

---

## 4. Таблица `comments` — древовидные ветки

Поддерживает ответы на конкретный комментарий за счёт `parent_id`. Для быстрого
рендера дерева одним запросом используется `path` (materialized path).

| Колонка           | Тип             | Описание                                                            |
|-------------------|-----------------|---------------------------------------------------------------------|
| `id`              | uuid PK         |                                                                     |
| `personality_id`  | uuid FK         | → `personalities.id` ON DELETE CASCADE.                             |
| `author_id`       | uuid FK         | → `users.id`. NULL если автор удалён.                               |
| `parent_id`       | uuid FK         | → `comments.id`. NULL — корень ветки.                               |
| `path`            | ltree           | Materialized path: `root_id.child_id.grandchild_id`.                |
| `depth`           | int             | 0 для корня. Ограничиваем 5 уровнями в логике приложения.           |
| `body`            | text            | Markdown / plain.                                                   |
| `like_count`      | int             | DEFAULT 0.                                                          |
| `is_edited`       | bool            | DEFAULT false.                                                      |
| `is_pinned`       | bool            | Модератор может закрепить.                                          |
| `created_at`      | timestamptz     |                                                                     |
| `updated_at`      | timestamptz     |                                                                     |
| `deleted_at`      | timestamptz     | Soft delete (текст заменяется на «удалено», ветка остаётся).        |

### Почему `parent_id` + `path`

- `parent_id` достаточен, чтобы построить дерево, но рекурсивные обходы дороги.
- `path` (ltree) позволяет за один SQL-запрос выдрать всю ветку под комментарием:
  ```sql
  SELECT * FROM comments
   WHERE personality_id = $1 AND path <@ $2
   ORDER BY path, created_at;
  ```
- Альтернатива без ltree: использовать `text` колонку `path` с разделителем `/`
  и `LIKE 'prefix%'` + индекс `text_pattern_ops`.

**Индексы:**
- `(personality_id, created_at DESC)` — лента под постом.
- GIST `(path)` — выборка ветки.
- `(parent_id)` — fallback для рекурсии.
- `(author_id)` — комментарии пользователя.

**Триггеры:**
- `BEFORE INSERT` устанавливает `path` и `depth` от родителя.
- `AFTER INSERT/DELETE` обновляет `personalities.comment_count`.

**RLS:**
- `SELECT`: всем.
- `INSERT`: `auth.uid() IS NOT NULL` (только авторизованные).
- `UPDATE`: автор может редактировать в течение 15 минут; модератор всегда.
- `DELETE` (soft): автор / модератор.

---

## 5. Таблица `likes`

Универсальные лайки на разные сущности — личностей **и** комментарии.

| Колонка        | Тип           | Описание                                                |
|----------------|---------------|---------------------------------------------------------|
| `id`           | uuid PK       |                                                         |
| `user_id`      | uuid FK       | → `users.id` ON DELETE CASCADE.                         |
| `target_type`  | text          | `personality` / `comment`.                              |
| `target_id`    | uuid          | id личности или комментария.                            |
| `created_at`   | timestamptz   |                                                         |

**Constraint:** UNIQUE `(user_id, target_type, target_id)` — нельзя лайкнуть дважды.

**Индексы:**
- `(target_type, target_id)` — счётчик и список лайкнувших.
- `(user_id)` — «мне нравится».

**Триггеры:**
- `AFTER INSERT/DELETE` инкрементирует / декрементирует `like_count` в
  `personalities` или `comments` (через `CASE target_type`).

**RLS:**
- `SELECT`: всем.
- `INSERT/DELETE`: `auth.uid() = user_id`.

---

## 6. Справочник `districts` (опционально)

Для интерактивной карты Бурятии — справочник районов.

| Колонка       | Тип       | Описание                            |
|---------------|-----------|-------------------------------------|
| `code`        | text PK   | `mukhorshibirsky`, `tunkinsky`, …   |
| `name_ru`     | text      | «Мухоршибирский район».             |
| `name_bur`    | text      | На бурятском.                       |
| `center`      | point     | Координаты для всплывашки.          |
| `polygon`     | geometry  | Граница (PostGIS).                  |

Связь: `personalities.district_code → districts.code`.

---

## 7. ER-диаграмма (текстом)

```
users 1 ──┬── M comments        M ── 1 personalities
          │                                │
          └── M likes (polymorphic) ───────┤
                                           │
                              districts 1 ─┘
```

## 8. Минимальные миграции (Supabase / pgsql)

```sql
create extension if not exists "uuid-ossp";
create extension if not exists "ltree";
create extension if not exists "citext";

create table users (
  id uuid primary key default uuid_generate_v4(),
  email citext unique not null,
  display_name text,
  avatar_url text,
  provider text default 'email',
  role text default 'user',
  bio text,
  created_at timestamptz default now(),
  last_seen_at timestamptz
);

create table personalities (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  full_name text not null,
  full_name_bur text,
  birth_year int,
  death_year int,
  birth_place text,
  district_code text,
  sphere text[] not null default '{}',
  summary text,
  biography_early text,
  biography_career text,
  biography_legacy text,
  cover_image_url text,
  gallery jsonb default '[]',
  quotes jsonb default '[]',
  video_embeds jsonb default '[]',
  like_count int default 0,
  comment_count int default 0,
  is_published bool default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);
create index on personalities using gin (sphere);
create index on personalities (district_code);

create table comments (
  id uuid primary key default uuid_generate_v4(),
  personality_id uuid not null references personalities(id) on delete cascade,
  author_id uuid references users(id) on delete set null,
  parent_id uuid references comments(id) on delete cascade,
  path ltree not null,
  depth int not null default 0,
  body text not null,
  like_count int default 0,
  is_edited bool default false,
  is_pinned bool default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);
create index on comments (personality_id, created_at desc);
create index on comments using gist (path);

create table likes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  target_type text not null check (target_type in ('personality','comment')),
  target_id uuid not null,
  created_at timestamptz default now(),
  unique (user_id, target_type, target_id)
);
create index on likes (target_type, target_id);
```
