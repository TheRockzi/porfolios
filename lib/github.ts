import { Octokit } from 'octokit';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
}

export interface GithubStats {
  totalStars: number;
  totalForks: number;
  totalRepos: number;
  contributions: number;
}

export async function getRepositories(username: string): Promise<Repository[]> {
  const { data } = await octokit.rest.repos.listForUser({
    username,
    sort: 'updated',
    per_page: 100,
  });

  return data as Repository[];
}

export async function getGithubStats(username: string): Promise<GithubStats> {
  const repos = await getRepositories(username);
  
  return {
    totalStars: repos.reduce((acc, repo) => acc + repo.stargazers_count, 0),
    totalForks: repos.reduce((acc, repo) => acc + repo.forks_count, 0),
    totalRepos: repos.length,
    contributions: 0, // This would require additional API calls to get contribution data
  };
}