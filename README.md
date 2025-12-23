# Recipe Finder — Archive Search

This small GitHub Pages site searches the `datas.json` file in this repository and shows matches. For each match a button opens the Wayback snapshot at the fixed timestamp.

To publish on GitHub Pages:

1. Commit & push these files to your repository root.
2. On GitHub, enable Pages in repository Settings → Pages and set the source to the branch (e.g., `main`) and folder `/ (root)`.

To test locally (simple HTTP server):

```powershell
# from the repository root
python -m http.server 8000
# then open http://localhost:8000 in your browser
```
