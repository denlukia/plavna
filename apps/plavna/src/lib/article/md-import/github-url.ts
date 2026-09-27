export function isGitHubFileUrl(url: string): boolean {
	try {
		return new URL(url).hostname.toLowerCase() === 'github.com';
	} catch {
		return false;
	}
}

export function isGithubHostedMarkdownUrl(url: string): boolean {
	try {
		const hostname = new URL(url).hostname.toLowerCase();
		return hostname === 'github.com' || hostname.endsWith('.githubusercontent.com');
	} catch {
		return false;
	}
}

export function toRawMarkdownUrl(url: string): string {
	const parsed = new URL(url);
	if (parsed.hostname.toLowerCase() !== 'github.com') {
		return url;
	}
	// https://github.com/{owner}/{repo}/blob/{branch}/{path...}
	// https://github.com/{owner}/{repo}/raw/{branch}/{path...}
	const match = parsed.pathname.match(/^\/([^/]+)\/([^/]+)\/(blob|raw)\/(.+)$/);
	if (!match) {
		return url;
	}
	const [, owner, repo, , branchAndPath] = match;
	const repoName = repo.endsWith('.git') ? repo.slice(0, -'.git'.length) : repo;
	return `https://raw.githubusercontent.com/${owner}/${repoName}/${branchAndPath}`;
}
