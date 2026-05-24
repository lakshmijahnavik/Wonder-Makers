# Replica Project

Static frontend replica of wondermakers.digital header and hero for internship test.

Preview locally:

Using Python 3 built-in server:

```bash
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Or use any static file server / Live Server extension in VS Code. For a faster local preview, you can use `npx serve` or `npx live-server`:

```bash
npx serve . -l 8000
# or
npx live-server
```

Performance notes & recommendations:
- Compress and export images as modern formats (`.webp` or `.avif`) at multiple sizes and update `srcset` accordingly.
- Use `gzip`/`brotli` when hosting, and enable long cache headers for static assets.
- To reduce GPU cost, the Three.js scene is paused when offscreen; further gains come from replacing complex models with simple glTF or low-poly meshes.

