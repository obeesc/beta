import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function QuoteOfDay({ quote }) {
  if (!quote) return null;
  return (
    <motion.aside
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="surface p-6 md:p-7 bg-gradient-to-br from-baikal-50 to-white"
      aria-label="Цитата дня"
    >
      <Quote className="h-6 w-6 text-baikal-500" />
      <p className="font-serif text-xl md:text-2xl leading-snug text-ink-900 mt-3">
        «{quote.text}»
      </p>
      <p className="text-sm text-ink-500 mt-3">— {quote.author}</p>
    </motion.aside>
  );
}
