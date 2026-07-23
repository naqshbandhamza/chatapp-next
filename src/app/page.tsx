import type { ReactNode } from "react";
import { Poppins, Inter } from "next/font/google";
import Image from "next/image";

const display = Poppins({
    weight: ["500", "600", "700", "800"],
    subsets: ["latin"],
    variable: "--font-display",
});

const body = Inter({
    weight: ["400", "500", "600"],
    subsets: ["latin"],
    variable: "--font-body",
});

/* ---------- Icons (feather-style line icons) ---------- */
type IconProps = {
    path: ReactNode;
    className?: string;
};

const Icon = ({ path, className = "w-6 h-6" }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {path}
    </svg>
);

const icons: Record<string, ReactNode> = {
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
    zap: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    message: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,
    image: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
    arrow: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
    send: <><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>,
};

type StarProps = { className?: string };

const Star = ({ className = "w-4 h-4" }: StarProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

type AvatarProps = { initials: string; tone: string };

const Avatar = ({ initials, tone }: AvatarProps) => (
    <div
        className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
        style={{ background: tone }}
    >
        {initials}
    </div>
);

/* ---------- Data ---------- */
type HeroFeature = { icon: string; title: string; copy: string };

const heroFeatures: HeroFeature[] = [
    { icon: "lock", title: "Private & Secure", copy: "End-to-end encryption keeps you safe" },
    { icon: "zap", title: "Real-time Chat", copy: "Instant messaging that feels natural" },
    { icon: "users", title: "Made for Real Ones", copy: "Connect with friends who get you" },
];

type FeatureRowItem = { icon: string; title: string; copy: string; tone: string; iconTone: string };

const featureRow: FeatureRowItem[] = [
    { icon: "message", title: "Real-time Messaging", copy: "Lightning fast messaging that keeps up with you.", tone: "#EDEBFE", iconTone: "#6C5CE7" },
    { icon: "users", title: "Group Chats", copy: "Create groups, share laughs, and stay connected.", tone: "#E6F0FF", iconTone: "#3B82F6" },
    { icon: "image", title: "Share Moments", copy: "Share photos, videos, and memories instantly.", tone: "#E6F0FF", iconTone: "#3B82F6" },
    { icon: "shield", title: "Privacy First", copy: "We protect your data so you can chat with peace of mind.", tone: "#E6FBF3", iconTone: "#10B981" },
];

type Testimonial = { name: string; handle: string; quote: string; tone: string };

const testimonials: Testimonial[] = [
    { name: "Ayesha Khan", handle: "@ayeshak", quote: "Chime changed the way I connect with my friends. It's fast, simple and feels so real.", tone: "#F472B6" },
    { name: "Daniyal Ahmed", handle: "@daniyal.a", quote: "Finally an app that gets Gen Z. No filters, just real conversations. Love it!", tone: "#6C5CE7" },
    { name: "Sana Malik", handle: "@sanamalik", quote: "Our group chats have never been this alive. Memes, vibes and deep talks — all in one place.", tone: "#F59E0B" },
];

export default function Home() {
    return (
        <div className={`${display.variable} ${body.variable}`} style={{ fontFamily: "var(--font-body)" }}>
            <style>{`
        :root {
          --pink: #F38DAF;
          --purple: #6C5CE7;
          --purple-dark: #5647C7;
          --ink: #1E1B4B;
          --muted: #6B7280;
        }
        .grad-btn { background: linear-gradient(135deg, #7B6EF6, #6C5CE7); }
        .grad-logo { background: linear-gradient(135deg, #4F9BFF, #8B5CF6); }
        .grad-hero-bg {  background: linear-gradient(180deg, #EEF1FD 0%, #F2F4FC 5%, #FFFFFF 65%, #FFFFFF 100%);} 
        .grad-cta { background: linear-gradient(120deg, #6C5CE7 0%, #7C6FF0 55%, #8E7CFF 100%); }
        .dot-grid {
          background-image: radial-gradient(rgba(108,92,231,0.18) 1.5px, transparent 1.5px);
          background-size: 16px 16px;
        }
      `}</style>

            <div className="min-h-screen w-full bg-white grad-hero-bg" style={{ color: "var(--ink)" }}>
                {/* NAV */}
                <nav className="top-0 z-50 absolute bg-transparent w-[100vw]">
                    <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                        <a href="/" className="flex items-center gap-2 text-xl" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                            <span className="w-8 h-8 rounded-full grad-logo flex items-center justify-center text-white">
                                <Icon path={icons.message} className="w-4 h-4" />
                            </span>
                            chime
                        </a>
                        <div className="hidden lg:flex items-center gap-8 text-sm font-medium" style={{ color: "var(--muted)" }}>
                            <a href="#" className="hover:text-[var(--ink)] transition-colors">Home</a>
                            <a href="#features" className="hover:text-[var(--ink)] transition-colors">Features</a>
                            <a href="#" className="hover:text-[var(--ink)] transition-colors">How it Works</a>
                            <a href="#testimonials" className="hover:text-[var(--ink)] transition-colors">Testimonials</a>
                            <a href="#" className="hover:text-[var(--ink)] transition-colors">FAQ</a>
                            <a href="#" className="hover:text-[var(--ink)] transition-colors">Contact</a>
                        </div>
                        <a
                            href="#your-link"
                            className="grad-btn text-white text-sm font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            Download App <Icon path={icons.download} className="w-4 h-4" />
                        </a>
                    </div>
                </nav>

                {/* HERO */}
                <header className="relative overflow-hidden"
                >
                    <div className="max-w-7xl min-h-[600px] mx-auto px-6 pt-16 pb-24 md:pt-20 md:pb-28 grid md:grid-cols-2 gap-12 items-center relative">
                        <div style={{ marginTop: "120px" }}>
                            <span
                                className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 bg-white shadow-sm"
                                style={{ color: "var(--purple-dark)" }}
                            >
                                A New Way to Connect
                                <Icon path={icons.arrow} className="w-3.5 h-3.5" />
                            </span>
                            <h1 className="text-4xl sm:text-5xl xl:text-6xl leading-[1.1] mb-6" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                                <span style={{ color: "var(--purple)" }}>Chime</span> – Chat
                                <br />
                                Application
                            </h1>
                            <p className="text-lg mb-8 max-w-md" style={{ color: "var(--muted)" }}>
                                Where the real ones chat. No filters, no fake vibes, just real conversations with the people who matter.
                            </p>
                            <div className="flex flex-wrap items-center gap-4 mb-12">
                                <a
                                    href="/sign-up"
                                    className="grad-btn text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity"
                                >
                                    Sign Up <Icon path={icons.arrow} className="w-4 h-4" />
                                </a>
                                <a
                                    href="/sign-in"
                                    className="bg-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
                                    style={{ color: "var(--ink)" }}
                                >
                                    Sign In <Icon path={icons.arrow} className="w-4 h-4" />
                                </a>
                            </div>
                            <div className="grid grid-cols-3 gap-6 max-w-lg">
                                {heroFeatures.map((f, i) => (
                                    <div key={i}>
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "#EDEBFE", color: "var(--purple)" }}>
                                            <Icon path={icons[f.icon]} className="w-5 h-5" />
                                        </div>
                                        <h6 className="text-sm font-bold mb-1" style={{ color: "black)" }}>{f.title}</h6>
                                        <p className="text-xs leading-snug" style={{ color: "var(--muted)" }}>{f.copy}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Phone mockup 1: calendar / schedule */}
                        <div className="relative h-[440px] hidden md:flex items-center justify-center">
                            {/* <div className="absolute w-56 h-72 rounded-[2.5rem] -rotate-3" style={{ background: "#C9D9F6", left: "6%", top: "8%" }} />
                            <div className="absolute w-52 h-64 rounded-[2.5rem] rotate-6" style={{ background: "#F7CFE0", right: "2%", bottom: "6%" }} />
                            <div className="absolute inset-0 dot-grid opacity-60" style={{ maskImage: "radial-gradient(circle, black 40%, transparent 70%)" }} /> */}

                            {/* <div className="relative w-64 rounded-[2.4rem] p-2.5 bg-white shadow-2xl border border-gray-100 z-10">
                <div className="rounded-[2rem] overflow-hidden" style={{ background: "#211E3D" }}>
                  <div className="px-4 pt-5 pb-3 flex items-center justify-between text-white text-xs">
                    <span>12:00</span>
                    <span>100%</span>
                  </div>
                  <div className="px-4 pb-2 text-white font-semibold text-sm" style={{ fontFamily: "var(--font-display)" }}>December</div>
                  <div className="grid grid-cols-7 gap-y-1 px-3 pb-3 text-[9px] text-center" style={{ color: "#9C98C4" }}>
                    {["MO","TU","WE","TH","FR","SA","SU"].map((d) => <span key={d}>{d}</span>)}
                    {Array.from({ length: 14 }).map((_, i) => {
                      const n = i + 24;
                      const active = n === 25;
                      return (
                        <span
                          key={i}
                          className="py-1 rounded-full"
                          style={active ? { background: "#F472B6", color: "white" } : {}}
                        >
                          {n > 31 ? n - 31 : n}
                        </span>
                      );
                    })}
                  </div>
                  <div className="bg-white rounded-t-[1.6rem] px-4 py-3 space-y-2.5">
                    {[
                      { c: "#F472B6", t: "Design Review", s: "10:15 - 10:45" },
                      { c: "#6C5CE7", t: "Lunch", s: "12:30 - 13:30" },
                      { c: "#3B82F6", t: "Design Meeting", s: "16:15 - 17:10" },
                      { c: "#10B981", t: "Design Review", s: "10:15 - 11:45" },
                    ].map((e, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: e.c }} />
                        <div>
                          <p className="font-semibold" style={{ color: "var(--ink)" }}>{e.t} · {e.s}</p>
                          <p style={{ color: "var(--muted)" }}>Design Team</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                            </div> */}
                            <div className="relative z-10">
                                <Image
                                    src="/images/header-smartphone.png"
                                    alt="Chime app preview"
                                    width={420}
                                    height={820}
                                    priority
                                    className="w-[320px] lg:w-[380px] xl:w-[420px] h-auto drop-shadow-2xl"
                                />
                            </div>

                            <div className="absolute z-20" style={{ top: "6%", left: "0%" }}>
                                <Avatar initials="AK" tone="#F472B6" />
                            </div>
                            <div className="absolute z-20" style={{ top: "24%", right: "0%" }}>
                                <Avatar initials="DM" tone="#3B82F6" />
                            </div>
                            <div className="absolute z-20" style={{ bottom: "26%", left: "2%" }}>
                                <Avatar initials="SM" tone="#F59E0B" />
                            </div>

                            <div className="absolute top-2 right-6 hidden lg:block">

                                <svg
                                    className="absolute -left-14 -top-4 w-16 h-16 text-pink-300"
                                    viewBox="0 0 64 64"
                                    fill="none"
                                >
                                    <path
                                        d="M8 56 C8 30, 28 18, 52 20"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeDasharray="4 6"
                                        strokeLinecap="round"
                                    />
                                </svg>


                                <div style={{ color: "var(--pink)" }}>
                                    <Icon path={icons.send} className="w-6 h-6 -rotate-12 relative z-10" />
                                </div>
                            </div>

                        </div>
                    </div>
                </header>

                {/* BUILT FOR REAL CONVERSATIONS */}
                <section className="mx-6 lg:mx-8 xl:mx-12 bg-[#F3F7FD] py-24 rounded-3xl relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center relative">
                        <div className="relative h-[420px] flex items-center justify-center order-2 md:order-1">
                            <div className="absolute w-52 h-64 rounded-[2.5rem] -rotate-6" style={{ background: "#C9D9F6", left: "2%", top: "10%" }} />
                            <div className="absolute w-48 h-56 rounded-[2.5rem] rotate-6" style={{ background: "#F7CFE0", right: "4%", bottom: "8%" }} />

                            <div className="relative w-60 rounded-[2.2rem] p-2.5 bg-white shadow-2xl border border-gray-100 z-10">
                                <div className="rounded-[1.8rem] overflow-hidden" style={{ background: "linear-gradient(135deg, #6C5CE7, #4F9BFF)" }}>
                                    <div className="flex items-center justify-between px-4 pt-4 pb-3 text-white text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                                        <span>My Picks</span>
                                        <Icon path={icons.bell} className="w-4 h-4" />
                                    </div>
                                    <div className="flex gap-4 px-4 pb-3 text-xs text-white/80">
                                        <span className="text-white font-semibold border-b-2 border-white pb-1">Latest</span>
                                        <span className="pb-1">Favorites</span>
                                    </div>
                                    <div className="bg-white rounded-t-[1.4rem] p-2 grid grid-cols-2 gap-1.5">
                                        {["#FDE68A", "#FCA5A5", "#A7C7F7", "#C4B5FD", "#6EE7B7", "#F9A8D4"].map((c, i) => (
                                            <div key={i} className="aspect-square rounded-lg" style={{ background: c }} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="absolute z-20 bg-[#211E3D] text-white rounded-2xl px-4 py-3 shadow-xl" style={{ bottom: "12%", left: "0%" }}>
                                <p className="text-[10px]" style={{ color: "#9C98C4" }}>Today</p>
                                <p className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>2:56:01</p>
                                <p className="text-[10px]" style={{ color: "#F472B6" }}>● Active</p>
                            </div>
                        </div>

                        <div className="order-1 md:order-2">
                            <p className="text-sm font-semibold mb-3" style={{ color: "var(--purple)" }}>More Than Just Messaging</p>
                            <h2 className="text-3xl sm:text-4xl mb-5" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                                Built for Real Conversations
                            </h2>
                            <p className="text-base leading-relaxed mb-8 max-w-md" style={{ color: "var(--muted)" }}>
                                This isn't just another messaging app — it's where your people actually are. No filters, no fake
                                vibes, just unfiltered, real-time conversations with the ones who matter. Whether it's deep talks at
                                2AM, chaotic group chats, or random memes that make your day, this is the space where authenticity
                                wins. Built for Gen Z energy — raw, relatable, and real.
                            </p>
                            <a
                                href="#your-link"
                                className="grad-btn text-white font-semibold px-6 py-3 rounded-full inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
                            >
                                Download App <Icon path={icons.download} className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </section>

                {/* FEATURE ROW */}
                <section id="features" className="max-w-7xl mx-auto px-6 py-20">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featureRow.map((f, i) => (
                            <div key={i}>
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: f.tone, color: f.iconTone }}>
                                    <Icon path={icons[f.icon]} className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold mb-1.5">{f.title}</h3>
                                <p className="text-sm leading-snug" style={{ color: "var(--muted)" }}>{f.copy}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* TESTIMONIALS */}
                <section id="testimonials" className="max-w-7xl mx-auto px-6 py-20 text-center">
                    <p className="text-sm font-semibold mb-3" style={{ color: "var(--purple)" }}>Loved by Real People</p>
                    <h2 className="text-3xl sm:text-4xl mb-14" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                        What People Are Saying
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6 text-left">
                        {testimonials.map((t, i) => (
                            <div key={i} className="rounded-2xl p-7 bg-white border border-gray-100 shadow-sm">
                                <div className="flex gap-1 mb-4" style={{ color: "#F59E0B" }}>
                                    {Array.from({ length: 5 }).map((_, s) => <Star key={s} />)}
                                </div>
                                <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--ink)" }}>"{t.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <Avatar initials={t.name.split(" ").map((n) => n[0]).join("")} tone={t.tone} />
                                    <div>
                                        <p className="text-sm font-semibold">{t.name}</p>
                                        <p className="text-xs" style={{ color: "var(--muted)" }}>{t.handle}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center gap-2 mt-10">
                        {[0, 1, 2, 3].map((i) => (
                            <span key={i} className="w-2 h-2 rounded-full" style={{ background: i === 0 ? "var(--purple)" : "#D8D4F5" }} />
                        ))}
                    </div>
                </section>

                {/* CTA BANNER */}
                <section className="max-w-7xl mx-auto px-6 pb-20">
                    <div className="grad-cta rounded-3xl px-8 py-10 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-4 text-white">
                            <span className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                                <Icon path={icons.send} className="w-5 h-5" />
                            </span>
                            <div>
                                <h3 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "#FFFFFF" }}>
                                    Ready to connect with your people?
                                </h3>
                                <p className="text-sm" style={{ color: "#FFFFFF" }}>Download Chime now and start real conversations.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <a href="#your-link" className="bg-black text-white rounded-xl px-4 py-2.5 flex items-center gap-2">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M17.05 12.04c-.03-2.7 2.2-4 2.3-4.06-1.25-1.83-3.2-2.08-3.9-2.1-1.66-.17-3.24 1-4.08 1-.84 0-2.14-.98-3.52-.95-1.8.03-3.47 1.05-4.4 2.66-1.87 3.24-.48 8.04 1.35 10.67.9 1.28 1.96 2.72 3.36 2.67 1.35-.05 1.86-.87 3.5-.87 1.63 0 2.1.87 3.53.85 1.46-.03 2.38-1.32 3.27-2.6.65-.95.92-1.4 1.43-2.46-3.77-1.44-4.3-3.5-4.34-3.81zM14.7 3.5c.75-.9 1.25-2.16 1.1-3.5-1.08.04-2.4.72-3.18 1.62-.7.8-1.3 2.08-1.14 3.3 1.2.1 2.44-.6 3.22-1.42z" />
                                </svg>
                                <span className="text-left leading-tight">
                                    <span className="block text-[9px] text-white/70">Download on the</span>
                                    <span className="block text-sm font-semibold">App Store</span>
                                </span>
                            </a>
                            <a href="#your-link" className="bg-black text-white rounded-xl px-4 py-2.5 flex items-center gap-2">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M3.6 2.3c-.35.2-.6.6-.6 1.1v17.2c0 .5.25.9.6 1.1l10-9.7-10-9.7zM15.3 12l2.5-2.4-9.9-5.7 7.4 8.1zM4.9 21.6l9.9-5.7-2.5-2.4-7.4 8.1zM18.8 9.1l-2.2 1.3 2.5 2.4 2.9-1.7c.6-.35.6-1.2 0-1.6l-3.2-1.9z" />
                                </svg>
                                <span className="text-left leading-tight">
                                    <span className="block text-[9px] text-white/70">GET IT ON</span>
                                    <span className="block text-sm font-semibold">Google Play</span>
                                </span>
                            </a>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                {/* <footer className="border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <a href="/" className="flex items-center gap-2 text-lg" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                            <span className="w-7 h-7 rounded-full grad-logo flex items-center justify-center text-white">
                                <Icon path={icons.message} className="w-3.5 h-3.5" />
                            </span>
                            chime
                        </a>
                        <div className="flex gap-8 text-sm" style={{ color: "var(--muted)" }}>
                            <a href="/terms" className="hover:text-[var(--ink)] transition-colors">Terms &amp; Conditions</a>
                            <a href="/privacy" className="hover:text-[var(--ink)] transition-colors">Privacy Policy</a>
                        </div>
                        <div className="flex items-center gap-4">
                            {([
                                { label: "Instagram", d: "M12 7a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zM17.5 6.7a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4zM21.9 7.4c-.1-1.3-.4-2.4-1.3-3.3-.9-.9-2-1.2-3.3-1.3C16.1 2.7 15.7 2.7 12 2.7s-4.1 0-5.3.1c-1.3.1-2.4.4-3.3 1.3-.9.9-1.2 2-1.3 3.3C2 8.6 2 9 2 12s0 3.4.1 4.6c.1 1.3.4 2.4 1.3 3.3.9.9 2 1.2 3.3 1.3 1.2.1 1.6.1 5.3.1s4.1 0 5.3-.1c1.3-.1 2.4-.4 3.3-1.3.9-.9 1.2-2 1.3-3.3.1-1.2.1-1.6.1-4.6s0-3.4-.1-4.6z" },
                                { label: "X", d: "M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.4 22H1.3l8.1-9.3L1 2h7l4.9 6zM17 20h1.9L7.1 4H5.1z" },
                                { label: "TikTok", d: "M16.6 2h-3.2v13.8a2.7 2.7 0 11-2.2-2.66V9.9a5.9 5.9 0 105.4 5.88V8.3a7.5 7.5 0 004.6 1.6V6.7a4.3 4.3 0 01-4.6-4.7z" },
                                { label: "Discord", d: "M20 6.5a17 17 0 00-4.3-1.3l-.2.4a12.9 12.9 0 016.9 12.5s-1.7 1-4.2 1l-.9-1.5a8.5 8.5 0 003.5-1.6 9.2 9.2 0 01-2.2 1.1c-2.9 1.3-6.7 1.3-9.6 0a9.4 9.4 0 01-2.2-1.1 8.5 8.5 0 003.5 1.6L9.4 19s-2.5 0-4.2-1a12.9 12.9 0 016.9-12.5l-.2-.4A17 17 0 007.6 6.5C5.6 9.6 4.9 12.6 5.2 15.6a13 13 0 004 2 10.4 10.4 0 00.9-1.4 8.4 8.4 0 01-1.4-.7c.1-.1.3-.2.4-.3a9.3 9.3 0 007.8 0l.4.3a8.4 8.4 0 01-1.4.7 10.4 10.4 0 00.9 1.4 13 13 0 004-2c.4-3.5-.5-6.5-2.4-9.1zM9.7 13.9c-.8 0-1.5-.8-1.5-1.7s.6-1.7 1.5-1.7 1.5.8 1.5 1.7-.7 1.7-1.5 1.7zm4.6 0c-.8 0-1.5-.8-1.5-1.7s.6-1.7 1.5-1.7 1.5.8 1.5 1.7-.7 1.7-1.5 1.7z" },
                            ] as { label: string; d: string }[]).map((s) => (
                                <a
                                    key={s.label}
                                    href="#your-link"
                                    aria-label={s.label}
                                    className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
                                    style={{ color: "var(--muted)" }}
                                >
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d={s.d} /></svg>
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="max-w-7xl mx-auto px-6 pb-8 text-center text-sm" style={{ color: "var(--muted)" }}>
                        © {new Date().getFullYear()} Chime. All rights reserved.
                    </div>
                </footer> */}
                <footer className="relative overflow-hidden border-t border-gray-100 bg-gradient-to-b from-white to-gray-50">
                    <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">

                        {/* Top section */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

                            {/* Brand */}
                            <div className="md:col-span-2">
                                <a
                                    href="/"
                                    className="flex items-center gap-3 text-xl w-fit"
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        fontWeight: 700,
                                    }}
                                >
                                    <span className="w-10 h-10 rounded-2xl grad-logo flex items-center justify-center text-white shadow-lg">
                                        <Icon path={icons.message} className="w-5 h-5" />
                                    </span>

                                    <span>chime</span>
                                </a>

                                <p
                                    className="mt-5 max-w-sm text-sm leading-6"
                                    style={{ color: "var(--muted)" }}
                                >
                                    Simple, beautiful conversations that help people stay
                                    connected wherever they are.
                                </p>


                                {/* Social */}
                                <div className="flex items-center gap-3 mt-6">
                                    {([
                                        { label: "Instagram", d: "M12 7a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zM17.5 6.7a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4zM21.9 7.4c-.1-1.3-.4-2.4-1.3-3.3-.9-.9-2-1.2-3.3-1.3C16.1 2.7 15.7 2.7 12 2.7s-4.1 0-5.3.1c-1.3.1-2.4.4-3.3 1.3-.9.9-1.2 2-1.3 3.3C2 8.6 2 9 2 12s0 3.4.1 4.6c.1 1.3.4 2.4 1.3 3.3.9.9 2 1.2 3.3 1.3 1.2.1 1.6.1 5.3.1s4.1 0 5.3-.1c1.3-.1 2.4-.4 3.3-1.3.9-.9 1.2-2 1.3-3.3.1-1.2.1-1.6.1-4.6s0-3.4-.1-4.6z" },
                                        { label: "X", d: "M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.4 22H1.3l8.1-9.3L1 2h7l4.9 6zM17 20h1.9L7.1 4H5.1z" },
                                        { label: "TikTok", d: "M16.6 2h-3.2v13.8a2.7 2.7 0 11-2.2-2.66V9.9a5.9 5.9 0 105.4 5.88V8.3a7.5 7.5 0 004.6 1.6V6.7a4.3 4.3 0 01-4.6-4.7z" },
                                        { label: "Discord", d: "M20 6.5a17 17 0 00-4.3-1.3l-.2.4a12.9 12.9 0 016.9 12.5s-1.7 1-4.2 1l-.9-1.5a8.5 8.5 0 003.5-1.6 9.2 9.2 0 01-2.2 1.1c-2.9 1.3-6.7 1.3-9.6 0a9.4 9.4 0 01-2.2-1.1 8.5 8.5 0 003.5 1.6L9.4 19s-2.5 0-4.2-1a12.9 12.9 0 016.9-12.5l-.2-.4A17 17 0 007.6 6.5C5.6 9.6 4.9 12.6 5.2 15.6a13 13 0 004 2 10.4 10.4 0 00.9-1.4 8.4 8.4 0 01-1.4-.7c.1-.1.3-.2.4-.3a9.3 9.3 0 007.8 0l.4.3a8.4 8.4 0 01-1.4.7 10.4 10.4 0 00.9 1.4 13 13 0 004-2c.4-3.5-.5-6.5-2.4-9.1z" },
                                    ]).map((s) => (
                                        <a
                                            key={s.label}
                                            href="#"
                                            aria-label={s.label}
                                            className="
                                w-10 h-10 rounded-xl 
                                flex items-center justify-center
                                bg-white border border-gray-100
                                hover:-translate-y-1
                                hover:shadow-md
                                transition-all duration-300
                            "
                                            style={{ color: "var(--muted)" }}
                                        >
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                            >
                                                <path d={s.d} />
                                            </svg>
                                        </a>
                                    ))}
                                </div>
                            </div>


                            {/* Product links */}
                            <div>
                                <h3 className="text-sm font-semibold mb-4">
                                    Product
                                </h3>

                                <div className="space-y-3 text-sm" style={{ color: "var(--muted)" }}>
                                    <a className="block hover:text-black transition">
                                        Features
                                    </a>
                                    <a className="block hover:text-black transition">
                                        Pricing
                                    </a>
                                    <a className="block hover:text-black transition">
                                        Download
                                    </a>
                                </div>
                            </div>


                            {/* Company */}
                            <div>
                                <h3 className="text-sm font-semibold mb-4">
                                    Company
                                </h3>

                                <div className="space-y-3 text-sm" style={{ color: "var(--muted)" }}>
                                    <a className="block hover:text-black transition">
                                        About
                                    </a>
                                    <a className="block hover:text-black transition">
                                        Contact
                                    </a>
                                    <a href="/privacy" className="block hover:text-black transition">
                                        Privacy Policy
                                    </a>
                                    <a href="/terms" className="block hover:text-black transition">
                                        Terms & Conditions
                                    </a>
                                </div>
                            </div>

                        </div>


                        {/* Bottom */}
                        <div
                            className="
                mt-12 pt-6 
                border-t border-gray-100
                flex flex-col md:flex-row
                justify-between items-center
                gap-4
                text-sm
            "
                            style={{ color: "var(--muted)" }}
                        >
                            <p>
                                © {new Date().getFullYear()} Chime. All rights reserved.
                            </p>

                        </div>

                    </div>
                </footer>
            </div>
        </div>
    );
}
