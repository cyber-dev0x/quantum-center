# Quantum Center

**Tagline:** Learn AI by building it.

Quantum Center is an interactive AI learning lab built with Next.js, TypeScript, and Tailwind CSS.
It focuses on experimentation: train models, shape agent behavior, run simulations, and execute parameter sweeps.

## Live Product Areas

- **Hero** — lab-themed entry point with direct navigation into interactive modules.
- **Training Lab** — configure simple models, run training loops, and inspect live loss/accuracy trends.
- **Agent Lab** — define behavior vectors and run action tests with real-time logs.
- **Simulation** — execute scenario-driven multi-agent simulations with dynamic event streams.
- **Experiments** — tune reward/memory/mutation settings and generate experiment notes.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS 4**

## Local Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm start
```

## Environment Variables

Create `.env.local` if you want the GitHub button to point to your repo:

```bash
NEXT_PUBLIC_GITHUB_URL=https://github.com/<your-org-or-user>/<your-repo>
```

## Project Structure

```text
src/
  app/
  components/
    layout/
    ui/
  config/
  features/
    hero/
    training-lab/
    agent-lab/
    simulation/
    experiments/
  lib/
```
