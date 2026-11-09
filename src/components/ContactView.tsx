import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Bike, Wrench } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../locales/translations';

interface ContactViewProps {
  lang: Language;
}

export const ContactView: React.FC<ContactViewProps> = ({ lang }) => {
  const t = translations[lang];

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSubmitted(true);
    setTimeout(() => {
      setForm({ name: '', email: '', phone: '', message: '' });
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-red-500">
          VELOZONE SHOWROOM & WORKSHOP
        </span>
        <h1 className="mt-2 text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-white">
          {t.contact.title}
        </h1>
        <p className="mt-3 text-base text-neutral-400">
          {t.contact.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Showroom info cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-950/70 text-red-500 border border-red-900/50">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  {t.contact.addressTitle}
                </h3>
                <p className="mt-1 text-sm font-semibold text-white">
                  {t.contact.addressValue}
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">ვაკე, ჭავჭავაძის გამზირი (უფასო საპარკინგე ზონით)</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-950/70 text-red-500 border border-red-900/50">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  {t.contact.workingHoursTitle}
                </h3>
                <p className="mt-1 text-sm font-semibold text-white">
                  {t.contact.workingHoursValue}
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">დასვენების დღეების გარეშე</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-950/70 text-red-500 border border-red-900/50">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  {t.contact.phoneTitle}
                </h3>
                <p className="mt-1 text-sm font-semibold font-mono text-white">
                  {t.contact.phoneValue}
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">ცხელი ხაზი: 10:00 - 20:00</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-950/70 text-red-500 border border-red-900/50">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  {t.contact.emailTitle}
                </h3>
                <p className="mt-1 text-sm font-semibold font-mono text-white">
                  {t.contact.emailValue}
                </p>
              </div>
            </div>
          </div>

          {/* Showroom Services */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              შოურუმის ექსკლუზიური სერვისები
            </h3>
            <div className="space-y-3 text-xs text-neutral-300">
              <div className="flex items-center gap-2.5">
                <Bike className="w-4 h-4 text-red-500 shrink-0" />
                <span>ტესტ-დრაივი ნებისმიერ მოდელზე შეძენამდე</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Wrench className="w-4 h-4 text-red-500 shrink-0" />
                <span>პროფესიონალური Bike Fitting და ანატომიური მორგება</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>უფასო პირველადი ტექნიკური დაზეთვა და რეგულირება</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-10 shadow-xl">
            <h2 className="text-xl font-black font-display uppercase tracking-tight text-white mb-2">
              {t.contact.formTitle}
            </h2>
            <p className="text-xs text-neutral-400 mb-6">
              დაგვიტოვეთ თქვენი კითხვა ან მოთხოვნა და VELOZONE-ის კონსულტანტი 15 წუთში გიპასუხებთ.
            </p>

            {submitted ? (
              <div className="rounded-xl border border-emerald-800 bg-emerald-950/40 p-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-white">{t.contact.sentSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    {t.contact.yourName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="მაგ: გიორგი"
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      {t.contact.yourEmail} *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="giorgi@mail.ge"
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      {t.contact.yourPhone}
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+995 599 00 00 00"
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    {t.contact.message} *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={t.contact.messagePlaceholder}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-950/40"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.contact.send}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
