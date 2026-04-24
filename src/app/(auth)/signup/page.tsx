'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { UCLA_MAJORS, getGradYearOptions } from '@/lib/constants/ucla';
import AuthShell from '../AuthShell';
import PasswordField from '../PasswordField';

export default function SignupPage() {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [major, setMajor] = useState('');
    const [gradYear, setGradYear] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const gradYearOptions = getGradYearOptions();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!email.endsWith('@ucla.edu') && !email.endsWith('@g.ucla.edu')) {
            setError('Please use a valid UCLA email address (@ucla.edu or @g.ucla.edu)');
            setIsLoading(false);
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            setIsLoading(false);
            return;
        }

        const supabase = createClient();

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                },
            },
        });

        if (error) {
            setError(error.message);
            setIsLoading(false);
            return;
        }

        const user = data.user;
        if (user) {
            const profileUpdate: {
                id: string;
                email: string | undefined;
                first_name: string;
                last_name: string;
                major?: string | null;
                grad_year?: number | null;
            } = {
                id: user.id,
                email: user.email,
                first_name: firstName.trim(),
                last_name: lastName.trim(),
            };
            if (major) profileUpdate.major = major;
            if (gradYear) profileUpdate.grad_year = parseInt(gradYear, 10);

            const { error: profileError } = await supabase
                .from('profiles')
                .upsert(profileUpdate, { onConflict: 'id' });

            if (profileError) {
                setError(profileError.message);
                setIsLoading(false);
                return;
            }
        }
        router.push('/portal');
    };

    return (
        <AuthShell
            heading="Create your account"
            subheading={
                <>
                    already have one?{' '}
                    <Link href="/login" className="font-bold text-black hover:underline">
                        Log in
                    </Link>
                </>
            }
            footer={
                <p>
                    Only UCLA emails (@ucla.edu or @g.ucla.edu) can join. You can leave major and
                    graduation year blank and add them later from your profile.
                </p>
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
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label
                            htmlFor="firstName"
                            className="mb-2 block font-[family-name:var(--font-lato)] text-sm font-medium tracking-wide text-gray-700"
                        >
                            first name
                        </label>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            autoComplete="given-name"
                            required
                            autoFocus
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Travis"
                            className="block w-full rounded-full border border-gray-300 bg-white px-4 py-3 font-[family-name:var(--font-lato)] text-gray-900 placeholder:text-gray-400 transition-colors focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="lastName"
                            className="mb-2 block font-[family-name:var(--font-lato)] text-sm font-medium tracking-wide text-gray-700"
                        >
                            last name
                        </label>
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            autoComplete="family-name"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Nguyen"
                            className="block w-full rounded-full border border-gray-300 bg-white px-4 py-3 font-[family-name:var(--font-lato)] text-gray-900 placeholder:text-gray-400 transition-colors focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800"
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="mb-2 block font-[family-name:var(--font-lato)] text-sm font-medium tracking-wide text-gray-700"
                    >
                        ucla email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@ucla.edu"
                        className="block w-full rounded-full border border-gray-300 bg-white px-4 py-3 font-[family-name:var(--font-lato)] text-gray-900 placeholder:text-gray-400 transition-colors focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800"
                    />
                </div>

                <PasswordField
                    value={password}
                    onChange={setPassword}
                    required
                    autoComplete="new-password"
                    placeholder="create a password"
                    rounded="full"
                    showStrength
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
                    <div>
                        <label
                            htmlFor="major"
                            className="mb-2 block font-[family-name:var(--font-lato)] text-sm font-medium tracking-wide text-gray-700"
                        >
                            major <span className="text-gray-400">(optional)</span>
                        </label>
                        <select
                            id="major"
                            name="major"
                            value={major}
                            onChange={(e) => setMajor(e.target.value)}
                            className="block w-full appearance-none rounded-full border border-gray-300 bg-white bg-[linear-gradient(45deg,transparent_50%,#374151_50%),linear-gradient(135deg,#374151_50%,transparent_50%)] bg-[length:5px_5px,5px_5px] bg-[position:calc(100%-22px)_50%,calc(100%-17px)_50%] bg-no-repeat py-3 pl-4 pr-12 font-[family-name:var(--font-lato)] text-gray-900 transition-colors focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800"
                        >
                            <option value="">select your major</option>
                            {UCLA_MAJORS.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label
                            htmlFor="gradYear"
                            className="mb-2 block font-[family-name:var(--font-lato)] text-sm font-medium tracking-wide text-gray-700"
                        >
                            grad year
                        </label>
                        <select
                            id="gradYear"
                            name="gradYear"
                            value={gradYear}
                            onChange={(e) => setGradYear(e.target.value)}
                            className="block w-full appearance-none rounded-full border border-gray-300 bg-white bg-[linear-gradient(45deg,transparent_50%,#374151_50%),linear-gradient(135deg,#374151_50%,transparent_50%)] bg-[length:5px_5px,5px_5px] bg-[position:calc(100%-22px)_50%,calc(100%-17px)_50%] bg-no-repeat py-3 pl-4 pr-12 font-[family-name:var(--font-lato)] text-gray-900 transition-colors focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800"
                        >
                            <option value="">—</option>
                            {gradYearOptions.map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !firstName || !lastName || !email || !password}
                    className="w-full rounded-full bg-black px-4 py-3 font-[family-name:var(--font-lato)] text-sm font-semibold tracking-wide text-white transition-colors hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {isLoading ? 'creating account…' : 'Create account'}
                </button>
            </form>
        </AuthShell>
    );
}
