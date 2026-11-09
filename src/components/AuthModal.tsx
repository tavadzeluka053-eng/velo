import React, { useState } from 'react';
import { X, LogIn, User, ShieldCheck, Plus } from 'lucide-react';
import { UserProfile, Language } from '../types';
import { translations } from '../locales/translations';
import { storageService } from '../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onUserChange: (user: UserProfile | null) => void;
  lang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  lang,
}) => {
  if (!isOpen) return null;

  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'google' | 'email'>('google');
  const [isCustomGoogleOpen, setIsCustomGoogleOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  const handleSelectGoogleAccount = (email: string, name: string) => {
    const user = storageService.loginWithGoogle(email, name);
    onUserChange(user);
    setIsCustomGoogleOpen(false);
    onClose();
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawEmail = customGoogleEmail.trim().toLowerCase();
    const rawName = customGoogleName.trim();
    if (!rawEmail && !rawName) return;

    const email = rawEmail || `${rawName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'user'}@gmail.com`;
    const name = rawName || email.split('@')[0];

    const user = storageService.loginWithGoogle(email, name);
    onUserChange(user);
    setIsCustomGoogleOpen(false);
    onClose();
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    const user = storageService.loginWithEmail(customEmail, customName || customEmail.split('@')[0]);
    onUserChange(user);
    onClose();
  };

  const handleLogout = () => {
    storageService.logout();
    onUserChange(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-[460px] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden transition-all duration-200 ${
          activeTab === 'google' && !currentUser
            ? 'bg-white text-[#1f1f1f] border border-[#dadce0]'
            : 'bg-neutral-950 text-white border border-neutral-800'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors z-10 ${
            activeTab === 'google' && !currentUser
              ? 'text-[#5f6368] hover:text-[#1f1f1f] hover:bg-[#f1f3f4]'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {currentUser ? (
          /* Profile & Sign Out View */
          <div className="text-center py-2 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-950/60 text-red-500 border border-red-900/50">
              {currentUser.isAdmin ? (
                <ShieldCheck className="w-9 h-9" />
              ) : (
                <User className="w-9 h-9" />
              )}
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-neutral-500 block">
                {t.auth.welcomeUser}
              </span>
              <h3 className="text-xl font-black font-display text-white mt-1">
                {currentUser.fullName}
              </h3>
              <p className="text-xs font-mono text-neutral-400">{currentUser.email}</p>
            </div>

            {/* Role indicator */}
            <div className="pt-2">
              {currentUser.isAdmin ? (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-red-950/80 border border-red-700 px-3 py-1 text-xs font-bold text-red-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t.auth.adminBadge}</span>
                </div>
              ) : (
                <div className="rounded-lg bg-neutral-900 border border-neutral-800 p-3 text-xs text-neutral-400">
                  <p className="font-semibold text-neutral-300">მომხმარებლის პროფილი</p>
                  <p className="text-[11px] mt-1 text-neutral-500">{t.auth.regularUserNotice}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-neutral-800 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-lg border border-neutral-800 py-2.5 text-xs font-bold uppercase text-neutral-300 hover:text-white"
              >
                დახურვა
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-lg bg-red-600/20 border border-red-900/60 py-2.5 text-xs font-bold uppercase text-red-400 hover:bg-red-900/40"
              >
                {t.auth.signOut}
              </button>
            </div>
          </div>
        ) : (
          /* Sign In & Google Account Chooser */
          <div>
            {/* Top Navigation Tabs */}
            {activeTab === 'google' ? (
              <div className="flex items-center gap-2 mb-5 p-1 bg-[#f1f3f4] rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('google')}
                  className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-white text-[#1f1f1f] shadow-sm flex items-center justify-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google Account</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('email')}
                  className="flex-1 py-1.5 text-xs font-semibold rounded-lg text-[#5f6368] hover:text-[#1f1f1f] transition-colors"
                >
                  {lang === 'ka' ? 'ელ-ფოსტით' : 'Email'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-neutral-900 rounded-xl border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('google')}
                  className="py-2 text-xs font-bold rounded-lg text-neutral-400 hover:text-white transition-colors"
                >
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('email')}
                  className="py-2 text-xs font-bold rounded-lg bg-neutral-800 text-white shadow-sm"
                >
                  {lang === 'ka' ? 'ელ-ფოსტით' : 'Email'}
                </button>
              </div>
            )}

            {activeTab === 'google' ? (
              /* Authentic Google Account Selection (Matches image_83d58b79.png) */
              <div className="space-y-4">
                {/* Header with Google Logo & 'to continue to VELOZONE' */}
                <div className="pb-1">
                  <div className="mb-2">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-normal text-[#1f1f1f]">
                    {lang === 'ka' ? 'Google ანგარიშის არჩევა' : 'Choose an account'}
                  </h3>
                  <p className="text-sm text-[#444746] mt-0.5">
                    {lang === 'ka' ? 'VELOZONE-ში გადასასვლელად: ' : 'to continue to '}
                    <span className="text-[#1a73e8] font-medium">VELOZONE</span>
                  </p>
                </div>

                {/* Account Rows (Identical to user photograph) */}
                <div className="divide-y divide-[#e0e0e0] border-t border-b border-[#e0e0e0]">
                  {/* Account 1: luka tavadze (Teal circle 'l') */}
                  <button
                    onClick={() => handleSelectGoogleAccount('tavadzeluka053@gmail.com', 'luka tavadze')}
                    className="w-full flex items-center gap-3.5 py-3 px-2 hover:bg-[#f8f9fa] transition-colors text-left group"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#00897b] flex items-center justify-center text-white font-normal text-sm shrink-0">
                      l
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[#1f1f1f] group-hover:text-[#1a73e8] transition-colors leading-tight">
                        luka tavadze
                      </div>
                      <div className="text-xs text-[#5f6368] font-normal leading-tight mt-0.5">
                        tavadzeluka053@gmail.com
                      </div>
                    </div>
                  </button>

                  {/* Account 2: Use another account (Circle with user silhouette) */}
                  {!isCustomGoogleOpen ? (
                    <button
                      onClick={() => setIsCustomGoogleOpen(true)}
                      className="w-full flex items-center gap-3.5 py-3 px-2 hover:bg-[#f8f9fa] transition-colors text-left group"
                    >
                      <div className="w-9 h-9 rounded-full border border-[#747775] flex items-center justify-center text-[#5f6368] shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-[#1f1f1f] group-hover:text-[#1a73e8] transition-colors">
                        {lang === 'ka' ? 'სხვა ანგარიშის გამოყენება' : 'Use another account'}
                      </span>
                    </button>
                  ) : (
                    <form onSubmit={handleCustomGoogleSubmit} className="py-3 px-2 space-y-3 bg-[#f8f9fa]">
                      <div>
                        <label className="block text-xs font-medium text-[#444746] mb-1">
                          {lang === 'ka' ? 'ელ-ფოსტა ან ტელეფონი' : 'Email or phone'}
                        </label>
                        <input
                          type="email"
                          autoFocus
                          required
                          placeholder="email@gmail.com"
                          value={customGoogleEmail}
                          onChange={(e) => setCustomGoogleEmail(e.target.value)}
                          className="w-full rounded-md border border-[#747775] bg-white px-3 py-2 text-sm text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder={lang === 'ka' ? 'თქვენი სახელი (სურვილისამებრ)' : 'Your name (optional)'}
                          value={customGoogleName}
                          onChange={(e) => setCustomGoogleName(e.target.value)}
                          className="w-full rounded-md border border-[#747775] bg-white px-3 py-2 text-sm text-[#1f1f1f] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsCustomGoogleOpen(false)}
                          className="px-4 py-2 text-xs font-medium text-[#1a73e8] hover:bg-[#f1f3f4] rounded-md transition-colors"
                        >
                          {lang === 'ka' ? 'გაუქმება' : 'Cancel'}
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-md transition-colors shadow-sm"
                        >
                          {lang === 'ka' ? 'შემდეგი' : 'Next'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Privacy & Terms Note (Matches image_83d58b79.png) */}
                <div className="pt-2 text-xs text-[#5f6368] leading-relaxed">
                  {lang === 'ka' ? (
                    <>
                      ამ აპლიკაციის გამოყენებამდე შეგიძლიათ გაეცნოთ VELOZONE-ის{' '}
                      <span className="text-[#1a73e8] hover:underline cursor-pointer">კონფიდენციალურობის პოლიტიკას</span> და{' '}
                      <span className="text-[#1a73e8] hover:underline cursor-pointer">მომსახურების პირობებს</span>.
                    </>
                  ) : (
                    <>
                      Before using this app, you can review VELOZONE's{' '}
                      <span className="text-[#1a73e8] hover:underline cursor-pointer">Privacy Policy</span> and{' '}
                      <span className="text-[#1a73e8] hover:underline cursor-pointer">Terms of Service</span>.
                    </>
                  )}
                </div>

                {/* Bottom Footer (Language & Help/Privacy/Terms links) */}
                <div className="pt-6 border-t border-[#f1f3f4] flex items-center justify-between text-xs text-[#747775]">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-[#1f1f1f]">
                    <span>{lang === 'ka' ? 'English (United States)' : 'English (United States)'}</span>
                    <span className="text-[10px]">▾</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="cursor-pointer hover:text-[#1f1f1f]">Help</span>
                    <span className="cursor-pointer hover:text-[#1f1f1f]">Privacy</span>
                    <span className="cursor-pointer hover:text-[#1f1f1f]">Terms</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Email View */
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                    {t.auth.nameLabel}
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="მაგ: გიორგი მაისურაძე"
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-400 mb-1">
                    {t.auth.emailLabel} *
                  </label>
                  <input
                    type="email"
                    required
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-red-600 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-950/40"
                >
                  {t.auth.signIn}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
