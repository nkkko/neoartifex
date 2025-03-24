# Contributing to NeoArtifex

Thank you for your interest in contributing to NeoArtifex! We welcome contributions from everyone who wants to help improve our library of AI prompts.

## How to Contribute Prompts

The easiest way to contribute is by adding new prompts to our collection. Here's how:

### 1. Fork the Repository

Start by forking the [NeoArtifex repository](https://github.com/nkkko/neoartifex) to your own GitHub account.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR-USERNAME/neoartifex.git
cd neoartifex
```

### 3. Create a New Branch

```bash
git checkout -b add-new-prompt
```

### 4. Add Your Prompt

Create a new markdown file in the `/prompts` directory. The filename should be lowercase, with words separated by hyphens (e.g., `my-new-prompt.md`).

Each prompt file should follow this format:

```markdown
---
title: "Your Prompt Title"
description: "A short description of what this prompt does"
tags: ["tag1", "tag2", "tag3"]
date: "YYYY-MM-DD"
author: "Your Name"
---

# Your Prompt Title

## Context/Background
Brief explanation of what this prompt is for and when to use it.

## Prompt

```prompt
Your actual prompt text goes here. This should be the exact text that users would copy and paste into an AI system.
```

## Example Response

```response
An example of what the AI might respond with (optional but recommended).
```

## Tips for Usage
- Include any tips for getting the best results
- Mention variations or modifications that might be useful
- Note any limitations or edge cases
```

### 5. Commit Your Changes

```bash
git add prompts/your-new-prompt.md
git commit -m "Add new prompt: Your Prompt Title"
```

### 6. Push to Your Fork

```bash
git push origin add-new-prompt
```

### 7. Create a Pull Request

Go to the [NeoArtifex repository](https://github.com/nkkko/neoartifex) and create a new pull request from your fork.

## Prompt Guidelines

To ensure quality and consistency, please follow these guidelines:

1. **Originality**: Contribute original prompts or properly attribute sources
2. **Usefulness**: Prompts should solve a specific problem or serve a clear purpose
3. **Format**: Follow the template above, including frontmatter metadata
4. **Tags**: Include relevant tags to make your prompt discoverable
5. **Testing**: Test your prompt with at least one AI system before submitting
6. **Ethics**: Prompts must be ethical and not designed for harmful purposes

## Other Contributions

Beyond adding prompts, we also welcome:

- Bug fixes
- Feature enhancements
- Documentation improvements
- UI/UX improvements

For more substantial changes, please open an issue first to discuss your ideas.

## Code of Conduct

Please be respectful and constructive in all interactions. We aim to foster an inclusive and welcoming community.

## Questions?

If you have any questions about contributing, please reach out to us at hi@neoartifex.com.

Thank you for helping make NeoArtifex better!