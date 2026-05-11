import React from 'react';

interface GitHubBadgeProps {
    githubUrl?: string | null;
    githubIssueNumber?: number | null;
    githubPrUrl?: string | null;
    githubPrNumber?: number | null;
}

export function GitHubBadge({ githubUrl, githubIssueNumber, githubPrUrl, githubPrNumber }: GitHubBadgeProps) {
    if (!githubUrl && !githubPrUrl) return null;

    return (
        <div className="flex gap-2">
            {githubUrl && githubIssueNumber && (
                <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded bg-[#F3F4F6] px-1.5 py-0.5 text-[10px] font-medium text-black/70 hover:bg-[#E5E7EB] hover:text-black transition-colors"
                    title="View Issue on GitHub"
                    onClick={(e) => e.stopPropagation()}
                >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    #{githubIssueNumber}
                </a>
            )}

            {githubPrUrl && githubPrNumber && (
                <a
                    href={githubPrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded bg-[#F3F4F6] px-1.5 py-0.5 text-[10px] font-medium text-black/70 hover:bg-[#E5E7EB] hover:text-black transition-colors"
                    title="View PR on GitHub"
                    onClick={(e) => e.stopPropagation()}
                >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1.5 1.5 0 011.5 1.5v5.628a2.251 2.251 0 101.5 0V5.5A3 3 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"></path>
                    </svg>
                    #{githubPrNumber}
                </a>
            )}
        </div>
    );
}
