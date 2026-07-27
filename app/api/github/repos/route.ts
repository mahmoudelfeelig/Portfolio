import { NextResponse } from 'next/server';
import { fetchGithubRepos } from '../../../../lib/githubPortfolioData';

export async function GET() {
  try {
    const repos = await fetchGithubRepos();
    return NextResponse.json({ repos, source: 'github-api-live' });
  } catch (error) {
    return NextResponse.json({
      repos: [],
      source: 'portfolio-static-fallback',
      warning: error instanceof Error
        ? 'GitHub data is temporarily unavailable.'
        : 'Repository data is temporarily unavailable.',
    });
  }
}
