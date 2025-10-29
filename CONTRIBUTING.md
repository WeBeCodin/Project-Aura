# Contributing to Project Aura

Thank you for your interest in contributing to Project Aura! This document provides guidelines and instructions for contributing to the project.

## 🎯 Philosophy

Project Aura follows the **Supercharger Manifesto** principles:

1. **Specification-Driven Development**: All features start with a specification
2. **Production-First Mindset**: Every commit should be production-ready
3. **Unbreakable by Design**: Comprehensive testing prevents regressions
4. **Visual Intelligence**: UI matches specifications pixel-perfect
5. **Measured Success**: Metrics drive decision-making

## 📋 Before You Start

### Read the Documentation
- [README.md](README.md) - Project overview and setup
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment procedures
- [specs/](specs/) - Feature specifications

### Understand the Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript (strict mode)
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Testing**: Jest (Unit), Playwright (E2E)
- **Deployment**: Vercel

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/Project-Aura.git
cd Project-Aura
```

### 2. Set Up Development Environment

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your local database credentials

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed sample data
npm run prisma:seed
```

### 3. Start Development Server

```bash
# Start the development server
npm run dev

# Open http://localhost:3000
```

## 📝 Making Changes

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Follow the Development Workflow

#### For New Features:

1. **Write Specification First**
   - Create or update a spec file in `specs/`
   - Document requirements, API endpoints, and validation criteria
   - Get specification approved before coding

2. **Implement Code**
   - Follow TypeScript strict mode
   - Use existing patterns and conventions
   - Keep changes minimal and focused

3. **Write Tests**
   - Unit tests for business logic
   - E2E tests for user flows
   - Aim for 80%+ code coverage

4. **Verify Locally**
   ```bash
   # Run linter
   npm run lint
   
   # Build the project
   npm run build
   
   # Run tests
   npm run test:unit
   npm run test:e2e
   ```

#### For Bug Fixes:

1. **Write a Failing Test**
   - Reproduce the bug with a test
   - Ensures the bug won't regress

2. **Fix the Issue**
   - Make minimal changes
   - Don't refactor unrelated code

3. **Verify the Fix**
   - Test passes
   - All other tests still pass
   - No new warnings or errors

## 🧪 Testing Guidelines

### Unit Tests

- Test business logic in isolation
- Mock external dependencies
- Use descriptive test names

```typescript
// Example unit test
describe('JobCard', () => {
  test('should display job title correctly', () => {
    const job = createMockJob({ title: 'AI Engineer' });
    render(<JobCard job={job} />);
    expect(screen.getByText('AI Engineer')).toBeInTheDocument();
  });
});
```

### E2E Tests

- Test complete user flows
- Use data-testid attributes
- Handle async operations properly

```typescript
// Example E2E test
test('Filter by category', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('category-filter').selectOption('AI_ML_ENGINEERING');
  await expect(page.getByTestId('job-card')).toBeVisible();
});
```

## 📐 Code Style

### TypeScript

- Use TypeScript strict mode
- Define proper types (no `any`)
- Export interfaces for reusability

```typescript
// Good
interface JobCardProps {
  job: JobListing;
  onClick?: () => void;
}

// Bad
const JobCard = (props: any) => { ... }
```

### React Components

- Use functional components with hooks
- Keep components focused and small
- Use CSS Modules for styling

```typescript
// Good
export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return <div className={styles.card}>...</div>;
};

// Bad - inline styles
<div style={{ margin: '10px' }}>...</div>
```

### API Routes

- Validate input parameters
- Handle errors gracefully
- Return consistent response formats

```typescript
// Good
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const data = await fetchData();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

## 🔄 Pull Request Process

### 1. Ensure Quality

Before submitting a PR:
- [ ] All tests pass locally
- [ ] Code follows style guidelines
- [ ] No TypeScript errors or warnings
- [ ] Build succeeds without errors
- [ ] Specifications updated (if applicable)

### 2. Submit Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name

# Create PR on GitHub
# Use the PR template
```

### 3. PR Description

Include in your PR description:
- **What**: Brief description of changes
- **Why**: Reason for the changes
- **How**: Technical approach used
- **Testing**: How to test the changes
- **Screenshots**: For UI changes

Example:
```markdown
## What
Adds filtering by vibe score to the global dashboard

## Why
Users requested ability to find only high-vibe opportunities

## How
- Added slider component for vibe score
- Updated API to filter by minimum vibe score
- Added E2E test for filter functionality

## Testing
1. Navigate to homepage
2. Adjust vibe score slider
3. Verify only jobs with score >= slider value are shown

## Screenshots
[Screenshot of vibe score filter]
```

### 4. Code Review

- Address reviewer feedback promptly
- Make requested changes in new commits
- Re-request review when ready
- Be respectful and open to suggestions

### 5. Merge

Once approved:
- Squash commits if requested
- Ensure CI passes
- Maintainer will merge

## 🚫 What NOT to Do

- **Don't** commit directly to `main` branch
- **Don't** commit secrets or credentials
- **Don't** remove existing tests without justification
- **Don't** use `console.log` for debugging (use proper logging)
- **Don't** commit `node_modules` or build artifacts
- **Don't** make breaking changes without discussion
- **Don't** submit PRs without tests

## 📊 Quality Requirements

All contributions must meet:

- **TypeScript Strict Mode**: 100%
- **Test Coverage**: 80%+ unit tests
- **E2E Critical Paths**: 100% (Search, Filter, AU-Hub)
- **Spec Compliance**: 100%
- **Build Success**: Zero errors, zero warnings

## 🤝 Communication

### Asking Questions

- Check existing issues first
- Use GitHub Discussions for general questions
- Tag issues appropriately

### Reporting Bugs

Use the bug report template:
```markdown
**Describe the bug**
A clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g. macOS]
- Browser: [e.g. Chrome]
- Version: [e.g. 1.0.0]
```

### Suggesting Features

1. Check if feature already exists in specs
2. Create an issue with "Feature Request" label
3. Describe the problem and proposed solution
4. Wait for maintainer feedback
5. If approved, write specification first

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in commit messages

## 📚 Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://prisma.io/docs)
- [Playwright Docs](https://playwright.dev/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### Project-Specific
- [Specifications](specs/)
- [API Documentation](specs/)
- [Testing Guide](README.md#testing)

## 📞 Getting Help

- **GitHub Issues**: Report bugs or request features
- **GitHub Discussions**: Ask questions or discuss ideas
- **Code Review**: Get feedback on your PR

## 📜 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on what's best for the project
- Acknowledge others' contributions

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Project Aura! 🌟

**Questions?** Open an issue or discussion on GitHub.
