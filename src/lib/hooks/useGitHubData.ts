import { useState, useEffect, useCallback } from 'react';

interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  html_url: string;
  body: string | null;
  created_at: string;
  updated_at: string;
  merged_at: string | null;
  user: { login: string; avatar_url: string };
  labels: Array<{ name: string; color: string }>;
  draft: boolean;
}

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  html_url: string;
  body: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  user: { login: string; avatar_url: string };
  labels: Array<{ name: string; color: string }>;
  assignees: Array<{ login: string; avatar_url: string }>;
}

interface UseGitHubDataReturn {
  pullRequests: GitHubPullRequest[];
  issues: GitHubIssue[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGitHubData(
  projectId: string | null,
  options?: { state?: 'open' | 'closed' | 'all' }
): UseGitHubDataReturn {
  const [pullRequests, setPullRequests] = useState<GitHubPullRequest[]>([]);
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);
    setError(null);

    try {
      const state = options?.state ?? 'open';

      const [prResponse, issuesResponse] = await Promise.all([
        fetch(`/api/projects/${projectId}/github/pulls?state=${state}`),
        fetch(`/api/projects/${projectId}/github/issues?state=${state}`),
      ]);

      if (prResponse.ok) {
        const prData = await prResponse.json();
        setPullRequests(prData.data ?? []);
      } else {
        const prError = await prResponse.json();
        setPullRequests([]);
        setError(prError.error || 'Failed to fetch pull requests');
      }

      if (issuesResponse.ok) {
        const issuesData = await issuesResponse.json();
        setIssues(issuesData.data ?? []);
      } else {
        const issuesError = await issuesResponse.json();
        setIssues([]);
        if (!error) {
          setError(issuesError.error || 'Failed to fetch issues');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch GitHub data');
      setPullRequests([]);
      setIssues([]);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, options?.state, error]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    pullRequests,
    issues,
    isLoading,
    error,
    refetch: fetchData,
  };
}

export type { GitHubPullRequest, GitHubIssue };
