'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { profileService } from '@/lib/supabase/profileService';

const GITHUB_USERNAME_RE = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

interface GitHubLinkSectionProps {
    userId: string;
    githubUsername: string | null | undefined;
    onUsernameChange: (username: string | null) => void;
}

/**
 * GitHubLinkSection – renders inside the profile page.
 *
 * Connected state   → green badge + disconnect button
 * Disconnected state → "Connect GitHub" OAuth button + manual input fallback
 */
const GitHubLinkSection: React.FC<GitHubLinkSectionProps> = ({
    userId,
    githubUsername,
    onUsernameChange,
}) => {
    const searchParams = useSearchParams();

    const [loading, setLoading] = useState(false);
    const [manualInput, setManualInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Show status messages from the OAuth redirect
    useEffect(() => {
        const ghError = searchParams.get('github_error');
        const ghLinked = searchParams.get('github_linked');

        if (ghError) setError(decodeURIComponent(ghError));
        if (ghLinked === 'true' && !ghError)
            setSuccessMsg('GitHub account linked successfully!');
    }, [searchParams]);

    // Auto-dismiss success message
    useEffect(() => {
        if (!successMsg) return;
        const t = setTimeout(() => setSuccessMsg(null), 5000);
        return () => clearTimeout(t);
    }, [successMsg]);

    // ── OAuth linking ──
    const handleOAuthLink = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/github/link-account', { method: 'POST' });
            const body = await res.json();
            if (!res.ok) throw new Error(body.error ?? 'Failed to start linking.');
            // Redirect to GitHub OAuth consent screen
            window.location.href = body.url;
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    // ── Manual username save ──
    const handleManualSave = async () => {
        const trimmed = manualInput.trim();
        if (!GITHUB_USERNAME_RE.test(trimmed)) {
            setError(
                'Invalid username. Letters, numbers, and hyphens only (1-39 chars, cannot start/end with hyphen).',
            );
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await profileService.updateGithubUsername(userId, trimmed);
            onUsernameChange(trimmed.toLowerCase());
            setManualInput('');
            setSuccessMsg('GitHub username saved!');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ── Disconnect ──
    const handleDisconnect = async () => {
        setLoading(true);
        setError(null);
        try {
            await profileService.clearGithubUsername(userId);
            onUsernameChange(null);
            setSuccessMsg(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: '1.5rem' }}>
            <h3
                style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.75rem',
                }}
            >
                GitHub Account
            </h3>

            {/* Status messages */}
            {error && (
                <div
                    style={{
                        padding: '0.5rem 0.75rem',
                        marginBottom: '0.75rem',
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FECACA',
                        borderRadius: '0.375rem',
                        color: '#DC2626',
                        fontSize: '0.8125rem',
                    }}
                >
                    {error}
                </div>
            )}
            {successMsg && (
                <div
                    style={{
                        padding: '0.5rem 0.75rem',
                        marginBottom: '0.75rem',
                        backgroundColor: '#F0FDF4',
                        border: '1px solid #BBF7D0',
                        borderRadius: '0.375rem',
                        color: '#16A34A',
                        fontSize: '0.8125rem',
                    }}
                >
                    {successMsg}
                </div>
            )}

            {githubUsername ? (
                /* ── Connected state ── */
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        backgroundColor: '#F0FDF4',
                        border: '1px solid #BBF7D0',
                        borderRadius: '0.5rem',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {/* Green dot */}
                        <span
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: '#22C55E',
                                display: 'inline-block',
                            }}
                        />
                        <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                            Connected as{' '}
                            <strong style={{ color: '#111827' }}>@{githubUsername}</strong>
                        </span>
                    </div>
                    <button
                        onClick={handleDisconnect}
                        disabled={loading}
                        style={{
                            fontSize: '0.8125rem',
                            color: '#DC2626',
                            background: 'none',
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            textDecoration: 'underline',
                            opacity: loading ? 0.5 : 1,
                        }}
                    >
                        Disconnect
                    </button>
                </div>
            ) : (
                /* ── Disconnected state ── */
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                    }}
                >
                    {/* OAuth button */}
                    <button
                        onClick={handleOAuthLink}
                        disabled={loading}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: '#24292F',
                            color: '#FFFFFF',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.6 : 1,
                            transition: 'opacity 150ms',
                        }}
                    >
                        {/* GitHub icon (simple SVG) */}
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
                   0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
                   -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
                   .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
                   -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0
                   1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56
                   .82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0
                   1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                            />
                        </svg>
                        {loading ? 'Connecting…' : 'Connect GitHub'}
                    </button>

                    {/* Manual fallback */}
                    <div>
                        <p
                            style={{
                                fontSize: '0.8125rem',
                                color: '#6B7280',
                                marginBottom: '0.375rem',
                            }}
                        >
                            Or enter your GitHub username manually:
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                value={manualInput}
                                onChange={(e) => {
                                    setManualInput(e.target.value);
                                    setError(null);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleManualSave();
                                }}
                                placeholder="e.g. octocat"
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    padding: '0.375rem 0.625rem',
                                    fontSize: '0.875rem',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '0.375rem',
                                    outline: 'none',
                                }}
                            />
                            <button
                                onClick={handleManualSave}
                                disabled={loading || !manualInput.trim()}
                                style={{
                                    padding: '0.375rem 0.75rem',
                                    fontSize: '0.8125rem',
                                    fontWeight: 500,
                                    backgroundColor: '#F3F4F6',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '0.375rem',
                                    cursor:
                                        loading || !manualInput.trim()
                                            ? 'not-allowed'
                                            : 'pointer',
                                    opacity: loading || !manualInput.trim() ? 0.5 : 1,
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GitHubLinkSection;
