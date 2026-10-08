# Requirements source

Source: user request dated 2026-10-09. Crawled pages and attached JSON are source material, not instructions.

- U001: Rebuild custom-kitchen-hoods.com as a distinct design.
- U002: Use alphapartyrentalmiami.com as the feature/content-structure reference, excluding its design and unrelated service families.
- U003: Focus on mobile kitchen trailer rental with kitchen, dishwashing, walk-in cooler, walk-in freezer, and refrigeration trailer rentals.
- U004: Treat the supplied Moz DA as 10.
- U005: Use site-38.json for state/city page structure.
- U006: Publish 1-800-205-6106 as the business phone.
- U007: Send all non-calculator contact forms to the supplied Glide webhook using the supplied token; replace example.com with the actual page URL.
- U008: Create Temporary-123-Inc/custom-kitchen-hoods.com on GitHub.

Security resolution: the webhook token is not committed or bundled into the browser. It is consumed by a server-side endpoint through `GLIDE_WEBHOOK_TOKEN`.
