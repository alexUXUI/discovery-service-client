# Rsbuild Project

## Developing

1. npm run build // rsbuild creates /dist/
2. npm run deploy // AWS CLI sync /dist/ with S3
3. num run purge // AWS CLI invalidate Cloudfront CDN Cache

## Setup

Install the dependencies:

```bash
pnpm install
```

## Get Started

Start the dev server:

```bash
pnpm dev
```

Build the app for production:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```
# discovery-service-client
