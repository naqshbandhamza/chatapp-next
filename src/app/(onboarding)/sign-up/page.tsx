'use client';

import { Poppins, Inter } from 'next/font/google';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const display = Poppins({
  weight: ['500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-display',
});

const body = Inter({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-body',
});

/* ---------- Icons (feather-style line icons, matches homepage) ---------- */
type IconProps = { className?: string };

const UserIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 6-10 7L2 6" />
  </svg>
);

const LockIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ArrowIcon = ({ className = 'w-4 h-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const MessageIcon = ({ className = 'w-4 h-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

/* Shared input styling helper */
const inputClass =
  'w-full rounded-xl border border-gray-200 pl-11 pr-4 py-3 text-sm outline-none transition-shadow focus:ring-2';
const ringStyle = { ['--tw-ring-color' as any]: 'rgba(108,92,231,0.35)' };

export default function SignUp() {
  const router = useRouter();

  const fnameRef = useRef<HTMLInputElement>(null);
  const lnameRef = useRef<HTMLInputElement>(null);

  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const firstname = fnameRef.current?.value;
    const lastname = lnameRef.current?.value;
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

    if (firstname?.trim() === "" || lastname?.trim() === "") {
      setLoading(false)
      setError("name fields cannot be empty")
      return;
    }

    if (confirmPassword !== password) {
      setLoading(false)
      setError("passwords dont match")
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstname, lastname, username, email, password }),
      });

      const res_json = await res.json();

      if (res_json.success)
        router.push('/sign-in');


      setError(res_json.message)
      setLoading(false)
    } catch (err: any) {
      setLoading(false)

    } finally {
    }
  };

  return (
    <div className={`${display.variable} ${body.variable}`} style={{ fontFamily: 'var(--font-body)' }}>
      <style>{`
        :root {
          --purple: #6C5CE7;
          --purple-dark: #5647C7;
          --ink: #1E1B4B;
          --muted: #6B7280;
        }
        .grad-btn { background: linear-gradient(135deg, #7B6EF6, #6C5CE7); }
        .grad-logo { background: linear-gradient(135deg, #4F9BFF, #8B5CF6); }
        .grad-hero-bg { background: linear-gradient(180deg, #EEF1FD 0%, #F2F4FC 35%, #FFFFFF 65%, #FFFFFF 100%); }
      `}</style>

      <div className="min-h-screen w-full grad-hero-bg" style={{ color: 'var(--ink)' }}>
        {/* NAV */}
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
            <a href="/" className="flex items-center gap-2 text-xl" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              <span className="w-8 h-8 rounded-full grad-logo flex items-center justify-center text-white">
                <MessageIcon className="w-4 h-4" />
              </span>
              chime
            </a>
            <a href="/" className="text-sm font-medium hover:text-[var(--ink)] transition-colors" style={{ color: 'var(--muted)' }}>
              ← Back to Home
            </a>
          </div>
        </nav>

        {/* SIGN UP */}
        <main className="max-w-7xl mx-auto px-6 py-16 md:py-20 flex flex-col items-center">
          <span
            className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 bg-white shadow-sm"
            style={{ color: 'var(--purple-dark)' }}
          >
            A New Way to Connect
          </span>
          <h1
            className="text-3xl sm:text-4xl text-center mb-3"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
          >
            Sign Up to <span style={{ color: 'var(--purple)' }}>Chime</span>
          </h1>
          <p className="text-base text-center mb-10 max-w-sm" style={{ color: 'var(--muted)' }}>
            Where the real ones chat. Create an account and jump into the conversation.
          </p>

          <div className="w-full max-w-[460px] rounded-3xl bg-white shadow-xl border border-gray-100 p-8">
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }}>
                  <UserIcon className="w-4.5 h-4.5" />
                </span>
                <input
                  ref={fnameRef}
                  className={inputClass}
                  style={ringStyle}
                  type="text"
                  name="fname"
                  placeholder="First Name"
                />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }}>
                  <UserIcon className="w-4.5 h-4.5" />
                </span>
                <input
                  ref={lnameRef}
                  className={inputClass}
                  style={ringStyle}
                  type="text"
                  name="lname"
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div className="relative mb-5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }}>
                <UserIcon className="w-4.5 h-4.5" />
              </span>
              <input
                ref={usernameRef}
                className={inputClass}
                style={ringStyle}
                type="text"
                name="username"
                placeholder="Username"
              />
            </div>

            <div className="relative mb-5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }}>
                <MailIcon className="w-4.5 h-4.5" />
              </span>
              <input
                ref={emailRef}
                className={inputClass}
                style={ringStyle}
                type="email"
                name="email"
                placeholder="email@email.com"
              />
            </div>

            <div className="relative mb-5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }}>
                <LockIcon className="w-4.5 h-4.5" />
              </span>
              <input
                ref={passwordRef}
                className={inputClass}
                style={ringStyle}
                type="password"
                name="password"
                placeholder="Password"
              />
            </div>

            <div className="relative mb-6">
              <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }}>
                <LockIcon className="w-4.5 h-4.5" />
              </span>
              <input
                ref={confirmPasswordRef}
                className={inputClass}
                style={ringStyle}
                type="password"
                name="confirm-password"
                placeholder="Confirm Password"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="grad-btn w-full text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? 'Signing Up…' : 'Sign Up'}
              {!loading && <ArrowIcon className="w-4 h-4" />}
            </button>

            {error && (
              <p className="text-sm mt-4 text-center rounded-lg py-2" style={{ color: '#DC2626', background: '#FEF2F2' }}>
                {error}
              </p>
            )}

            <p className="text-sm text-center mt-6" style={{ color: 'var(--muted)' }}>
              Already have an account?{' '}
              <a href="/sign-in" className="font-semibold" style={{ color: 'var(--purple)' }}>
                Sign in
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}


