# Portfolio: Jasser Chaabane

A static, single-page portfolio. No build step, no framework.

```
portfolio/
├── index.html          all content
├── css/style.css       layout, tokens, motion
├── css/hover.css       optional hover animations (delete its <link> line in index.html to switch them all off)
├── js/main.js          hero start, copy-email button, footer year
├── js/marquee.js       infinite logo strip
├── js/blur-reveal.js   word-by-word blur reveal for titles (add data-blur to a heading)
├── js/parallax.js      subtle parallax (add data-parallax="0.05" to an element; negative = moves ahead)
└── assets/
    ├── Jasser_Chaabane_CV.pdf
    ├── amr-demo.mp4, amr-poster.jpg
    ├── pick-place-demo.mp4, pick-place-poster.jpg
    ├── favicon.svg
    └── photo.jpg       (add this: square portrait, at least 240 x 240 px)
```

## Preview

Open `index.html` in a browser. The Satoshi font loads from Fontshare when online; offline it falls back to the system font.

## Add your photo

Save a square portrait as `assets/photo.jpg`. Until then the page shows your initials in the circle.

## Publish for free

**GitHub Pages:** create a repo named `chaabanejasser01.github.io`, upload the contents of this folder, then Settings, Pages, deploy from the `main` branch. The site is live at `https://chaabanejasser01.github.io`.

**Netlify:** drag this folder onto app.netlify.com/drop.

## Edit the content

- Text: `index.html`, one section per `<section>`.
- Colors, sizes, corner radius: the variables at the top of `css/style.css`.
- To add a project: copy one `<li class="row">` block in the projects section.
