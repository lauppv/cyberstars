# Security policy

CyberStars runs code from anyone who opens a lesson, so we take security reports seriously.

## Supported versions

Only the `main` branch, which is what runs on [cyberstars.app](https://cyberstars.app), gets security fixes.

## Reporting a vulnerability

Please don't open a public issue. Report it privately through
[GitHub's vulnerability reporting](https://github.com/lauppv/cyberstars/security/advisories/new)
with the steps to reproduce it and what an attacker could do with it.

We aim to answer within a week and to keep you posted until it's fixed. With your consent, we'll
credit you in the advisory.

## What we care about most

- Escaping a code or terminal sandbox, or reaching the network or the host from one
- Getting around sign-in, sessions or the admin role
- Reading or changing another student's data
- Getting a lesson marked complete without passing its tests

## Please don't

- Test against other people's accounts or data
- Run load or denial-of-service tests against cyberstars.app (it runs on one small server)
- Use automated scanners that flood the site

Run a local copy instead (see [CONTRIBUTING.md](CONTRIBUTING.md)) for anything heavier than a few
requests.
