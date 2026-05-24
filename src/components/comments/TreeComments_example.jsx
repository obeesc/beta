// Демо-страница для <TreeComments />.
// Показывает, как из плоского массива (как из БД) собирается ветка обсуждения.

import { useState } from 'react';
import TreeComments from './TreeComments.jsx';

const SEED_COMMENTS = [
  {
    id: 'c1',
    personality_id: 'p_001',
    parent_id: null,
    author: { id: 'u1', displayName: 'Аяна Дондокова' },
    body: 'Очень рада видеть Агвана Доржиева на платформе. Его дипломатическое наследие до сих пор недооценено.',
    like_count: 24,
    is_pinned: true,
    created_at: '2026-05-22T09:14:00Z',
  },
  {
    id: 'c2',
    personality_id: 'p_001',
    parent_id: 'c1',
    author: { id: 'u2', displayName: 'Зоригто Б.' },
    body: 'Согласен, особенно история со строительством дацана в Петербурге — это вообще отдельный фильм просится.',
    like_count: 6,
    created_at: '2026-05-22T10:02:00Z',
  },
  {
    id: 'c3',
    personality_id: 'p_001',
    parent_id: 'c2',
    author: { id: 'u3', displayName: 'historian_99' },
    body: 'Кстати, рекомендую монографию Андреева 2006 года — там много неизвестных писем.',
    like_count: 3,
    created_at: '2026-05-22T11:45:00Z',
  },
  {
    id: 'c4',
    personality_id: 'p_001',
    parent_id: null,
    author: { id: 'u4', displayName: 'Сэсэг' },
    body: 'А есть планы добавить интерактивную карту его поездок? Было бы потрясающе.',
    like_count: 11,
    created_at: '2026-05-23T07:30:00Z',
  },
  {
    id: 'c5',
    personality_id: 'p_001',
    parent_id: 'c1',
    author: { id: 'u5', displayName: 'admin' },
    body: 'Скоро будет ссылка на оцифрованный архив писем.',
    like_count: 2,
    created_at: '2026-05-23T18:21:00Z',
  },
];

export default function TreeCommentsExample() {
  const [user, setUser] = useState({ id: 'me', displayName: 'Вы' });

  return (
    <div className="min-h-screen bg-ink-50 py-12 px-4">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex items-center gap-2">
          <button
            className="btn-ghost"
            onClick={() => setUser(user ? null : { id: 'me', displayName: 'Вы' })}
          >
            {user ? 'Выйти' : 'Войти как «Вы»'}
          </button>
        </div>

        <TreeComments
          personalityId="p_001"
          initialComments={SEED_COMMENTS}
          currentUser={user}
        />
      </div>
    </div>
  );
}
