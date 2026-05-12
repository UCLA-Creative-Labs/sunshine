const SLUG = /^[A-Za-z0-9_.-]+$/;

// normalizes "owner/repo" or a https://github.com/... URL into lowercase "owner/repo"
export function parseGithubRepo(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;

  const direct = raw.match(/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/);
  if (direct) {
    return `${direct[1]}/${direct[2]}`.toLowerCase();
  }

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  if (url.hostname !== 'github.com') return null;

  const [owner, repo] = url.pathname.replace(/^\/+/, '').split('/');
  if (!owner || !repo) return null;

  const cleanedRepo = repo.replace(/\.git$/, '');
  if (!SLUG.test(owner) || !SLUG.test(cleanedRepo)) return null;

  return `${owner}/${cleanedRepo}`.toLowerCase();
}
