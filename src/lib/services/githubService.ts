import { decryptPAT } from '@/lib/utils/encryption';

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  html_url: string;
  body: string | null;
  created_at: string;
  updated_at: string;
  merged_at: string | null;
  user: {
    login: string;
    avatar_url: string;
  };
  labels: Array<{ name: string; color: string }>;
  draft: boolean;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  html_url: string;
  body: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  user: {
    login: string;
    avatar_url: string;
  };
  labels: Array<{ name: string; color: string }>;
  assignees: Array<{ login: string; avatar_url: string }>;
}

export interface GitHubApiError {
  message: string;
  status?: number;
}

/**
 * Parse owner/repo from a GitHub URL
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace('.git', '') };
}

/**
 * Fetch pull requests from GitHub API
 */
export async function fetchPullRequests(
  owner: string,
  repo: string,
  encryptedPAT: string,
  options?: { state?: 'open' | 'closed' | 'all'; per_page?: number }
): Promise<{ data: GitHubPullRequest[] | null; error: GitHubApiError | null }> {
  try {
    const pat = decryptPAT(encryptedPAT);
    const state = options?.state ?? 'open';
    const perPage = options?.per_page ?? 30;

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls?state=${state}&per_page=${perPage}&sort=updated`,
      {
        headers: {
          'Authorization': `Bearer ${pat}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return { data: null, error: { message: 'Invalid or expired GitHub token', status: 401 } };
      }
      if (response.status === 403) {
        return { data: null, error: { message: 'GitHub API rate limit exceeded', status: 403 } };
      }
      if (response.status === 404) {
        return { data: null, error: { message: 'Repository not found or no access', status: 404 } };
      }
      return { data: null, error: { message: `GitHub API error: ${response.status}`, status: response.status } };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err) {
    return { data: null, error: { message: err instanceof Error ? err.message : 'Unknown error' } };
  }
}

/**
 * Fetch issues from GitHub API
 */
export async function fetchIssues(
  owner: string,
  repo: string,
  encryptedPAT: string,
  options?: { state?: 'open' | 'closed' | 'all'; per_page?: number }
): Promise<{ data: GitHubIssue[] | null; error: GitHubApiError | null }> {
  try {
    const pat = decryptPAT(encryptedPAT);
    const state = options?.state ?? 'open';
    const perPage = options?.per_page ?? 30;

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues?state=${state}&per_page=${perPage}&sort=updated`,
      {
        headers: {
          'Authorization': `Bearer ${pat}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return { data: null, error: { message: 'Invalid or expired GitHub token', status: 401 } };
      }
      if (response.status === 403) {
        return { data: null, error: { message: 'GitHub API rate limit exceeded', status: 403 } };
      }
      if (response.status === 404) {
        return { data: null, error: { message: 'Repository not found or no access', status: 404 } };
      }
      return { data: null, error: { message: `GitHub API error: ${response.status}`, status: response.status } };
    }

    const data = await response.json();
    // Filter out pull requests (GitHub includes PRs in issues endpoint)
    const issues = data.filter((item: { pull_request?: unknown }) => !item.pull_request);
    return { data: issues, error: null };
  } catch (err) {
    return { data: null, error: { message: err instanceof Error ? err.message : 'Unknown error' } };
  }
}

/**
 * Validate a GitHub PAT by making a test API call
 */
export async function validateGitHubPAT(pat: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${pat}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (response.ok) {
      return { valid: true };
    }
    if (response.status === 401) {
      return { valid: false, error: 'Invalid token' };
    }
    return { valid: false, error: `Validation failed: ${response.status}` };
  } catch (err) {
    return { valid: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
