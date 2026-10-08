# Custom Kitchen Hoods

Original React + TypeScript + Vite rebuild for [custom-kitchen-hoods.com](https://custom-kitchen-hoods.com/), focused on mobile commercial kitchen, dishwashing, walk-in cooler, walk-in freezer, and refrigeration trailer rentals.

## Local development

```bash
npm install
npm run dev
npm run build
```

## Contact integration

Set these server-only variables in Vercel:

- `GLIDE_WEBHOOK_URL`
- `GLIDE_WEBHOOK_TOKEN`

The browser submits to `/api/contact`; the server validates the payload and forwards `{ data: ... }` to Glide. The rental calculator never submits contact data.
