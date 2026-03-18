# Security and Integrations Scaffold

This repo now includes a server-side scaffold for secure integrations and simple password-based access control.

## What is included

- Environment variable contract in `.env.example`
- Signed cookie session scaffold in `api/_lib/session.js`
- Basic username/password login routes:
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `GET /api/auth/me`
- Integration stubs:
  - `GET /api/integrations/mailchimp/overview`
  - `GET /api/integrations/streamline/overview`
- Upload pipeline placeholder:
  - `GET /api/uploads`
- Starter database schema:
  - `supabase/schema.sql`

## Secrets

Do not put third-party API keys in frontend files.

Keep real secrets only in:

- Vercel environment variables
- Supabase project secrets
- Local `.env` that is never committed

## Mailchimp

Official Mailchimp docs reviewed in this session indicate that:

- integrations can use OAuth 2
- API keys are also supported for direct API use
- server-side use is required for secure account access

Source:

- https://mailchimp.com/developer/marketing/docs/integrations/
- https://mailchimp.com/developer/marketing/guides/access-user-data-oauth-2/

## Streamline

The official Streamline product site was found, but public API docs were not verified in this session.

Source:

- https://www.streamlinevrs.com/

The integration client is intentionally generic until you provide:

- endpoint docs
- auth pattern
- sample payloads

## Minimum secure deployment setup

1. Add `APP_ADMIN_USERNAME`, `APP_ADMIN_PASSWORD`, and `APP_SESSION_SECRET` in Vercel
2. Add Mailchimp and Streamline secrets in Vercel only
3. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only
4. Never expose secrets to the browser
5. Normalize all vendor data into Postgres and let the dashboard read from Postgres, not directly from vendors
