export const GITHUB_PROFILE = "https://github.com/Danial-EBR2002";

export const PANELS = Object.freeze({
  "player-profile": { title: "Player Profile", sectionId: "player-profile", file: "FILE 00 / IDENTITY" },
  "command-center": { title: "Command Center", sectionId: "command-center", file: "FILE 01 / LEADERSHIP" },
  "tech-inventory": { title: "Tech Inventory", sectionId: "tech-inventory", file: "FILE 02 / SKILLS" },
  "server-room": { title: "Server Room", sectionId: "server-room", file: "FILE 03 / SYSTEMS" },
  "research-lab": { title: "Research Lab", sectionId: "research-lab", file: "FILE 04 / RESEARCH" },
  "quest-log": { title: "Quest Log", sectionId: "quest-log", file: "FILE 05 / PUBLIC REPOSITORIES" },
  "communication-terminal": { title: "Communication Terminal", sectionId: "communication-terminal", file: "FILE 06 / CONTACT" },
});

// Public repository metadata and short descriptions were checked against the
// GitHub account and each repository's public README. No API call is needed
// when a visitor loads the static site.
export const PROJECTS = Object.freeze([
  Object.freeze({
    title: "Error Graph",
    repository: "Error-Graph",
    url: "https://github.com/Danial-EBR2002/Error-Graph",
    description: "An open-source, graph-first debugging platform that reconstructs how failures propagate across browser requests, APIs, services, and database errors. Its README describes browser and Node instrumentation, trace-context propagation, event correlation, PostgreSQL storage, and an interactive incident graph.",
    technologies: ["TypeScript", "PostgreSQL", "W3C Trace Context", "React Flow"],
  }),
  Object.freeze({
    title: "Spooky Author Attribution",
    repository: "Spooky-Author-Attribution",
    url: "https://github.com/Danial-EBR2002/Spooky-Author-Attribution",
    description: "A BERT-based NLP project for classifying text excerpts by H. P. Lovecraft, Edgar Allan Poe, or Mary Shelley, using the Spooky Author dataset supplemented with public literary texts.",
    technologies: ["Python", "PyTorch", "BERT", "NLP"],
  }),
  Object.freeze({
    title: "N-Queens Visualizer",
    repository: "n-queen",
    url: "https://github.com/Danial-EBR2002/n-queen",
    description: "A Pygame visualizer for the N-Queens problem with an exact backtracking solver and a genetic-algorithm approach, plus an adjustable board size.",
    technologies: ["Python", "Pygame", "Backtracking", "Genetic algorithm"],
  }),
  Object.freeze({
    title: "BattleGrid · Tank Battle",
    repository: "Tank-battle",
    url: "https://github.com/Danial-EBR2002/Tank-battle",
    description: "A turn-based Pygame tank duel on a 15 × 15 grid, with AI-controlled tanks, obstacles, power-ups, and a shrinking safe zone.",
    technologies: ["Python", "Pygame", "Game AI"],
  }),
]);
