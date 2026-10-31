[README.md](https://github.com/user-attachments/files/34215167/README.md)
# Cynbit Blueprint Builder

A dependency-free prototype that replaces the blank message box on cynbit.in's contact page with a short guided scope. The visitor answers four questions and instantly receives an indicative budget, timeline and phase breakdown, plus a structured brief they can email to Cynbit.

> **Status:** prototype. The rates and durations are placeholder assumptions, not Cynbit's real pricing.

## Why this exists

The contact page promises "a tailored strategic overview", but it offers a single free-text box. That leaves visitors guessing what to write and leaves Cynbit with unstructured inquiries. Blueprint Builder gives the visitor value first and gives the team a scoped brief.

## Features

- Four-step wizard: what you're building, scale, must-have capabilities, pace.
- Instant budget range (in INR) and timeline in weeks.
- Phase bar that maps the timeline onto Cynbit's six-step lifecycle.
- Recommended Cynbit expertise based on the answers.
- Editable brief with live preview, sent through a `mailto:` link or copied to the clipboard.
- Light and dark themes that follow the system setting.
- Keyboard-friendly: native buttons with `aria-pressed`, labelled inputs, a live region and visible focus rings.
- No build step, no libraries, no network requests.

## Project structure

```
cynbit-blueprint/
├── index.html   # page markup and a mount point for the wizard
├── styles.css   # theme variables, layout and components
├── script.js    # data, estimation logic and rendering
└── README.md
```

## Run it

No installation is needed. Keep the three files in the same folder and open `index.html` in a browser.

To serve it locally instead:

```bash
cd cynbit-blueprint
python3 -m http.server 8000
# then visit http://localhost:8000
```

## How the estimate works

Every workstream and capability has a base cost (in lakh rupees) and a base duration (in weeks). Scale and pace apply multipliers.

```
cost  = (sum of workstream costs + sum of capability costs) × scale multiplier × pace multiplier
range = 0.85 × cost  to  1.20 × cost
```

| Setting | Cost multiplier | Time multiplier |
| --- | --- | --- |
| MVP / pilot | 1.0 | 1.0 |
| Growth-ready | 1.8 | 1.4 |
| Enterprise-grade | 3.2 | 1.9 |
| Standard pace | 1.0 | 1.0 |
| Fast-track | 1.25 | 0.75 |

Timeline: start with the longest workstream, add half the weeks of every other workstream, add half the weeks of each capability, then apply the time multipliers. The result is rounded to whole weeks, with a minimum of 2.

The total is spread across the six lifecycle phases: Discovery 8%, Blueprint 10%, Design 14%, Build 40%, QA and security 16%, Launch and evolve 12%.

### Worked examples

| Scenario | Budget | Timeline |
| --- | --- | --- |
| Website only, MVP, standard | ₹1.3 L – ₹1.8 L | 5 weeks |
| AI automation + website, with AI chat and integrations, growth-ready, standard | ₹9.9 L – ₹14 L | 14 weeks |
| SaaS product, enterprise-grade, fast-track | ₹20 L – ₹29 L | 17 weeks |

## Customising

All content and numbers live in the `DATA` object at the top of `script.js`.

| Key | Entry format |
| --- | --- |
| `types` | `[label, description, cost in ₹ lakh, weeks, service area]` |
| `scale` | `[label, description, cost multiplier, time multiplier]` |
| `feats` | `[label, cost in ₹ lakh, weeks]` |
| `speed` | `[label, description, cost multiplier, time multiplier]` |
| `phases` | `[name, percent of timeline, colour]` |

Other common edits:

- **Email destination:** the `mailto:` address inside `result()` in `script.js`.
- **Colours and themes:** the CSS variables at the top of `styles.css`, which have separate light and dark values.
- **Copy:** the heading and intro text in `index.html`.

## Embedding in the real site

- Drop the three files into the contact page, or move the markup into a component and keep the logic as is.
- Replace the `mailto:` link with a form `POST` to Cynbit's own endpoint or CRM.
- Calibrate the `DATA` rates with the delivery team before showing numbers to visitors.

## Known limitations

- The numbers are illustrative, not quotes.
- Sending relies on the visitor's email client through `mailto:`.
- Not yet tested across browsers and devices. Check layout on a real phone before relying on it.
- No analytics, so completion rate cannot be measured yet.

## Ideas for next steps

- Post the brief to a backend and CRM.
- Use an AI model to turn the free-text notes into a fuller written proposal.
- Track completion rate and inquiry quality against the current form.
- Add currency and region options.
