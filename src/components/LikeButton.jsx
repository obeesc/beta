import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import clsx from 'clsx';

// Анимированный лайк со счётчиком и эффектом «взрыва» частиц.
export default function LikeButton({
  initialCount = 0,
  initialLiked = false,
  onChange,
  size = 'md',
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [burstKey, setBurstKey] = useState(0);

  const toggle = () => {
    const next = !liked;
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));
    if (next) setBurstKey((k) => k + 1);
    onChange?.(next);
  };

  const sz = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';

  return (
    <button
      onClick={toggle}
      aria-pressed={liked}
      aria-label={liked ? 'Убрать лайк' : 'Поставить лайк'}
      className={clsx(
        'relative inline-flex items-center gap-2 rounded-full px-3 py-1.5',
        'border transition-colors duration-200',
        liked
          ? 'border-rose-200 bg-rose-50 text-rose-600'
          : 'border-ink-200 bg-white text-ink-700 hover:border-rose-200 hover:text-rose-500'
      )}
    >
      <span className="relative grid place-items-center">
        <motion.span
          key={liked ? 'on' : 'off'}
          initial={{ scale: 1 }}
          animate={liked ? { scale: [1, 1.35, 1] } : { scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="grid place-items-center"
        >
          <Heart className={clsx(sz, liked && 'fill-current')} />
        </motion.span>

        {/* Частицы */}
        <AnimatePresence>
          {liked && (
            <Particles key={burstKey} />
          )}
        </AnimatePresence>
      </span>

      <motion.span
        key={count}
        initial={{ y: -4, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="text-sm font-semibold tabular-nums"
      >
        {Intl.NumberFormat('ru-RU').format(count)}
      </motion.span>
    </button>
  );
}

function Particles() {
  const items = Array.from({ length: 8 });
  return (
    <span className="pointer-events-none absolute inset-0">
      {items.map((_, i) => {
        const angle = (i / items.length) * Math.PI * 2;
        const dist = 18 + (i % 2) * 4;
        return (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              opacity: 0,
              scale: 1,
            }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-400"
          />
        );
      })}
    </span>
  );
}
