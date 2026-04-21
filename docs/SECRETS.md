# Secrets Management Guide

## Overview

This document describes all secrets used by the Sam Gong (三公) game server, how to generate and rotate them, and how to configure them for CI/CD environments.

---

## Secrets Inventory

| Secret | Purpose | Required In | Notes |
|--------|---------|-------------|-------|
| `JWT_SECRET` | Signs JWT tokens for future player auth | Production | Generate with `openssl rand -base64 32` |
| `COLYSEUS_AUTH_SECRET` | Server-to-server auth (reserved) | Future | Not yet implemented |
| `DATABASE_URL` | PostgreSQL connection string | Production only | Pilot phase uses SQLite |
| `SMTP_PASSWORD` | Alert email delivery | Optional | SMTP auth password |
| `SENTRY_DSN` | Error tracking | Optional | From Sentry project settings |

---

## Generating Secrets

### JWT_SECRET (256-bit, base64)

```bash
openssl rand -base64 32
```

Example output (do NOT use this value):
```
K5r2mNqPvJw8XhLzYdA3fT1cBuG7sEiO9n0RkQjH4eW=
```

### Database Password

Use a password manager or:

```bash
openssl rand -hex 24
```

---

## Environment Setup

1. Copy the example file:

   ```bash
   cp server/.env.example server/.env
   ```

2. Fill in real values for your environment.

3. **Never commit `.env`** — it is in `.gitignore`.

4. The server validates required vars at startup via `server/scripts/validate-env.ts`. Missing or placeholder values cause a hard exit.

---

## Secret Rotation

### Rolling Restart (zero-downtime)

1. Generate new secret value.
2. Update the secret in your secret manager (GitHub Actions secrets, Kubernetes Secret, etc.).
3. Redeploy the server — Kubernetes rolling update ensures no gap.
4. Verify health checks pass before old pods are terminated.

### JWT_SECRET rotation

Because JWT tokens are short-lived (if implemented), rotation requires:

1. Add `JWT_SECRET_NEXT` alongside `JWT_SECRET`.
2. Update server to accept tokens signed by either key.
3. After all existing tokens expire, remove `JWT_SECRET` and rename `JWT_SECRET_NEXT`.

---

## GitHub Actions Configuration

Configure these secrets in **Settings → Secrets and variables → Actions**:

| Secret Name | Description |
|-------------|-------------|
| `KUBE_CONFIG` | Base64-encoded kubeconfig for cluster access |
| `GHCR_TOKEN` | GitHub Container Registry token (PAT with `write:packages`) |
| `JWT_SECRET` | Production JWT secret (only if deploying from Actions) |
| `SENTRY_AUTH_TOKEN` | For uploading source maps to Sentry |

To add a secret:

```bash
gh secret set JWT_SECRET --body "$(openssl rand -base64 32)"
gh secret set GHCR_TOKEN --body "ghp_your_pat_here"
```

---

## Kubernetes Secrets

For production Kubernetes deployments:

```bash
# Create secret from .env file
kubectl create secret generic samgong-env \
  --from-env-file=server/.env \
  --namespace=samgong

# Reference in deployment (see k8s/deployment.yaml)
envFrom:
  - secretRef:
      name: samgong-env
```

---

## What Must Never Be Committed

The following must never appear in version control:

- `.env` and `.env.*` (except `.env.example`)
- `*.key`, `*.pem`, `*.p12`, `*.pfx`
- `credentials.json`, `service-account*.json`
- Any file containing real API keys, passwords, or tokens

Verify with:

```bash
git diff --cached | grep -iE '(password|secret|token|key)\s*=' | grep -v example
```

---

## .gitignore Verification

The following patterns are confirmed in `server/.gitignore`:

```gitignore
.env
.env.*
!.env.example
data/
*.db
*.sqlite
logs/
*.key
*.pem
credentials.json
```

---

## Security Contacts

If a secret is accidentally committed:

1. **Immediately rotate the secret** — assume it is compromised.
2. Remove it from git history: `git filter-repo` or BFG Repo-Cleaner.
3. Force-push the cleaned history (coordinate with team).
4. Audit access logs for unauthorized use.
5. Notify the security team.
