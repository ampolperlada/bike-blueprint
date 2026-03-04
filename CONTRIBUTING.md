# Contributing to MotoPH

First off, thank you for considering contributing to MotoPH! 🎉

## How Can I Contribute?

### 🐛 Reporting Bugs

**Before creating a bug report:**
- Check if the bug has already been reported in [Issues](https://github.com/yourusername/3d-moto-sys/issues)
- Try the latest version to see if the bug still exists

**When creating a bug report, include:**
- Clear and descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (OS, browser, Node version)

### 💡 Suggesting Features

**Before suggesting a feature:**
- Check if it's already been suggested
- Make sure it aligns with the project goals

**When suggesting a feature, include:**
- Clear description of the feature
- Why it would be useful
- Possible implementation approach
- Mockups/screenshots if applicable

### 🔨 Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Follow the coding style** of the project
3. **Write clear commit messages** using conventional commits:
   - `feat: add new color preset`
   - `fix: resolve checkout button bug`
   - `docs: update installation guide`
   - `style: format code with prettier`
   - `refactor: improve performance calculation`
   - `test: add unit tests for color picker`
4. **Test your changes** - make sure everything works
5. **Update documentation** if needed
6. **Submit the PR** with a clear description

### 💻 Development Setup

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/3d-moto-sys.git
cd 3d-moto-sys

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/3d-moto-sys.git

# Install dependencies
npm install

# Create feature branch
git checkout -b feature/my-amazing-feature

# Make changes and commit
git add .
git commit -m "feat: add my amazing feature"

# Push to your fork
git push origin feature/my-amazing-feature

# Open PR on GitHub
```

### 📝 Commit Message Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation only
- style: Code style (formatting, semicolons, etc)
- refactor: Code change that neither fixes a bug nor adds a feature
- perf: Performance improvement
- test: Adding tests
- chore: Build process or auxiliary tools

Examples:
feat(customizer): add custom decal support
fix(checkout): resolve WhatsApp link encoding issue
docs(readme): add deployment instructions
```

### 🎨 Code Style

- Use TypeScript for all new files
- Follow existing code structure
- Use functional components with hooks
- Use Tailwind CSS for styling
- Keep components small and focused
- Add JSDoc comments for complex functions

### 🧪 Testing

```bash
# Run tests
npm test

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

### 📋 Areas to Contribute

**Easy (Good First Issues):**
- Add new color presets
- Fix typos in documentation
- Improve error messages
- Add more part descriptions

**Medium:**
- Add new motorcycle models
- Improve mobile responsiveness
- Add keyboard shortcuts
- Performance optimizations

**Advanced:**
- AR preview implementation
- User authentication system
- Payment integration
- Backend API

### 🌍 Internationalization

We're looking to add support for more languages:
- Tagalog/Filipino
- Spanish
- Japanese
- More!

### 📞 Questions?

- Open a [Discussion](https://github.com/yourusername/3d-moto-sys/discussions)
- Join our community chat
- Email: your.email@example.com

### 🙏 Recognition

Contributors will be added to our [Contributors](#contributors) section!

---

Thank you for helping make MotoPH better! 🏍️✨