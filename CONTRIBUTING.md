# Contributing to StudyMaster

First off, thank you for considering contributing to StudyMaster! It's people like you that make StudyMaster such a great tool for students worldwide.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (screenshots, code snippets)
- **Describe the behavior you observed and what you expected**
- **Include browser and OS information**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any similar features in other applications**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code, test it thoroughly
3. Ensure your code follows the existing style
4. Update documentation as needed
5. Write a clear commit message

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/studymaster.git

# Create a branch
git checkout -b feature/your-feature-name

# Make your changes
# Test in multiple browsers

# Commit your changes
git commit -m "Add some feature"

# Push to your fork
git push origin feature/your-feature-name

# Create Pull Request
```

## Coding Standards

### JavaScript

- Use modern ES6+ syntax
- Follow functional programming principles where possible
- Comment complex logic
- Use meaningful variable names
- Avoid global variables

```javascript
// Good
function calculateStudyStreak(sessions) {
    return sessions.filter(s => s.completed).length;
}

// Avoid
function calc(s) {
    return s.filter(x => x.c).length;
}
```

### CSS

- Use CSS custom properties for theming
- Follow BEM naming convention for classes
- Mobile-first responsive design
- Maintain consistent spacing

```css
/* Good */
.card {
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
}

/* Avoid */
.card {
    padding: 16px;
    border-radius: 8px;
}
```

### HTML

- Use semantic HTML5 elements
- Include ARIA labels for accessibility
- Keep markup clean and readable

```html
<!-- Good -->
<nav aria-label="Main navigation">
    <a href="#dashboard" aria-label="Go to dashboard">Dashboard</a>
</nav>

<!-- Avoid -->
<div class="nav">
    <a href="#dashboard">Dashboard</a>
</div>
```

## Testing

Before submitting a PR, test your changes:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (if possible)
- [ ] Mobile browsers
- [ ] Dark mode
- [ ] LocalStorage functionality

## Documentation

- Update README.md if needed
- Add JSDoc comments for complex functions
- Include inline comments for tricky logic
- Update CHANGELOG.md

## Feature Development Process

### Small Features (< 100 lines)

1. Create issue describing the feature
2. Get feedback from maintainers
3. Implement in a single PR
4. Address review comments

### Large Features (> 100 lines)

1. Create detailed proposal in issues
2. Discuss architecture and approach
3. Break into smaller PRs if possible
4. Implement with thorough testing
5. Update documentation

## Priority Areas for Contribution

We especially welcome contributions in these areas:

### High Priority
- Accessibility improvements
- Performance optimizations
- Bug fixes
- Mobile UX enhancements
- Browser compatibility

### Medium Priority
- Additional time management techniques
- New chart types for analytics
- UI/UX improvements
- Internationalization (i18n)

### Low Priority
- New themes
- Additional animations
- Easter eggs
- Documentation improvements

## Questions?

Don't hesitate to ask! Create an issue with the "question" label or join our discussions.

## Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Given credit in commit history

Thank you for making StudyMaster better! 🎓
