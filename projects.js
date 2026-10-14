/* ============================================================
   Afnan — project data for case-study pages
   Add or edit entries here; case-study.html renders them.
   ============================================================ */
window.PROJECTS = [
  {
    slug: "neon-dreams",
    title: "Neon Dreams — AI Short Film",
    cat: "video",
    catLabel: "AI Video",
    year: "2025",
    client: "Self-initiated",
    role: "Director · AI Pipeline",
    services: ["Text-to-video", "Motion grading", "Sound design"],
    cover: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&h=1000&q=80",
    tagline: "A four-minute sci-fi short generated end-to-end with diffusion video models and a hand-tuned grade.",
    intro: "Neon Dreams explores a rain-slicked future city through the eyes of an AI wanderer. Every shot was generated, upscaled and graded in a single reproducible pipeline.",
    challenge: "Generative video rarely holds a consistent character or palette across shots. The brief was to prove a model-driven film could feel coherent — and cinematic — rather than a collage of disconnected clips.",
    process: "I locked a colour script and a character reference set first, then generated 340 candidate shots, culled to 42, and rebuilt continuity through reference-guided prompting and a shared grade. Sound was composed to the cut in three passes.",
    solution: "A repeatable pipeline: reference sheets → shot generation → temporal upscale → unified grade → edit. Each stage was scripted so the film could be re-rendered as models improved.",
    impact: [
      { k: "Shots generated", v: "340" },
      { k: "Final runtime", v: "4:12" },
      { k: "Render cost", v: "-38%" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&h=800&q=80"
    ]
  },
  {
    slug: "hyperreal-portrait",
    title: "Hyperreal Portrait Series",
    cat: "image",
    catLabel: "AI Image",
    year: "2025",
    client: "Studio Atlas",
    role: "Art direction · Model fine-tune",
    services: ["LoRA fine-tune", "Retouch", "Print prep"],
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1600&h=1000&q=80",
    tagline: "A 24-piece portrait collection with photoreal skin, studio lighting and consistent identity.",
    intro: "A commercial portrait series where the subject never sat for a single frame — built to be indistinguishable from studio photography.",
    challenge: "Clients needed campaign imagery with a consistent face, realistic skin texture and controlled lighting, without the cost of a full studio shoot.",
    process: "I fine-tuned a diffusion model on a curated lighting set, built prompt templates per look, then hand-retouched every final frame for skin micro-detail and catchlights.",
    solution: "A locked look-library plus a lightweight fine-tune gave the studio a reusable asset generator that stayed on-brand across 24 finals.",
    impact: [
      { k: "Final frames", v: "24" },
      { k: "Shoot days saved", v: "6" },
      { k: "Reuse across ads", v: "9" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&h=800&q=80"
    ]
  },
  {
    slug: "lumen",
    title: "Lumen — AI SaaS Platform",
    cat: "web",
    catLabel: "Website",
    year: "2025",
    client: "Lumen AI",
    role: "Design · Front-end · AI integration",
    services: ["Marketing site", "Design system", "LLM features"],
    cover: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1600&h=1000&q=80",
    tagline: "A conversion-focused marketing site and dashboard shell for an AI analytics startup.",
    intro: "Lumen needed to look like the category leader on day one. I built a fast, animated site plus a modular design system the team could extend.",
    challenge: "The product was pre-launch, the story was complex, and the site had to load instantly on mobile while showing off live AI features.",
    process: "We ran a positioning workshop, sketched the narrative, then built a component system in React. A streaming demo widget pulls live model output to prove the product, not just describe it.",
    solution: "A static-first site with a live demo island — instant first paint, with the AI experience mounted only when it scrolls into view.",
    impact: [
      { k: "Lighthouse", v: "99" },
      { k: "Signup lift", v: "+41%" },
      { k: "LCP", v: "0.9s" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&h=800&q=80"
    ]
  },
  {
    slug: "orbit-runner",
    title: "Orbit Runner — WebGL Game",
    cat: "game",
    catLabel: "Game",
    year: "2024",
    client: "Orbit Studio",
    role: "Gameplay · WebGL · Audio",
    services: ["Three.js", "Game feel", "Procedural levels"],
    cover: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&h=1000&q=80",
    tagline: "A browser endless-runner with procedural tracks, juicy feedback and AI-driven difficulty.",
    intro: "Orbit Runner runs at 60fps in the browser, with procedurally generated tracks and an adaptive difficulty system that reads the player's skill in real time.",
    challenge: "Browser games struggle with performance and retention. The goal was console-grade game feel with zero install and instant play.",
    process: "I prototyped the core loop first, tuned input latency and particle feedback obsessively, then layered procedural levels and an adaptive curve driven by recent performance.",
    solution: "WebGL rendering with instanced geometry, object pooling and a single animation loop — plus a difficulty model that quietly matches the player.",
    impact: [
      { k: "Avg. session", v: "6:40" },
      { k: "Frame rate", v: "60fps" },
      { k: "D1 retention", v: "+27%" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=1200&h=800&q=80"
    ]
  },
  {
    slug: "skyline",
    title: "Skyline — Generative Drone Film",
    cat: "video",
    catLabel: "AI Video",
    year: "2025",
    client: "Meridian Realty",
    role: "AI Cinematography",
    services: ["Image-to-video", "Upscale", "Grade"],
    cover: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&h=1000&q=80",
    tagline: "A soaring aerial brand film for a skyline development — flown entirely in the model.",
    intro: "Meridian needed cinematic aerials of a building that didn't exist yet. Instead of blocking a physical drone shoot, we generated the flight path in the model.",
    challenge: "Real drone work was impossible pre-construction, and CGI fly-throughs read as cold. The film had to feel warm, real and human.",
    process: "I matched golden-hour references, generated passes of the planned skyline, then choreographed camera moves to a scored edit and graded for filmic contrast.",
    solution: "Image-to-video with reference grading and careful motion prompting produced believable aerials the sales team could use immediately.",
    impact: [
      { k: "Accepted shots", v: "18/20" },
      { k: "Cost vs. CGI", v: "-61%" },
      { k: "Lead enquiries", v: "+2.3×" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&h=800&q=80"
    ]
  },
  {
    slug: "dreamscapes",
    title: "Dreamscapes — Generative Art",
    cat: "image",
    catLabel: "AI Image",
    year: "2025",
    client: "Gallery Nescio",
    role: "Artist · Curator",
    services: ["Generative series", "Print", "Install"],
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&h=1000&q=80",
    tagline: "A 40-print exhibition of surreal landscapes, printed large-format for a solo show.",
    intro: "Dreamscapes is a numbered series of impossible terrains — generated, remastered, and hand-selected into a coherent gallery narrative.",
    challenge: "Generative art often overwhelms viewers. The exhibition needed editing discipline — fewer, stronger images with a clear arc.",
    process: "I generated thousands of frames, cut hard to 40, then upscaled and colour-matched the whole series for print so the wall read as one body of work.",
    solution: "A curatorial pipeline: generate broadly, select ruthlessly, unify tonally, then print on archival stock with a limited edition.",
    impact: [
      { k: "Prints", v: "40" },
      { k: "Edition sold", v: "72%" },
      { k: "Show length", v: "3 wks" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&h=800&q=80"
    ]
  },
  {
    slug: "atlas",
    title: "Atlas — E-commerce Experience",
    cat: "web",
    catLabel: "Website",
    year: "2024",
    client: "Atlas Goods",
    role: "Design · Build",
    services: ["Storefront", "Motion", "Checkout"],
    cover: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&h=1000&q=80",
    tagline: "An editorial storefront that treats products like stories and checkout like a breeze.",
    intro: "Atlas sells considered goods. The site pairs magazine-grade layouts with a frictionless, fast checkout.",
    challenge: "The old store looked generic and bled conversions at checkout. It needed editorial character without sacrificing speed or clarity.",
    process: "I rebuilt the product template around narrative, added restrained motion, and stripped the checkout to the fewest possible steps with instant feedback.",
    solution: "A component-driven storefront with lazy media, skeleton loading and a single-page checkout — beautiful without being heavy.",
    impact: [
      { k: "Conversion", v: "+34%" },
      { k: "Bounce", v: "-22%" },
      { k: "Load", v: "1.1s" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=1200&h=800&q=80"
    ]
  },
  {
    slug: "mindgrid",
    title: "MindGrid — AI Puzzle Game",
    cat: "game",
    catLabel: "Game",
    year: "2024",
    client: "Self-initiated",
    role: "Design · Code · AI",
    services: ["Puzzle systems", "AI hints", "Level design"],
    cover: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1600&h=1000&q=80",
    tagline: "A daily logic puzzle where the assistant learns your thinking and nudges, never spoils.",
    intro: "MindGrid is a compact daily puzzle with an AI assistant that gives graduated hints — reading where you're stuck and offering the smallest possible push.",
    challenge: "Hints usually ruin puzzles. The design goal was an assistant that helps without solving — adapting to each player's blind spots.",
    process: "I modelled player state as a simple grid of progress signals, then tuned a hint policy that escalates only when progress stalls. Levels are generated then hand-curated.",
    solution: "A lightweight on-device hint model plus a procedurally generated daily set — no accounts, no spoilers, just flow.",
    impact: [
      { k: "Daily players", v: "12k" },
      { k: "Avg. streak", v: "9 days" },
      { k: "Hint spoilers", v: "0" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=1200&h=800&q=80"
    ]
  },
  {
    slug: "pulse",
    title: "Pulse — AI Music Visual",
    cat: "video",
    catLabel: "AI Video",
    year: "2024",
    client: "Independent artist",
    role: "Visual direction · Audio-reactive",
    services: ["Audio-reactive", "Generative loops", "Edit"],
    cover: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&h=1000&q=80",
    tagline: "An audio-reactive visual built to pulse in time with the track, generated in loops.",
    intro: "Pulse turns a single into a living visual — generative loops driven by the song's frequency bands and cut to the beat.",
    challenge: "Music videos are expensive and static. The artist wanted a visual that could regenerate for every drop and remix.",
    process: "I mapped the track's bands to generation parameters, produced seamless loops, then edited the strongest moments to the beat grid.",
    solution: "A parameter-driven generation system: swap the audio, get a new visual that still feels authored.",
    impact: [
      { k: "Loops rendered", v: "60" },
      { k: "Avg. watch", v: "82%" },
      { k: "Shares", v: "3.1k" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1200&h=800&q=80"
    ]
  }
];
