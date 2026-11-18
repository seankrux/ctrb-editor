# Cloudflare deployment

Production: https://ctrb-editor.seanllms.workers.dev in Sean’s personal account `7a7a08127b6d6744c838413b4473ecf1`.

The static build stages the v4 and v5 browser editor pages, using v5 for `/`. Imported customer backup JSON and development tooling are excluded from public assets. The legacy `OPENAI_API_KEY` remains a server-side Worker secret and is never inserted into the browser editor.

Pull requests run Cloudflare bundle validation; merged `main` deploys through GitHub Actions using `CLOUDFLARE_API_TOKEN`.
