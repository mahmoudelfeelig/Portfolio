import { NextResponse } from 'next/server';
import { fetchGithubRepos } from '../../../../lib/githubPortfolioData';

export async function GET() {
  try {
    const repos = await fetchGithubRepos();
    return NextResponse.json({ repos, source: 'github-api-live' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error while loading repositories';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
