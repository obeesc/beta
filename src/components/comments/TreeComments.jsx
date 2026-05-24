import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import CommentForm from './CommentForm.jsx';
import CommentNode from './CommentNode.jsx';

// =====================================================================
// Древовидные комментарии
// ---------------------------------------------------------------------
//   Плоский список из БД (см. таблицу `comments` с полем parent_id)
//   превращается в дерево функцией buildTree. На фронте дерево — обычный
//   рекурсивный список <ul><li><ul>…</ul></li></ul>, отрисовкой одного
//   узла занимается <CommentNode />, форма — <CommentForm />.
// =====================================================================

function buildTree(flat) {
  const byId = new Map();
  const roots = [];
  for (const c of flat) byId.set(c.id, { ...c, children: [] });
  for (const c of byId.values()) {
    if (c.parent_id && byId.has(c.parent_id)) {
      byId.get(c.parent_id).children.push(c);
    } else {
      roots.push(c);
    }
  }
  const sortRec = (arr) => {
    arr.sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
      return new Date(a.created_at) - new Date(b.created_at);
    });
    for (const n of arr) sortRec(n.children);
  };
  sortRec(roots);
  return roots;
}

function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'c_' + Math.random().toString(36).slice(2, 10);
}

export default function TreeComments({
  personalityId,
  initialComments = [],
  currentUser,
}) {
  const [comments, setComments] = useState(initialComments);
  const [sort, setSort]         = useState('new'); // 'new' | 'top'

  const tree = useMemo(() => {
    const sorted = sort === 'top'
      ? [...comments].sort((a, b) => (b.like_count ?? 0) - (a.like_count ?? 0))
      : comments;
    return buildTree(sorted);
  }, [comments, sort]);

  const addComment = (body, parent_id = null) => {
    if (!currentUser) return;
    const newComment = {
      id: makeId(),
      personality_id: personalityId,
      parent_id,
      author: {
        id: currentUser.id ?? 'me',
        displayName: currentUser.displayName ?? 'Вы',
      },
      body,
      like_count: 0,
      is_edited: false,
      is_pinned: false,
      created_at: new Date().toISOString(),
    };
    setComments((cs) => [...cs, newComment]);
    // TODO: POST /api/comments + триггер инкрементит personalities.comment_count
  };

  const handleLike = (commentId, liked) => {
    setComments((cs) =>
      cs.map((c) =>
        c.id === commentId
          ? { ...c, like_count: (c.like_count ?? 0) + (liked ? 1 : -1) }
          : c
      )
    );
    // TODO: POST/DELETE /api/likes (target_type=comment)
  };

  return (
    <section id="comments" className="surface p-5 md:p-7">
      <header className="flex items-center justify-between gap-3 mb-5">
        <h3 className="font-display text-xl font-bold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-baikal-700" />
          Обсуждение
          <span className="text-ink-500 font-normal text-base">({comments.length})</span>
        </h3>

        <div className="inline-flex rounded-full bg-ink-100 p-1 text-xs font-medium">
          {[
            { id: 'new', label: 'Сначала новые' },
            { id: 'top', label: 'Популярные' },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSort(opt.id)}
              className={`px-3 py-1 rounded-full transition ${
                sort === opt.id ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </header>

      {/* Корневая форма */}
      {currentUser ? (
        <CommentForm
          placeholder="Напишите первый комментарий…"
          onSubmit={(text) => addComment(text, null)}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50 px-4 py-5 text-sm text-ink-500 text-center">
          Чтобы оставить комментарий, войдите в аккаунт.
        </div>
      )}

      {/* Лента */}
      <ul className="mt-6 space-y-6 list-none">
        <AnimatePresence initial={false}>
          {tree.map((c) => (
            <CommentNode
              key={c.id}
              comment={c}
              depth={0}
              currentUser={currentUser}
              onReply={(parentId, text) => addComment(text, parentId)}
              onLike={handleLike}
            />
          ))}
        </AnimatePresence>
      </ul>

      {tree.length === 0 && (
        <p className="mt-8 text-center text-sm text-ink-500">
          Пока тихо. Будьте первым, кто оставит мысль.
        </p>
      )}
    </section>
  );
}
