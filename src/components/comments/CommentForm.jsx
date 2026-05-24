import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, X } from 'lucide-react';

// Универсальная форма: и для корневого комментария, и для ответа в ветке.
export default function CommentForm({
  onSubmit,
  onCancel,
  placeholder = 'Поделитесь мнением…',
  autoFocus = false,
  compact = false,
  submitLabel = 'Отправить',
}) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  // Авто-рост textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, [text]);

  const submit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit?.(trimmed);
    setText('');
  };

  return (
    <motion.form
      onSubmit={submit}
      initial={compact ? { opacity: 0, y: -4 } : false}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl border border-ink-200 bg-white
                  focus-within:border-baikal-500/60 focus-within:ring-2 focus-within:ring-baikal-500/15
                  transition ${compact ? 'p-2' : 'p-3'}`}
    >
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={compact ? 2 : 3}
        placeholder={placeholder}
        className="w-full resize-none bg-transparent outline-none text-sm placeholder:text-ink-500 leading-relaxed"
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') submit(e);
          if (e.key === 'Escape') onCancel?.();
        }}
      />
      <div className="flex items-center justify-between gap-2 mt-2">
        <p className="text-[11px] text-ink-500">
          <kbd className="rounded border border-ink-200 px-1">⌘</kbd>
          <kbd className="rounded border border-ink-200 px-1 ml-0.5">↵</kbd>{' '}
          — отправить
        </p>
        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-ghost !px-3 !py-1.5 text-xs"
            >
              <X className="h-3.5 w-3.5" />
              Отмена
            </button>
          )}
          <button
            type="submit"
            disabled={!text.trim()}
            className="btn-primary !px-4 !py-1.5 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="h-3.5 w-3.5" />
            {submitLabel}
          </button>
        </div>
      </div>
    </motion.form>
  );
}
