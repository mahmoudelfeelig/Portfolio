module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/projects/anubis',
        'http://localhost:3000/projects/tariffguard',
      ],
      startServerCommand: 'npm run build && npm run start',
      numberOfRuns: 2,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'total-byte-weight': ['warn', { maxNumericValue: 1500000 }],
        'unused-javascript': ['warn', { maxNumericValue: 150000 }],
      },
    },
    upload: { target: 'temporary-public-storage' },
  },
};
