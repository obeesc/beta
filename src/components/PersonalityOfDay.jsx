import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import LikeButton from './LikeButton.jsx';
import { SPHERE_LABEL } from '../data/personalities.js';

export default function PersonalityOfDay({ person }) {
  if (!person) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
      className="surface overflow-hidden grid md:grid-cols-2"
      aria-label="Личность дня"
    >
      <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[420px]">
        <img
          src={person.cover_image_url}
          alt={person.full_name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-baikal-900/60 via-transparent to-transparent" />
      </div>

      <div className="p-7 md:p-10 flex flex-col gap-5 justify-center">
        <div className="flex items-center gap-2">
          <span className="chip chip-sand">
            <Sparkles className="h-3.5 w-3.5" />
            Личность дня
          </span>
          {person.sphere.map((s) => (
            <span key={s} className="chip chip-baikal">
              {SPHERE_LABEL[s] ?? s}
            </span>
          ))}
        </div>

        <h2 className="font-display text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight">
          {person.full_name}
        </h2>
        {person.full_name_bur && (
          <p className="font-serif italic text-ink-500 -mt-3">{person.full_name_bur}</p>
        )}

        <p className="text-ink-700 leading-relaxed text-base md:text-lg">{person.summary}</p>

        {person.quotes?.[0] && (
          <blockquote className="border-l-2 border-sand-300 pl-4 font-serif italic text-ink-700">
            «{person.quotes[0].text}»
            <footer className="not-italic text-xs text-ink-500 mt-1">— {person.quotes[0].source}</footer>
          </blockquote>
        )}

        <div className="flex items-center gap-3 pt-2">
          <a href={`/personalities/${person.slug}`} className="btn-primary group">
            Открыть профиль
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <LikeButton initialCount={person.like_count} size="md" />
        </div>
      </div>
    </motion.section>
  );
}
