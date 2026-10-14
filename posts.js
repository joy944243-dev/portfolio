/* ============================================================
   Afnan — writing / notes data
   Add or edit entries here; post.html renders them.
   ============================================================ */
window.POSTS = [
  {
    slug: "reproducible-ai-video-pipeline",
    title: "A reproducible AI video pipeline",
    tag: "AI Video",
    date: "March 2025",
    iso: "2025-03-06",
    read: 7,
    excerpt:
      "Generative video is easy to demo and hard to finish. Here is the pipeline I use to keep characters, colour and motion consistent from first prompt to final grade.",
    cover:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&h=900&q=80",
    body: `
      <p>Most AI video fails the same way: it looks incredible shot by shot and falls apart as a film. The face drifts, the grade shifts, the motion has no through-line. The technology is not the bottleneck — the process is.</p>
      <p>Over the last year I have rebuilt my workflow around one idea: every stage should be reproducible. If a model improves next month, I want to re-render the whole film without re-deciding anything. Here is how that works in practice.</p>

      <h2>Lock the look before you generate</h2>
      <p>Before a single shot is generated I define two artefacts: a colour script and a character reference sheet. The colour script is a handful of swatches per scene — the emotional palette. The reference sheet is three or four canonical angles of each character, generated once and reused everywhere.</p>
      <p>These are not creative niceties. They are constraints that make every later prompt shorter and more consistent, and they are the first thing a new contributor can read to understand the film.</p>

      <h2>Generate wide, cut hard</h2>
      <p>I generate far more than I need. On the last short that meant roughly 340 candidate shots for a four-minute runtime. The instinct is to protect the footage you paid for; the discipline is to cut it.</p>
      <ul>
        <li><strong>Reference-guided prompting</strong> keeps identity stable across angles.</li>
        <li><strong>One variable at a time</strong> — change motion or lighting, never both.</li>
        <li><strong>Name everything</strong> so a shot can be re-found and re-rendered months later.</li>
      </ul>
      <blockquote>The pipeline should be boring. The film should be the only surprising part.</blockquote>

      <h2>Temporal upscale, then one grade</h2>
      <p>Upscaling before grading matters. A shared grade across upscaled frames is what makes disconnected clips read as one film. I build a single look — contrast curve, halation, grain — and apply it to the whole cut, never per shot.</p>

      <h2>Script every stage</h2>
      <p>The final piece is treating each stage as a script rather than a session. Shot generation, upscaling, grading and edit are all parameterised, so when a better model ships I re-run the pipeline instead of redoing the art direction. That is the difference between a demo and a deliverable.</p>
    `
  },
  {
    slug: "fast-sites-with-ai-features",
    title: "Fast sites with AI features that don't tank performance",
    tag: "Web",
    date: "February 2025",
    iso: "2025-02-11",
    read: 6,
    excerpt:
      "Everyone wants AI on the marketing site. The trick is to make it a neighbour of your Core Web Vitals, not an enemy. A practical pattern for shipping clever features on a fast page.",
    cover:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1600&h=900&q=80",
    body: `
      <p>The fastest way to ruin a landing page is to bolt a live model onto it. You pay for it in layout shift, in a bundle nobody asked for, and in a first paint that arrives after the reader has already left.</p>
      <p>But AI features sell. So the goal is not to remove them — it is to make them lazy, self-contained, and invisible to the critical path.</p>

      <h2>Static first, intelligent second</h2>
      <p>The page should be fully useful before any script runs. Copy, layout, navigation and the headline claim are static HTML. The AI experience is an enhancement layered on top, never a dependency for meaning.</p>
      <p>In practice that means a server-rendered page and a single interactive island. If the island fails to load, the page loses nothing essential.</p>

      <h2>Mount on intent, not on load</h2>
      <ul>
        <li>Load heavy work only when the element scrolls into view.</li>
        <li>Stream model output token by token so the first useful character is instant.</li>
        <li>Reserve the exact space the widget will occupy, so nothing shifts when it arrives.</li>
      </ul>
      <blockquote>A demo widget should prove the product, not describe it — but only when the reader is already looking.</blockquote>

      <h2>Budget the bytes you ship</h2>
      <p>I treat AI features like any other asset: a hard budget, a fallback, and a measurement. If the interaction costs more than the value it adds to first paint, it moves behind a click.</p>
      <p>The result on a recent launch was a Lighthouse score in the high nineties with a live, streaming demo on the page. Not because the AI was cheap, but because it was late.</p>
    `
  },
  {
    slug: "webgl-game-feel",
    title: "WebGL game feel: the last 1% everyone skips",
    tag: "Games",
    date: "January 2025",
    iso: "2025-01-18",
    read: 5,
    excerpt:
      "Frame rate gets the credit, but feel is what players remember. Input latency, hit feedback and the quiet art of doing slightly too much for a single frame of feedback.",
    cover:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&h=900&q=80",
    body: `
      <p>You can ship a browser game at a locked sixty frames per second and it can still feel dead. Performance is the floor, not the feeling. The gap between fine and memorable is almost entirely feedback.</p>

      <h2>Input before pixels</h2>
      <p>The first thing I tune is not rendering, it is the distance between a key press and something happening. Latency hides everywhere: in the event handler, in a debounce, in waiting for the next animation frame to commit state.</p>
      <p>Read input as early as possible and apply it immediately. Rendering can lag a frame; intention cannot.</p>

      <h2>Over-communicate every hit</h2>
      <ul>
        <li>Screen shake, however small, sells impact more than any particle count.</li>
        <li>Freeze frames — a few milliseconds of pause — make collisions feel physical.</li>
        <li>Audio fires slightly early; the ear forgives less than the eye.</li>
      </ul>
      <blockquote>If a hit doesn't feel like it landed, the player will assume they missed.</blockquote>

      <h2>Difficulty that reads the room</h2>
      <p>The last piece is restraint. A good difficulty curve is an invisible hand: it nudges, it never announces. I model recent performance and adjust the rate of challenge just enough that the player stays in flow — winning, but never bored.</p>
      <p>None of this shows up in a frame-rate counter. All of it shows up in whether someone plays the next run.</p>
    `
  }
];
