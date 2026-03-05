'use client';

import { use } from 'react';
import { FaGithub, FaCodeBranch, FaCircleNotch, FaExclamationCircle, FaExternalLinkAlt, FaSyncAlt } from 'react-icons/fa';
import { useAuth } from '@/lib/hooks/useAuth';
import { useGitHubData } from '@/lib/hooks/useGitHubData';
import { useGitHubIntegration } from '@/lib/hooks/useGitHubIntegration';

export default function GitHubPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const { userId, isLoading: authLoading, error: authError } = useAuth();
  const { patStatus, isLoading: patLoading } = useGitHubIntegration(projectId);
  const { pullRequests, issues, isLoading: dataLoading, error, refetch } = useGitHubData(projectId, { state: 'open' });

  const isLoading = authLoading || patLoading || dataLoading;

  if (authLoading || patLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-black/50">Loading...</p>
      </div>
    );
  }

  if (authError || !userId) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-red-500">Please sign in to view this page</p>
      </div>
    );
  }

  if (!patStatus?.hasPAT) {
    return (
      <>
        <section className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-black">GitHub</h1>
          <p className="text-sm text-black/50">View pull requests and issues from your repository</p>
        </section>

        <div className="mt-8 max-w-2xl">
          <div className="rounded-2xl border border-[#D4D7E5] bg-white p-6 md:p-8 text-center">
            <FaGithub className="h-12 w-12 mx-auto text-black/30 mb-4" />
            <h2 className="text-xl font-semibold text-black mb-2">GitHub not connected</h2>
            <p className="text-sm text-black/70 mb-4">
              Connect your GitHub repository in settings to view pull requests and issues here.
            </p>
            <a
              href={`/portal/projects/${projectId}/settings`}
              className="inline-block px-4 py-2 rounded-lg bg-[#24292e] text-white text-sm font-medium hover:bg-[#1a1e22] transition-colors"
            >
              Go to Settings
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-black">GitHub</h1>
            <p className="text-sm text-black/50">View pull requests and issues from your repository</p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="p-2 rounded-lg border border-[#D4D7E5] text-black hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <FaSyncAlt className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </section>

      {error && (
        <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Pull Requests */}
        <div className="rounded-2xl border border-[#D4D7E5] bg-white">
          <div className="p-4 md:p-6 border-b border-[#D4D7E5]">
            <div className="flex items-center gap-2">
              <FaCodeBranch className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-black">Pull Requests</h2>
              <span className="ml-auto px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                {pullRequests.length} open
              </span>
            </div>
          </div>
          <div className="divide-y divide-[#D4D7E5] max-h-[500px] overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center">
                <FaCircleNotch className="h-6 w-6 mx-auto animate-spin text-black/30" />
                <p className="mt-2 text-sm text-black/50">Loading pull requests...</p>
              </div>
            ) : pullRequests.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm text-black/50">No open pull requests</p>
              </div>
            ) : (
              pullRequests.map((pr) => (
                <a
                  key={pr.id}
                  href={pr.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-black truncate">
                          {pr.title}
                        </span>
                        {pr.draft && (
                          <span className="px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                            Draft
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-black/50">
                        <span>#{pr.number}</span>
                        <span>opened {new Date(pr.created_at).toLocaleDateString()}</span>
                        <span>by {pr.user.login}</span>
                      </div>
                      {pr.labels.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {pr.labels.slice(0, 3).map((label) => (
                            <span
                              key={label.name}
                              className="px-1.5 py-0.5 rounded text-xs"
                              style={{
                                backgroundColor: `#${label.color}20`,
                                color: `#${label.color}`,
                              }}
                            >
                              {label.name}
                            </span>
                          ))}
                          {pr.labels.length > 3 && (
                            <span className="text-xs text-black/50">+{pr.labels.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <FaExternalLinkAlt className="h-3 w-3 text-black/30 flex-shrink-0" />
                  </div>
                </a>
              ))
            )}
          </div>
        </div>

        {/* Issues */}
        <div className="rounded-2xl border border-[#D4D7E5] bg-white">
          <div className="p-4 md:p-6 border-b border-[#D4D7E5]">
            <div className="flex items-center gap-2">
              <FaExclamationCircle className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-black">Issues</h2>
              <span className="ml-auto px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                {issues.length} open
              </span>
            </div>
          </div>
          <div className="divide-y divide-[#D4D7E5] max-h-[500px] overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center">
                <FaCircleNotch className="h-6 w-6 mx-auto animate-spin text-black/30" />
                <p className="mt-2 text-sm text-black/50">Loading issues...</p>
              </div>
            ) : issues.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm text-black/50">No open issues</p>
              </div>
            ) : (
              issues.map((issue) => (
                <a
                  key={issue.id}
                  href={issue.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-black truncate">
                          {issue.title}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-black/50">
                        <span>#{issue.number}</span>
                        <span>opened {new Date(issue.created_at).toLocaleDateString()}</span>
                        <span>by {issue.user.login}</span>
                      </div>
                      {issue.labels.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {issue.labels.slice(0, 3).map((label) => (
                            <span
                              key={label.name}
                              className="px-1.5 py-0.5 rounded text-xs"
                              style={{
                                backgroundColor: `#${label.color}20`,
                                color: `#${label.color}`,
                              }}
                            >
                              {label.name}
                            </span>
                          ))}
                          {issue.labels.length > 3 && (
                            <span className="text-xs text-black/50">+{issue.labels.length - 3}</span>
                          )}
                        </div>
                      )}
                      {issue.assignees.length > 0 && (
                        <div className="mt-2 flex items-center gap-1">
                          {issue.assignees.slice(0, 3).map((assignee) => (
                            <img
                              key={assignee.login}
                              src={assignee.avatar_url}
                              alt={assignee.login}
                              className="h-5 w-5 rounded-full border border-white"
                              title={assignee.login}
                            />
                          ))}
                          {issue.assignees.length > 3 && (
                            <span className="text-xs text-black/50 ml-1">
                              +{issue.assignees.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <FaExternalLinkAlt className="h-3 w-3 text-black/30 flex-shrink-0" />
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Repo link */}
      {patStatus?.githubUrl && (
        <div className="mt-6">
          <a
            href={patStatus.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#3F86FF] hover:underline"
          >
            <FaGithub className="h-4 w-4" />
            View repository on GitHub
            <FaExternalLinkAlt className="h-3 w-3" />
          </a>
        </div>
      )}
    </>
  );
}
