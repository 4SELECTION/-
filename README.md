# Legal Document HTML Samples

This repository contains two self-contained HTML pages used for displaying a Japanese legal document. Both files include collapsible sections, tab-based navigation, and embedded images. They also display mathematical expressions via **MathJax**.

## Files

- **`original.html`** – The document in its original Japanese text.
- **`katakana.html`** – A phonetic version where the body text has been transliterated into Katakana.
- **`SECURITY.md`** – Security policy template.

## Viewing the Pages

Open either HTML file directly in a web browser. They reference MathJax through a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
```

An internet connection is required for MathJax (and for loading the remote images) to render correctly. If you need to view the pages offline, download the MathJax script and images and update the `src` attributes in the HTML files to point to your local copies.

`katakana.html` presents exactly the same content as `original.html` but written entirely in Katakana characters.

