'use client';

import { useId, useState } from 'react';

type Strength = 0 | 1 | 2 | 3;

function scoreStrength(pw: string): Strength {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s += 1;
    if (pw.length >= 12) s += 1;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw) && /\d/.test(pw)) s += 1;
    return Math.min(s, 3) as Strength;
}

const STRENGTH_META: Record<Strength, { label: string; bar: string; text: string }> = {
    0: { label: '', bar: 'bg-gray-200', text: 'text-gray-400' },
    1: { label: 'weak', bar: 'bg-red-400', text: 'text-red-500' },
    2: { label: 'okay', bar: 'bg-yellow-400', text: 'text-yellow-700' },
    3: { label: 'strong', bar: 'bg-green-500', text: 'text-green-700' },
};

interface PasswordFieldProps {
    value: string;
    onChange: (v: string) => void;
    label?: string;
    placeholder?: string;
    autoComplete?: 'new-password' | 'current-password';
    required?: boolean;
    /** When true, show strength meter + helper copy */
    showStrength?: boolean;
    /** Optional hint text shown under the field when not showing strength */
    hint?: string;
    /** Pill-style (rounded-full) if true — matches signup aesthetic */
    rounded?: 'md' | 'full';
    /** Right-side adornment (e.g., "forgot password?" link) next to label */
    labelAction?: React.ReactNode;
    autoFocus?: boolean;
}

export default function PasswordField({
    value,
    onChange,
    label = 'password',
    placeholder = 'your password',
    autoComplete = 'current-password',
    required,
    showStrength = false,
    hint,
    rounded = 'md',
    labelAction,
    autoFocus,
}: PasswordFieldProps) {
    const id = useId();
    const [shown, setShown] = useState(false);
    const strength = showStrength ? scoreStrength(value) : 0;
    const meta = STRENGTH_META[strength];
    const shape = rounded === 'full' ? 'rounded-full' : 'rounded-lg';

    return (
        <div>
            <div className="mb-2 flex items-center justify-between">
                <label
                    htmlFor={id}
                    className="block font-[family-name:var(--font-lato)] text-sm font-medium tracking-wide text-gray-700"
                >
                    {label}
                </label>
                {labelAction}
            </div>
            <div className="relative">
                <input
                    id={id}
                    name={id}
                    type={shown ? 'text' : 'password'}
                    autoComplete={autoComplete}
                    required={required}
                    autoFocus={autoFocus}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`block w-full border border-gray-300 bg-white py-3 pl-4 pr-12 font-[family-name:var(--font-lato)] text-gray-900 placeholder:text-gray-400 transition-colors focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800 ${shape}`}
                />
                <button
                    type="button"
                    onClick={() => setShown((s) => !s)}
                    aria-label={shown ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-gray-500 transition-colors hover:text-black"
                >
                    {shown ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.64 20.64 0 0 1 5.06-6.06" />
                            <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a20.93 20.93 0 0 1-3.17 4.19" />
                            <path d="m1 1 22 22" />
                            <path d="M14.12 14.12a3 3 0 0 1-4.24-4.24" />
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    )}
                </button>
            </div>

            {showStrength ? (
                <div className="mt-2 flex items-center gap-3">
                    <div className="flex flex-1 gap-1" aria-hidden>
                        {[1, 2, 3].map((tier) => (
                            <span
                                key={tier}
                                className={`h-1.5 flex-1 rounded-full transition-colors ${
                                    strength >= tier ? meta.bar : 'bg-gray-200'
                                }`}
                            />
                        ))}
                    </div>
                    <span className={`font-[family-name:var(--font-lato)] text-xs font-medium ${meta.text}`}>
                        {meta.label || (value ? '' : '8+ chars recommended')}
                    </span>
                </div>
            ) : hint ? (
                <p className="mt-2 font-[family-name:var(--font-lato)] text-sm tracking-wide text-gray-500">
                    {hint}
                </p>
            ) : null}
        </div>
    );
}
