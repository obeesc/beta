import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LogIn, UserCircle2, Menu, X, Mail, Send } from 'lucide-react';

const PROVIDERS = [
  { id: 'google',   label: 'Google',   color: 'bg-white text-ink-900 border border-ink-200' },
  { id: 'yandex',   label: 'Yandex',   color: 'bg-[#FC3F1D] text-white' },
  { id: 'telegram', label: 'Telegram', color: 'bg-[#2AABEE] text-white' },
];

export default function Header({ user, onLogin, onLogout }) {
  const [authOpen, setAuthOpen]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const dialogRef = useRef(null);

  // Esc закрывает модалку
  useEffect(() => {
    if (!authOpen) return;
    const onKey = (e) => e.key === 'Escape' && setAuthOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [authOpen]);

  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    onLogin?.({ provider: 'email', email, displayName: email.split('@')[0] });
    setAuthOpen(false);
    setEmail('');
    setPassword('');
  };

  return (
    <header className="sticky top-0 z-40">
      <div className="glass border-b border-ink-100/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          {/* Лого */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-baikal-700 to-teal-500 grid place-items-center text-white font-display font-bold">
              Б
            </div>
            <span className="font-display font-bold text-ink-900 text-lg tracking-tight">
              Личности&nbsp;Бурятии
            </span>
          </a>

          {/* Навигация */}
          <nav className="hidden md:flex items-center gap-1 ml-6">
            {['Каталог', 'Карта', 'Сообщество', 'О проекте'].map((n) => (
              <a
                key={n}
                href="#"
                className="px-3 py-2 text-sm font-medium text-ink-700 rounded-lg
                           hover:bg-ink-100 transition-colors"
              >
                {n}
              </a>
            ))}
          </nav>

          {/* Поиск */}
          <div className="ml-auto hidden md:flex items-center bg-ink-100 rounded-full px-3 h-9 w-64 focus-within:ring-2 focus-within:ring-baikal-500/40 transition">
            <Search className="h-4 w-4 text-ink-500" />
            <input
              type="text"
              placeholder="Найти личность…"
              className="bg-transparent text-sm placeholder:text-ink-500 outline-none ml-2 w-full"
            />
            <kbd className="hidden lg:inline text-[10px] font-mono text-ink-500 border border-ink-200 rounded px-1.5">
              ⌘K
            </kbd>
          </div>

          {/* Авторизация */}
          {user ? (
            <button
              onClick={onLogout}
              className="btn-ghost gap-2"
              aria-label="Выйти из аккаунта"
            >
              <UserCircle2 className="h-5 w-5" />
              <span className="hidden sm:inline">{user.displayName}</span>
            </button>
          ) : (
            <button onClick={() => setAuthOpen(true)} className="btn-primary">
              <LogIn className="h-4 w-4" />
              Войти
            </button>
          )}

          {/* Мобильное меню */}
          <button
            className="md:hidden btn-ghost px-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Меню"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Мобильное выпадающее меню */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-ink-100 bg-white/90"
            >
              <div className="px-4 py-3 flex flex-col gap-1">
                {['Каталог', 'Карта', 'Сообщество', 'О проекте'].map((n) => (
                  <a key={n} href="#" className="px-3 py-2 rounded-lg text-ink-700 hover:bg-ink-100">
                    {n}
                  </a>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* Модалка авторизации */}
      <AnimatePresence>
        {authOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
              onClick={() => setAuthOpen(false)}
              aria-label="Закрыть"
            />
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-lift"
              initial={{ y: 20, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 10, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <h2 className="font-display text-xl font-bold">Войти на платформу</h2>
              <p className="text-sm text-ink-500 mt-1">
                Чтобы оставлять комментарии и ставить лайки.
              </p>

              <form onSubmit={submit} className="mt-5 space-y-3">
                <label className="block">
                  <span className="text-xs font-medium text-ink-700">Email</span>
                  <div className="mt-1 flex items-center gap-2 rounded-xl border border-ink-200 px-3 py-2 focus-within:ring-2 focus-within:ring-baikal-500/40">
                    <Mail className="h-4 w-4 text-ink-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@buryatia.dev"
                      className="bg-transparent outline-none text-sm w-full"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-ink-700">Пароль</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1 w-full rounded-xl border border-ink-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-baikal-500/40"
                  />
                </label>

                <button type="submit" className="btn-primary w-full">
                  <Send className="h-4 w-4" />
                  Продолжить
                </button>
              </form>

              <div className="my-5 flex items-center gap-3 text-xs text-ink-500">
                <span className="h-px bg-ink-200 flex-1" />
                или
                <span className="h-px bg-ink-200 flex-1" />
              </div>

              <div className="space-y-2">
                {PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onLogin?.({ provider: p.id, displayName: p.label + ' user' });
                      setAuthOpen(false);
                    }}
                    className={`btn w-full ${p.color} hover:opacity-90`}
                  >
                    Войти через {p.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
