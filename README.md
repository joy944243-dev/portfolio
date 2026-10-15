# Afnan — AI Web Developer Portfolio

A fast, animated, static portfolio website for **Afnan Rahman**, an AI web developer.
Built with plain HTML, CSS and JavaScript — no build step required.

## Live site

- joy944243-dev: https://joy944243-dev.github.io/portfolio/
- mishafsa637-art: https://mishafsa637-art.github.io/portfolio/

## Pages

| File | Description |
|------|-------------|
| `index.html` | Home page |
| `about.html` | About |
| `work.html` | Selected work |
| `services.html` | Services |
| `notes.html` | Notes / blog index |
| `post.html` | Single post |
| `case-study.html` | Project case study |
| `playground.html` | Interactive demos |
| `contact.html` | Contact |
| `resume.html` | Resume |
| `404.html` | Not-found page |

## Structure

```
.
├── index.html            # Home
├── about.html ...        # Other pages
├── styles.css            # All styling
├── script.js             # Main interactions (nav, counters, animations)
├── projects.js           # Project data + rendering
├── posts.js              # Blog/notes data
├── playground.js         # Playground demos
├── assets/               # Images and logo (afnan.svg, og.png)
├── sitemap.xml           # SEO sitemap
├── robots.txt            # Crawler rules
└── .nojekyll             # Tell GitHub Pages to skip Jekyll
```

## Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000

## Deploy / update

Content is served by GitHub Pages from the `main` branch.

```bash
git add .
git commit -m "Update site"
git push joy main      # joy944243-dev/portfolio
git push origin main   # mishafsa637-art/portfolio
```

## License

© Afnan Rahman. All rights reserved.
