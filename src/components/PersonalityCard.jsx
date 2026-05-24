import { motion } from 'framer-motion';
import { MessageSquare, MapPin } from 'lucide-react';
import LikeButton from './LikeButton.jsx';
import { SPHERE_LABEL } from '../data/personalities.js';

export default function PersonalityCard({ person, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.22, 0.61, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="surface surface-hover overflow-hidden flex flex-col"
    >
      <a href={`/personalities/${person.slug}`} className="block relative aspect-[4/3] overflow-hidden">
        <img
          src={person.cover_image_url}
          alt={person.full_name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out-soft group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-900/60 to-transparent" />
        <div className="absolute left-3 bottom-3 flex flex-wrap gap-1.5">
          {person.sphere.slice(0, 2).map((s) => (
            <span key={s} className="chip glass !text-white !bg-white/15 !border-white/25 text-[11px]">
              {SPHERE_LABEL[s] ?? s}
            </span>
          ))}
        </div>
      </a>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <header>
          <h3 className="font-display font-bold text-lg leading-tight">
            <a href={`/personalities/${person.slug}`} className="hover:text-baikal-700 transition-colors">
              {person.full_name}
            </a>
          </h3>
          <p className="text-xs text-ink-500 mt-1 flex items-center gap-1.5">
            <span className="tabular-nums">
              {person.birth_year}
              {person.death_year ? ` – ${person.death_year}` : ''}
            </span>
            {person.birth_place && (
              <>
                <span aria-hidden="true">·</span>
                <MapPin className="h-3 w-3" />
                <span className="truncate">{person.birth_place}</span>
              </>
            )}
          </p>
        </header>

        <p className="text-sm text-ink-700 leading-relaxed line-clamp-3">{person.summary}</p>

        <footer className="mt-auto flex items-center justify-between pt-3 border-t border-ink-100">
          <LikeButton initialCount={person.like_count} size="sm" />
          <a
            href={`/personalities/${person.slug}#comments`}
            className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-baikal-700"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="tabular-nums">{person.comment_count}</span>
          </a>
        </footer>
      </div>
    </motion.article>
  );
}
