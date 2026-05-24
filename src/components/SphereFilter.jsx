import { motion } from 'framer-motion';
import clsx from 'clsx';
import { SPHERES } from '../data/personalities.js';

export default function SphereFilter({ value, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Фильтр по сферам деятельности"
      className="flex flex-wrap gap-2"
    >
      {SPHERES.map((s) => {
        const active = value === s.id;
        return (
          <button
            key={s.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(s.id)}
            className={clsx(
              'relative inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium',
              'transition-colors duration-200',
              active ? 'text-white' : 'text-ink-700 hover:bg-ink-100'
            )}
          >
            {active && (
              <motion.span
                layoutId="sphere-pill"
                className="absolute inset-0 rounded-full bg-baikal-700"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{s.label}</span>
          </button>
        );
      })}
    </div>
  );
}
