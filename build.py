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
head_end = body.index('<div class="shell">')
out = ('<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
       + body[:head_end] + '</head>\n<body>\n' + body[head_end:] + '\n</body>\n</html>\n')
dest = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else root/'dist'/'historia-de-espana.html')
dest.parent.mkdir(parents=True, exist_ok=True)
dest.write_text(out)
print(dest, len(out)//1024, 'KB')
