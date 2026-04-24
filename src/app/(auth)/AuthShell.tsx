'use client';

import Link from 'next/link';
import Image from 'next/image';

interface AuthShellProps {
    heading: string;
    subheading: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

/**
 * Public-site auth shell.
 * Desktop: brand/decor on the LEFT (~45%), form on the RIGHT (~55%).
 * Mobile: brand strip stacks above form.
 * Uses public-site fonts (Mulish headings, Lato body).
 */
export default function AuthShell({
    heading,
    subheading,
    children,
    footer,
}: AuthShellProps) {
    return (
        <div className="min-h-screen bg-white">
            <div className="flex min-h-screen flex-col md:flex-row">
                {/* Left — brand & decor */}
                <aside className="relative flex flex-col justify-between overflow-hidden bg-[#FFF8E1] px-8 py-10 md:w-[45%] md:px-14 md:py-14">
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-40"
                        style={{ backgroundImage: 'url(/textures/grid.png)' }}
                    />

                    {/* Sun with face — yellow disk + eyes/smile layered */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute -right-20 -top-16 h-56 w-56 md:-right-10 md:-top-8 md:h-72 md:w-72 lg:h-80 lg:w-80"
                    >
                        <div
                            className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                            style={{ backgroundImage: "url('/sun.svg')" }}
                        />
                        <div
                            className="absolute left-1/2 top-[42%] -translate-x-1/2 bg-contain bg-center bg-no-repeat"
                            style={{
                                backgroundImage: "url('/sunmoon-face.svg')",
                                width: '39%',
                                aspectRatio: '88 / 30',
                            }}
                        />
                    </div>

                    <Link
                        href="/"
                        className="relative z-10 inline-flex items-center gap-3"
                    >
                        <Image src="/cl-logo.svg" alt="Creative Labs" width={44} height={44} />
                        <span className="font-[family-name:var(--font-mulish)] text-xl font-extrabold tracking-tight text-black">
                            Creative Labs
                        </span>
                    </Link>

                    <div className="relative z-10 mt-10 md:mt-0">
                        <p className="font-[family-name:var(--font-lato)] text-sm font-semibold uppercase tracking-[0.15em] text-black/60">
                            UCLA · student community
                        </p>
                        <h2 className="mt-3 font-[family-name:var(--font-mulish)] text-4xl font-extrabold leading-[1.05] text-black md:text-5xl lg:text-6xl">
                            Creativity for All!
                        </h2>
                        <p className="mt-5 max-w-sm font-[family-name:var(--font-lato)] text-[15px] leading-relaxed text-black/70">
                            A community of UCLA creatives working on cool projects to discover even cooler passions.
                        </p>
                        <p className="mt-4 max-w-sm font-[family-name:var(--font-lato)] text-[14px] italic leading-relaxed text-black/55">
                            Let&rsquo;s make something cool.
                        </p>
                    </div>

                    <div className="relative z-10 hidden font-[family-name:var(--font-lato)] text-xs tracking-wide text-black/50 md:block">
                        © {new Date().getFullYear()} Creative Labs at UCLA
                    </div>
                </aside>

                {/* Right — form */}
                <main className="flex flex-1 items-center justify-center px-6 py-12 md:px-12 md:py-16">
                    <div className="w-full max-w-md">
                        <div className="mb-8">
                            <h1 className="font-[family-name:var(--font-mulish)] text-3xl font-bold text-black md:text-4xl">
                                {heading}
                            </h1>
                            <p className="mt-2 font-[family-name:var(--font-lato)] text-[15px] text-gray-600">
                                {subheading}
                            </p>
                        </div>

                        {children}

                        {footer ? (
                            <div className="mt-8 font-[family-name:var(--font-lato)] text-xs text-gray-500">
                                {footer}
                            </div>
                        ) : null}
                    </div>
                </main>
            </div>
        </div>
    );
}
