# DANIAL.EXE — Portfolio Setup & Project Guide

A lightweight, original pixel-art portfolio for Danial Ebrazeh. Explore a small software-engineering office, interact with its terminals, or use Quick Navigation and the complete readable profile below the game.

## Portfolio

Danial Ebrazeh is a Chief Software & Information Officer (CSIO), a Computer Engineering undergraduate, and a backend-focused full-stack software engineer. The portfolio presents software and IT leadership, engineering interests, public GitHub projects, and research without inventing company details or undisclosed research information.

- Leadership: software engineering leadership, architecture, technical planning, IT strategy and coordination, workflow management, delivery, technology evaluation, and alignment with business requirements.
- Backend: Python, FastAPI, C#, ASP.NET Core, RESTful APIs, architecture, authentication and authorization, API integration.
- Frontend: Vue.js, JavaScript, TypeScript, HTML, CSS.
- Data: SQL, relational databases, NoSQL, database design, modeling, and processing.
- AI: PyTorch, machine learning, deep learning, and NLP.
- Embedded and IoT: STM32, Arduino, ATmega, ARM-based systems, embedded C/C++, sensor integration, and IoT development.
- Research: “The impact of linguistic data and corpus-based tools on teaching lexically ambiguous words to non-Persian speakers” and an ongoing intelligent-networks research project.
- Contact: [danialebrazeh@gmail.com](mailto:danialebrazeh@gmail.com) · [GitHub profile](https://github.com/Danial-EBR2002)

## Features and controls

- Original canvas-drawn pixel-art environment; all artwork is local and created in source.
- Explore Mode: focus/click the map and move with WASD or arrow keys; press E or Enter near a terminal.
- Touch movement pad and Interact button on smaller screens.
- Quick Navigation opens each portfolio file without moving the character.
- Native accessible dialog panels close with Escape and return focus to their opener.
- The full professional profile remains present as readable page content; gameplay is never required.
- Collision detection, map bounds, idle/walk sprite states, and restrained animated monitor/server indicators.
- Honors the operating system’s reduced-motion preference; no external fonts, runtime assets, APIs, or backend are required.
- Selected project links are from public repositories on the actual GitHub account. Descriptions are grounded in their published READMEs; the page does not request the GitHub API at runtime.

## Local preview

Requirements: Node.js 20+ with the built-in test runner and Python 3 (for the static preview server). No package installation is needed.

```sh
python -m http.server 4173
```

Open `http://localhost:4173` in a browser. Serve the project over HTTP rather than opening `index.html` as a file, because the JavaScript uses native ES modules.

## Tests

```sh
npm test
npm run check
```

The automated suite covers map bounds, object collision, cardinal and normalized-diagonal movement, collision-aware reachability from the spawn point to every station, station-to-panel mapping, and idle-sprite/reduced-motion behavior. Browser QA should additionally cover keyboard/touch input, dialogs and focus restoration, every direct-navigation panel, responsive layout, project/email links, refresh behavior, and reduced motion.

## Customization

- Edit portfolio copy and section structure in `index.html`.
- Update public project descriptions and links in `src/portfolio-data.js`. Keep project claims grounded in the linked repository.
- Adjust station positions, collision rectangles, movement speed, and world bounds in `src/world.js`.
- Modify hand-drawn room tiles and sprites in `src/renderer.js`; the internal canvas is 640 × 400 pixels.
- Input bindings and touch controls live in `src/input.js`; dialog and mode behavior live in `src/ui.js`.
- Palette, pixel borders, responsive breakpoints, focus styles, and reduced-motion styles are in `styles.css`.

## GitHub Pages deployment

This is a static site with relative CSS, JavaScript, and favicon paths, so it works both at a user root and in a repository subpath.

1. Push the site files to the intended GitHub repository’s `main` branch.
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and the repository root (`/`), then save.
4. Wait for GitHub Pages to finish its deployment and open the published URL shown in Settings → Pages. Confirm the map, styles, favicon, and project links load there.

This profile repository can also serve the portfolio as its repository Pages site; the user profile page remains a separate GitHub surface with this Markdown README linking to the site.
