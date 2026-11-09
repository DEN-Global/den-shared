# DEN shared frontend and contracts

Shared React components, API/session helper, role workspace modules, Manrope/forest/lime design tokens, QR workflows, and versioned route contracts for Consumer, Manager, Rider, Dispatch and Admin. Manager and Rider include the DEN pet notification companion: it announces new customer orders and available deliveries, with optional foreground speech and opt-in Web Push. Browser and operating-system notification preferences remain in control; the companion cannot override Do Not Disturb. See [pet-companion.md](docs/pet-companion.md). Warehouse keeps its existing working application; it is not overwritten.

`npm ci && npm test` runs the shared API cookie/CSRF/error-contract tests. `contracts/v1.json` records actual implemented routes, payloads, enums and security invariants. It is a practical integration manifest, not a claim that all desired DEN features are implemented.

Run `node scripts/sync-apps.mjs` with sibling `den-consumer`, `den-manager`, `den-rider`, `den-dispatch` and `den-admin` directories. This creates self-contained vendored snapshots with file SHA-256 provenance so each private app builds independently in CI. Apps resolve React once with Vite dedupe to avoid duplicate hook runtimes. Shared sources and snapshots must be committed together in coordinated releases.

No credentials, live payment/provider adapters, fabricated metrics or access decisions are bundled. Server authorization is authoritative. International activation remains Primary-only. Wallet transactions and location points are read from the API. Camera/geolocation requests happen only following explicit user actions.

Design reference: `docs/consumer-concept.png`; extracted visual family and acceptance evidence: `docs/frontend-verification.md`.
