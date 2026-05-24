import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header.jsx';
import PersonalityOfDay from '../components/PersonalityOfDay.jsx';
import QuoteOfDay from '../components/QuoteOfDay.jsx';
import SphereFilter from '../components/SphereFilter.jsx';
import PersonalityCard from '../components/PersonalityCard.jsx';
import {
  PERSONALITIES,
  pickPersonalityOfDay,
  pickQuoteOfDay,
} from '../data/personalities.js';

export default function HomePage() {
  const [user, setUser]       = useState(null);
  const [sphere, setSphere]   = useState('all');

  const personOfDay = useMemo(() => pickPersonalityOfDay(), []);
  const quoteOfDay  = useMemo(() => pickQuoteOfDay(), []);

  const filtered = useMemo(() => {
    if (sphere === 'all') return PERSONALITIES;
    return PERSONALITIES.filter((p) => p.sphere.includes(sphere));
  }, [sphere]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        user={user}
        onLogin={(u) => setUser(u)}
        onLogout={() => setUser(null)}
      />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="chip chip-teal">Культурное наследие · 2026</span>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight mt-4 leading-[1.05]">
              Лица, которые сделали{' '}
              <span className="bg-gradient-to-r from-baikal-700 to-teal-500 bg-clip-text text-transparent">
                Бурятию
              </span>{' '}
              узнаваемой миру.
            </h1>
            <p className="mt-5 text-lg text-ink-700 max-w-2xl">
              Биографии, цитаты и интерактивная карта районов — современный портал
              о выдающихся людях, родившихся в нашем регионе.
            </p>
          </motion.div>
        </section>

        {/* Личность дня + Цитата дня */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PersonalityOfDay person={personOfDay} />
            </div>
            <div className="lg:col-span-1">
              <QuoteOfDay quote={quoteOfDay} />
            </div>
          </div>
        </section>

        {/* Каталог */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
          <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">Каталог личностей</h2>
              <p className="text-ink-500 text-sm mt-1">
                {filtered.length} из {PERSONALITIES.length} — фильтр по сфере деятельности.
              </p>
            </div>
            <SphereFilter value={sphere} onChange={setSphere} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p, i) => (
              <PersonalityCard key={p.id} person={p} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="surface p-10 text-center text-ink-500">
              По выбранной сфере пока нет личностей.
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-ink-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-sm text-ink-500 flex flex-wrap justify-between gap-3">
          <div>© 2026 Личности Бурятии. Открытый культурный проект.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-ink-700">Контакты</a>
            <a href="#" className="hover:text-ink-700">Сообщить о неточности</a>
            <a href="#" className="hover:text-ink-700">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
