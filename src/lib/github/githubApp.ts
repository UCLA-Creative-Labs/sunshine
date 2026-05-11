import { App } from '@octokit/app';

// Module-scoped App instance
let appInstance: App | null = null;

export function getGithubApp(): App {
    if (!appInstance) {
        const appId = process.env.GITHUB_APP_ID;
        let privateKey = process.env.GITHUB_APP_PRIVATE_KEY;

        if (privateKey && !privateKey.includes('-----BEGIN')) {
            try {
                privateKey = Buffer.from(privateKey, 'base64').toString('utf8');
            } catch (e) {
                // Ignore and hope the raw key works
            }
        } else if (privateKey) {
            privateKey = privateKey.replace(/\\n/g, '\n');
        }

        if (!appId || !privateKey) {
            throw new Error('Missing GITHUB_APP_ID or GITHUB_APP_PRIVATE_KEY in environment variables.');
        }

        appInstance = new App({
            appId,
            privateKey,
        });
    }

    return appInstance;
}

export async function getInstallationClient(repoFullName: string) {
    const app = getGithubApp();

    const [owner, repo] = repoFullName.split('/');
    if (!owner || !repo) {
        throw new Error(`Invalid repository full name format: ${repoFullName}`);
    }

    // Fetch the installation for this specific repository
    const { data: installation } = await app.octokit.request(
        'GET /repos/{owner}/{repo}/installation',
        {
            owner,
            repo,
        }
    );

    if (!installation || !installation.id) {
        throw new Error(`No GitHub App installation found for ${repoFullName}`);
    }

    // Return an authenticated octokit client for this installation
    return app.getInstallationOctokit(installation.id);
}
