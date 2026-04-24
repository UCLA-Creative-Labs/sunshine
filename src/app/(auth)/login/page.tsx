'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import AuthShell from '../AuthShell';
import PasswordField from '../PasswordField';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setError(error.message);
            setIsLoading(false);
        } else {
            router.push('/portal');
        }
    };

    return (
        <AuthShell
            heading="Welcome back"
            subheading={
                <>
                    new here?{' '}
                    <Link href="/signup" className="font-bold text-black hover:underline">
                        Create an account
                    </Link>
                </>
            }
        >
            {error && (
                <div
                    role="alert"
                    className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 font-[family-name:var(--font-lato)] text-sm text-red-700"
                >
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label
                        htmlFor="email"
                        className="mb-2 block font-[family-name:var(--font-lato)] text-sm font-medium tracking-wide text-gray-700"
                    >
                        email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        required
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@ucla.edu"
                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-[family-name:var(--font-lato)] text-gray-900 placeholder:text-gray-400 transition-colors focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800"
                    />
                </div>

                <PasswordField
                    value={password}
                    onChange={setPassword}
                    required
                    autoComplete="current-password"
                    placeholder="enter your password"
                    labelAction={
                        <Link
                            href="/forgot-password"
                            className="font-[family-name:var(--font-lato)] text-sm tracking-wide text-gray-600 hover:text-black hover:underline"
                        >
                            forgot?
                        </Link>
                    }
                />

                <button
                    type="submit"
                    disabled={isLoading || !email || !password}
                    className="w-full rounded-full bg-black px-4 py-3 font-[family-name:var(--font-lato)] text-sm font-semibold tracking-wide text-white transition-colors hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {isLoading ? 'logging in…' : 'Log in'}
                </button>
            </form>
        </AuthShell>
    );
}
