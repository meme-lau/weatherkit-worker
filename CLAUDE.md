# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

iRingo WeatherKit is a proxy service that enhances Apple WeatherKit responses for iOS/macOS/watchOS weather apps. It intercepts WeatherKit API calls and can:
- Replace weather data with alternative sources (ColorfulClouds/彩云天气, QWeather/和风天气)
- Add next-hour precipitation forecasts
- Replace air quality data (WAQI, ColorfulClouds CN standard)
- Unlock weather features for regions where they're unavailable

## Build System

The project uses **rspack** for bundling JavaScript and **@iringo/arguments-builder** for generating proxy module configurations.

### Common Commands

```bash
# Development (parallel build + sgmodule dev server)
npm run dev

# Production build (rspack bundles)
npm run build

# Generate proxy modules (Surge, Loon, Stash, etc.)
npm run build:args

# Generate workers-specific modules
npm run build:args:workers

# Deploy to Cloudflare Workers
npm run deploy:wrangler

# Deploy to Vercel
npm run deploy:vercel

# Local development with wrangler
npm run dev:wrangler
```

## Architecture

### Entry Points

- **`src/Hono.js`** - Main Hono web service entry point for Cloudflare Workers/Vercel deployment
- **`src/request.js`** / **`src/response.js`** - Entry points for proxy app scripts (Surge, Loon, Quantumult X, etc.)

### Processing Pipeline

```
Request → src/process/Request.mjs → Apple WeatherKit API → src/process/Response.mjs → Client
```

- **`src/process/Request.mjs`** - Intercepts and modifies outgoing requests
- **`src/process/Response.mjs`** - Processes API responses, applies data transformations

### Data Source Classes (`src/class/`)

Each class handles parsing/transforming data from a specific weather provider:
- **`WeatherKit2.mjs`** - Apple WeatherKit protobuf response processing
- **`ColorfulClouds.mjs`** - 彩云天气 API integration
- **`QWeather.mjs`** - 和风天气 API integration
- **`AirQuality.mjs`** - Air quality data processing and index conversion
- **`WAQI.mjs`** - World Air Quality Index data
- **`ForecastNextHour.mjs`** - Next-hour precipitation forecast processing
- **`MatchEnum.mjs`** - Weather condition enum mapping between providers

### Utilities (`src/function/`)

- **`database.mjs`** - Weather condition code databases and mappings
- **`setENV.mjs`** - Environment/settings configuration from proxy app parameters
- **`parseWeatherKitURL.mjs`** - Parse WeatherKit API endpoint URLs
- **`providerNameToLogo.mjs`** - Map provider names to logo URLs

## Proxy Module Generation

The `arguments-builder*.config.ts` files define settings UI for proxy apps (Surge, Loon, Stash, Quantumult X, Shadowrocket). These generate:
- `.sgmodule` / `.plugin` / `.stoverride` / `.snippet` files in `dist/`
- TypeScript type definitions in `src/types.d.ts`
- BoxJS settings JSON in `template/boxjs.settings.json`

### Key Configuration Options

- **Weather.Provider** - Data source: `WeatherKit` (passthrough), `ColorfulClouds`, or `QWeather`
- **AirQuality.Provider** - AQI source: `WeatherKit`, `ColorfulClouds`, `WAQI`, or `QWeather`
- **NextHour.Provider** - Precipitation source: `WeatherKit` or `ColorfulClouds`

## Code Style

- Uses **Biome** for linting/formatting (configured in `biome.json`)
- 4-space indentation, double quotes, LF line endings
- Run `npx biome check .` to lint, `npx biome format .` to format

## Deployment Targets

- **Cloudflare Workers** - Primary deployment via `wrangler.jsonc`
- **Vercel** - Alternative deployment via `vercel.json`
- **Proxy Apps** - Client-side scripts for Surge, Loon, Stash, Quantumult X, Shadowrocket
