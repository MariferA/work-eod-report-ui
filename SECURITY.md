# Security Policy for Work EOD Project UI

## Reporting a Vulnerability

If you discover a security vulnerability in this project, **please report it responsibly**:

- **Do NOT create a public issue for security vulnerabilities.**
- **Do NOT commit secrets, API keys, or credentials.**
- Contact the maintainers directly via email: `mariferalcon@gmail.com`

## Supported Versions

We maintain the following versions of Work EOD UI:

| Version | Supported |
|---------|-----------|
| main    | ✅        |

## Security Guidelines for Contributors

- Do not commit `.env` files or any sensitive keys.
- All credentials must be stored as GitHub Secrets for CI/CD.
- Use secure dependencies (pnpm audit`) before pushing code.
- For feature development, fork the repository and submit pull requests.

## Response Process

- Upon receiving a vulnerability report, maintainers will acknowledge within 48 hours.
- Critical vulnerabilities will be patched and released as soon as possible.
- Non-critical issues will be scheduled in regular releases.
