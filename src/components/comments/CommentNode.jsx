import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CornerDownRight, ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react';
import clsx from 'clsx';
import LikeButton from '../LikeButton.jsx';
import CommentForm from './CommentForm.jsx';

const MAX_VISUAL_DEPTH = 5;

function formatRelativeTime(iso) {
  const now = Date.now();
  const t = new Date(iso).getTime();
  const diff = Math.max(0, now - t) / 1000;
  if (diff < 60)    return 'только что';
  if (diff < 3600)  return `${Math.floor(diff / 60)} мин назад`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
  if (diff < 7 * 86400) return `${Math.floor(diff / 86400)} дн назад`;
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function CommentNode({
  comment,
  depth = 0,
  onReply,
  onLike,
  currentUser,
}) {
  const [replying, setReplying]   = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const children = comment.children ?? [];
  const indent = Math.min(depth, MAX_VISUAL_DEPTH);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="relative"
    >
      {/* Вертикальная линия ветки */}
      {depth > 0 && (
        <span
          aria-hidden="true"
          className="absolute left-3 top-0 bottom-0 w-px bg-ink-100"
        />
      )}

      <div className={clsx('group flex gap-3', depth > 0 && 'pl-7')}>
        {/* Аватар */}
        <div className="relative shrink-0">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-baikal-100 to-teal-50 grid place-items-center text-baikal-700 font-semibold text-sm">
            {(comment.author?.displayName ?? '?').slice(0, 1).toUpperCase()}
          </div>
          {depth > 0 && (
            <CornerDownRight
              aria-hidden="true"
              className="absolute -left-4 top-3 h-4 w-4 text-ink-300"
            />
          )}
        </div>

        {/* Тело */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-sm font-semibold text-ink-900">
              {comment.author?.displayName ?? 'Аноним'}
            </span>
            {comment.is_pinned && (
              <span className="chip chip-sand text-[10px] !py-0">Закреп</span>
            )}
            <time className="text-xs text-ink-500" dateTime={comment.created_at}>
              {formatRelativeTime(comment.created_at)}
            </time>
            {comment.is_edited && (
              <span className="text-xs text-ink-500">· изменено</span>
            )}
          </div>

          {comment.deleted_at ? (
            <p className="text-sm text-ink-500 italic mt-1">[комментарий удалён]</p>
          ) : (
            <p className="text-[15px] text-ink-700 leading-relaxed mt-1 whitespace-pre-wrap break-words">
              {comment.body}
            </p>
          )}

          {/* Действия */}
          <div className="mt-2 flex items-center gap-3 flex-wrap">
            <LikeButton
              initialCount={comment.like_count ?? 0}
              size="sm"
              onChange={(liked) => onLike?.(comment.id, liked)}
            />
            <button
              onClick={() => setReplying((v) => !v)}
              className="text-xs font-medium text-ink-500 hover:text-baikal-700"
              disabled={!currentUser}
              title={!currentUser ? 'Войдите, чтобы ответить' : undefined}
            >
              Ответить
            </button>
            {children.length > 0 && (
              <button
                onClick={() => setCollapsed((v) => !v)}
                className="inline-flex items-center gap-1 text-xs font-medium text-ink-500 hover:text-baikal-700"
              >
                {collapsed ? (
                  <>
                    <ChevronDown className="h-3.5 w-3.5" /> Показать ветку ({children.length})
                  </>
                ) : (
                  <>
                    <ChevronUp className="h-3.5 w-3.5" /> Свернуть
                  </>
                )}
              </button>
            )}
            <button
              className="ml-auto text-ink-400 hover:text-ink-700 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Действия с комментарием"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Форма ответа */}
          <AnimatePresence>
            {replying && (
              <motion.div
                key="reply-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                <CommentForm
                  autoFocus
                  compact
                  placeholder={`Ответить пользователю ${comment.author?.displayName ?? 'Аноним'}…`}
                  submitLabel="Ответить"
                  onCancel={() => setReplying(false)}
                  onSubmit={(text) => {
                    onReply?.(comment.id, text);
                    setReplying(false);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Дочерние ветки */}
          {!collapsed && children.length > 0 && (
            <ul className="mt-4 space-y-4 list-none">
              {children.map((c) => (
                <CommentNode
                  key={c.id}
                  comment={c}
                  depth={indent + 1}
                  onReply={onReply}
                  onLike={onLike}
                  currentUser={currentUser}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.li>
  );
}
