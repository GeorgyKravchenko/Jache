# Contributing to Jache

Thank you for your interest in the Jache project! We welcome community contributions.

## 🚀 How to Contribute

### 1. Fork and Clone

```bash
git clone https://github.com/yourusername/jache.git
cd jache
npm install
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-fix-name
```

### 3. Development

- Follow the existing code style
- Add tests for new features
- Update documentation
- Make sure all tests pass

### 4. Testing

```bash
# Run benchmarks
npm run benchmark

# Run examples
npm run example

# Run tests
npm test
```

### 5. Commit and Push

```bash
git add .
git commit -m "feat: add new optimization feature"
git push origin feature/your-feature-name
```

### 6. Pull Request

Create a Pull Request with a description of your changes.

## 📋 Guidelines

### Code Style

- Use 2 spaces for indentation
- Follow ESLint configuration
- Use clear variable and function names
- Add comments for complex logic

### Optimizations

- **Only safe optimizations** — no AST transforms
- **Test performance** — show improvements
- **Document limitations** — what works, what doesn't
- **Minimal overhead** — don't slow down fast functions

### Testing

- Add unit tests for new features
- Update benchmarks if API changes
- Test on different Node.js versions
- Test edge cases

## 🐛 Reporting Bugs

When creating an issue:

1. Describe the problem
2. Provide a minimal reproducible example
3. Specify Node.js version
4. Attach error logs

## 💡 Suggestions

When proposing new features:

1. Explain the problem the feature solves
2. Propose an API design
3. Show a usage example
4. Discuss performance

## 📚 Documentation

- Update README.md when changing the API
- Add usage examples
- Document limitations
- Update JSDoc comments

## 🔒 Safety

- Do not apply dangerous optimizations
- Validate input data
- Avoid eval() and Function()
- Test edge cases

## 📞 Communication

- GitHub Issues for bugs and suggestions
- GitHub Discussions for general questions
- Pull Requests for contributions

Thank you for contributing to Jache! 🚀 