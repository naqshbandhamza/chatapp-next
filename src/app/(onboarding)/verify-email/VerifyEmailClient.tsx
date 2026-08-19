'use client';

import { Poppins, Inter } from 'next/font/google';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';


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

const MailIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 6-10 7L2 6" />
  </svg>
);

const ArrowIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const MessageIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((current) => current - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleOtpChange = (
    index: number,
    value: string
  ) => {
    // Only allow numbers
    const numericValue = value.replace(/\D/g, '');

    if (!numericValue) {
      const updated = [...otp];
      updated[index] = '';
      setOtp(updated);
      return;
    }

    const updated = [...otp];

    // Handle pasted/multiple digits
    const digits = numericValue.slice(0, 6 - index);

    digits.split('').forEach((digit, offset) => {
      updated[index + offset] = digit;
    });

    setOtp(updated);

    const nextIndex = Math.min(
      index + digits.length,
      5
    );

    inputRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === 'Backspace' &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');

    setError('');
    setMessage('');

    if (code.length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    if (!email) {
      setError('Verification email is missing.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/verify-email', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: code,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error ||
          data.message ||
          'Invalid verification code.'
        );
        return;
      }

      setMessage('Email verified successfully!');

      // Give the user a moment to see the success message
      setTimeout(() => {
        router.push('/sign-in');
      }, 1000);

    } catch {
      setError('Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending || !email) {
      return;
    }

    setError('');
    setMessage('');
    setResending(true);

    try {
      const res = await fetch('/api/resend-verification', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error ||
          data.message ||
          'Unable to resend verification code.'
        );
        return;
      }

      setMessage('A new verification code has been sent.');
      setCooldown(60);

      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();

    } catch {
      setError('Unable to connect to the server.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      className={`${display.variable} ${body.variable}`}
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <style>{`
        :root {
          --purple: #6C5CE7;
          --purple-dark: #5647C7;
          --ink: #1E1B4B;
          --muted: #6B7280;
        }

        .grad-btn {
          background: linear-gradient(
            135deg,
            #7B6EF6,
            #6C5CE7
          );
        }

        .grad-logo {
          background: linear-gradient(
            135deg,
            #4F9BFF,
            #8B5CF6
          );
        }

        .grad-hero-bg {
          background: linear-gradient(
            180deg,
            #EEF1FD 0%,
            #F2F4FC 35%,
            #FFFFFF 65%,
            #FFFFFF 100%
          );
        }
      `}</style>

      <div
        className="min-h-screen w-full grad-hero-bg"
        style={{ color: 'var(--ink)' }}
      >

        {/* NAV */}

        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

            <a
              href="/"
              className="flex items-center gap-2 text-xl"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
              }}
            >
              <span className="w-8 h-8 rounded-full grad-logo flex items-center justify-center text-white">
                <MessageIcon className="w-4 h-4" />
              </span>

              chime
            </a>

            <a
              href="/"
              className="text-sm font-medium transition-colors"
              style={{ color: 'var(--muted)' }}
            >
              ← Back to Home
            </a>

          </div>
        </nav>

        {/* CONTENT */}

        <main className="max-w-7xl mx-auto px-6 py-16 md:py-20 flex flex-col items-center">

          <span
            className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 bg-white shadow-sm"
            style={{ color: 'var(--purple-dark)' }}
          >
            Almost there
          </span>

          <h1
            className="text-3xl sm:text-4xl text-center mb-3"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
            }}
          >
            Verify your{' '}
            <span style={{ color: 'var(--purple)' }}>
              email
            </span>
          </h1>

          <p
            className="text-base text-center mb-10 max-w-md"
            style={{ color: 'var(--muted)' }}
          >
            We sent a 6-digit verification code to
            <br />

            <span className="font-semibold text-gray-800">
              {email}
            </span>
          </p>

          <div className="w-full max-w-[460px] rounded-3xl bg-white shadow-xl border border-gray-100 p-8">

            <div className="flex justify-center mb-7">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'rgba(108,92,231,0.1)',
                  color: 'var(--purple)',
                }}
              >
                <MailIcon className="w-7 h-7" />
              </div>
            </div>

            <h2
              className="text-xl text-center mb-2"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
              }}
            >
              Enter your code
            </h2>

            <p
              className="text-sm text-center mb-7"
              style={{ color: 'var(--muted)' }}
            >
              The code expires in 10 minutes.
            </p>

            {/* OTP */}

            <div className="flex justify-center gap-2 sm:gap-3 mb-7">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  value={digit}
                  onChange={(event) =>
                    handleOtpChange(
                      index,
                      event.target.value
                    )
                  }
                  onKeyDown={(event) =>
                    handleKeyDown(index, event)
                  }
                  inputMode="numeric"
                  maxLength={6}
                  className="w-11 h-13 sm:w-12 sm:h-14 rounded-xl border border-gray-200 text-center text-xl font-semibold outline-none transition-shadow focus:ring-2"
                  style={{
                    ['--tw-ring-color' as any]:
                      'rgba(108,92,231,0.35)',
                  }}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {/* VERIFY */}

            <button
              onClick={handleVerify}
              disabled={loading}
              className="grad-btn w-full text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading
                ? 'Verifying…'
                : 'Verify Email'}

              {!loading && (
                <ArrowIcon className="w-4 h-4" />
              )}
            </button>

            {/* ERROR */}

            {error && (
              <p
                className="text-sm mt-4 text-center rounded-lg py-2 px-3"
                style={{
                  color: '#DC2626',
                  background: '#FEF2F2',
                }}
              >
                {error}
              </p>
            )}

            {/* SUCCESS */}

            {message && (
              <p
                className="text-sm mt-4 text-center rounded-lg py-2 px-3"
                style={{
                  color: '#059669',
                  background: '#ECFDF5',
                }}
              >
                {message}
              </p>
            )}

            {/* RESEND */}

            <div className="text-center mt-6">
              <p
                className="text-sm"
                style={{ color: 'var(--muted)' }}
              >
                Didn't receive the code?
              </p>

              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0 || resending}
                className="mt-1 text-sm font-semibold disabled:opacity-50"
                style={{ color: 'var(--purple)' }}
              >
                {resending
                  ? 'Sending…'
                  : cooldown > 0
                    ? `Resend code in ${cooldown}s`
                    : 'Resend verification code'}
              </button>
            </div>

            {/* SIGN IN */}

            <p
              className="text-sm text-center mt-6"
              style={{ color: 'var(--muted)' }}
            >
              Already verified?{' '}

              <a
                href="/sign-in"
                className="font-semibold"
                style={{ color: 'var(--purple)' }}
              >
                Sign in
              </a>
            </p>

          </div>
        </main>
      </div>
    </div>
  );
}