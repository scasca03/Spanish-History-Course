#!/usr/bin/env python3
"""Genera una versión autocontenida (un solo HTML) a partir de index.html, styles.css, app.js, viz.js y data/*.js."""
import re, pathlib, sys
root = pathlib.Path(__file__).resolve().parent.parent
idx = (root/'index.html').read_text()
def css(m): return '<style>\n' + (root/m.group(1)).read_text() + '\n</style>'
def js(m):
    p = root/m.group(1)
    return '<script>\n' + (p.read_text() if p.exists() else '/* falta ' + m.group(1) + ' */') + '\n</script>' if p.exists() else ''
body = re.sub(r'<link rel="stylesheet" href="(styles\.css)">', css, idx)
body = re.sub(r'<script src="([^"]+)"></script>', js, body)
out = body if body.lstrip().lower().startswith('<!doctype') else body
dest = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else root/'dist'/'historia-de-espana.html')
dest.parent.mkdir(parents=True, exist_ok=True)
dest.write_text(out)
print(dest, len(out)//1024, 'KB')
