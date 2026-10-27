"""Gera os SVGs e o README.md a partir de theme.json, content.json e content/*.md.

Uso (na raiz do repositório):  python docs/assets/build.py
Requer: Pillow (com suporte a WebP).
"""
import base64
import io
import json
import textwrap
from pathlib import Path
from xml.sax.saxutils import escape

from PIL import Image

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
T = json.loads((HERE / "theme.json").read_text(encoding="utf-8"))
C = json.loads((HERE / "content.json").read_text(encoding="utf-8"))

SANS, MONO = T["fontSans"], T["fontMono"]
DOTS = ["#ff8a7a", "#f5d36a", T["accent"]]
MAX_KB = 200


def esc(s):
    return escape(s, {'"': "&quot;"})


def svg(w, h, title, body, defs="", style=""):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" '
        f'role="img" aria-label="{esc(title)}">\n<title>{esc(title)}</title>\n'
        f"<defs>{defs}"
        f'<linearGradient id="g" x1="0" y1="0" x2="1" y2="0">'
        f'<stop offset="0" stop-color="{T["accent"]}"/><stop offset="1" stop-color="{T["accent2"]}"/></linearGradient>'
        f"{style and '<style>' + style + '</style>'}</defs>\n{body}\n</svg>\n"
    )


def radial(id_, color, op):
    return (
        f'<radialGradient id="{id_}"><stop offset="0" stop-color="{color}" stop-opacity="{op}"/>'
        f'<stop offset="1" stop-color="{color}" stop-opacity="0"/></radialGradient>'
    )


def save(name, content):
    (HERE / name).write_text(content, encoding="utf-8")


def data_uri(img, max_w):
    img = img.convert("RGB")
    if img.width > max_w:
        img = img.resize((max_w, round(img.height * max_w / img.width)), Image.LANCZOS)
    for q in range(80, 30, -5):
        buf = io.BytesIO()
        img.save(buf, "WEBP", quality=q, method=6)
        if len(buf.getvalue()) <= MAX_KB * 1024:
            break
    else:
        raise SystemExit("imagem acima de 200 KB")
    return "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode(), img.size


def dots(x, y):
    return "".join(f'<circle cx="{x + 16 + i * 14}" cy="{y + 14}" r="4" fill="{c}"/>' for i, c in enumerate(DOTS))


def chip_w(label):
    return 0.6 * 13 * len(label) + 38


# ---------------------------------------------------------------- banner
def banner():
    W, H = 1200, 470
    img = Image.open(ROOT / "docs/screenshots/painel-dark.png")
    crop = img.crop((0, 0, img.width, round(img.width * 290 / 366)))
    uri, _ = data_uri(crop, 732)
    repo_txt = f"github.com/diegonatalo/{C['repo']}".upper()
    pill_w = 34 + len(repo_txt) * (13 * 0.6 + 1.8) + 18
    chips, x = "", 72
    for i, lab in enumerate(C["banner_chips"]):
        w = chip_w(lab)
        col = T["accent"] if i % 2 == 0 else T["accent2"]
        chips += (
            f'<rect x="{x}" y="362" width="{w:.1f}" height="32" rx="16" fill="{T["bg"]}" stroke="{T["borderStrong"]}"/>'
            f'<circle cx="{x + 17}" cy="378" r="3.5" fill="{col}"/>'
            f'<text x="{x + 28}" y="383" font-family="{MONO}" font-size="13" fill="{T["fg"]}">{esc(lab)}</text>'
        )
        x += w + 10
    tag = "".join(
        f'<text x="72" y="{296 + 28 * i}" font-family="{SANS}" font-size="20" fill="{T["muted"]}">{esc(l)}</text>'
        for i, l in enumerate(textwrap.wrap(C["tagline"], 52)[:2])
    )
    anim = T["animations"]
    style = (
        "@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}"
        "@keyframes d1{0%,100%{transform:translate(0,0)}50%{transform:translate(28px,18px)}}"
        "@keyframes d2{0%,100%{transform:translate(0,0)}50%{transform:translate(-30px,-16px)}}"
        ".dot{animation:pulse 2.4s ease-in-out infinite}.b1{animation:d1 14s ease-in-out infinite}"
        ".b2{animation:d2 16s ease-in-out infinite}"
    ) if anim else ""
    glow = ""
    if T["glow"] and T["grid"]:
        glow = (
            f'<g class="b1"><circle cx="170" cy="40" r="330" fill="url(#ga)"/></g>'
            f'<g class="b2"><circle cx="1040" cy="420" r="380" fill="url(#gb)"/></g>'
        )
    grid = (
        f'<rect width="{W}" height="{H}" fill="url(#grid)"/>' if T["grid"] else ""
    )
    defs = (
        radial("ga", T["accent"], 0.26)
        + radial("gb", T["accent2"], 0.26)
        + f'<pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">'
        f'<path d="M44 0H0V44" fill="none" stroke="{T["fg"]}" stroke-opacity="0.045"/></pattern>'
        f'<clipPath id="cb"><rect width="{W}" height="{H}" rx="26"/></clipPath>'
        f'<clipPath id="cf"><rect x="770" y="58" width="366" height="318" rx="20"/></clipPath>'
    )
    body = (
        f'<g clip-path="url(#cb)"><rect width="{W}" height="{H}" fill="{T["bg"]}"/>{grid}{glow}'
        f'<rect x="72" y="62" width="{pill_w:.1f}" height="36" rx="18" fill="{T["card"]}" stroke="{T["borderStrong"]}"/>'
        f'<circle class="dot" cx="92" cy="80" r="4" fill="{T["accent"]}"/>'
        f'<text x="106" y="85" font-family="{MONO}" font-size="13" letter-spacing="1.8" fill="{T["muted"]}">{esc(repo_txt)}</text>'
        f'<text x="72" y="196" font-family="{SANS}" font-size="98" font-weight="800" letter-spacing="-3" fill="{T["fg"]}">{esc(C["name"])}</text>'
        f"{tag}{chips}"
        f'<rect x="770" y="58" width="366" height="318" rx="20" fill="{T["card"]}"/>'
        f'<g clip-path="url(#cf)"><rect x="770" y="58" width="366" height="28" fill="{T["card"]}"/>'
        f'<image x="770" y="86" width="366" height="290" preserveAspectRatio="xMidYMin slice" href="{uri}"/></g>'
        f'<line x1="770" x2="1136" y1="86" y2="86" stroke="{T["borderStrong"]}"/>'
        f"{dots(770, 58)}"
        f'<text x="840" y="76" font-family="{MONO}" font-size="12" fill="{T["subtle"]}">{esc(C["banner_window_title"])}</text>'
        f'<rect x="770" y="58" width="366" height="318" rx="20" fill="none" stroke="{T["borderStrong"]}"/>'
        f"</g>"
        f'<rect x=".5" y=".5" width="{W - 1}" height="{H - 1}" rx="26" fill="none" stroke="{T["borderStrong"]}"/>'
    )
    save("banner.svg", svg(W, H, f"{C['name']}: {C['tagline']}", body, defs, style))


# ---------------------------------------------------------------- botões
def button(name, label, primary):
    text = f"{label} ↗"
    w = round(len(text) * 9.6 + 64)
    if primary:
        rect = f'<rect width="{w}" height="52" rx="26" fill="url(#g)"/>'
        col = T["onAccent"]
    else:
        rect = (
            f'<rect x=".75" y=".75" width="{w - 1.5}" height="50.5" rx="25.25" fill="{T["card"]}" '
            f'stroke="{T["borderStrong"]}" stroke-width="1.5"/>'
        )
        col = T["fg"]
    body = (
        f"{rect}<text x=\"{w / 2}\" y=\"32\" text-anchor=\"middle\" font-family=\"{SANS}\" font-size=\"16\" "
        f'font-weight="700" fill="{col}">{esc(text)}</text>'
    )
    save(name, svg(w, 52, text, body))


# ---------------------------------------------------------------- seções
def header(key, n):
    s = C["sections"][key]
    label = f"{n:02d} · {s['label']}"
    pw = len(label) * 9.4 + 34
    defs = radial("ga", T["accent"], 0.18) + radial("gb", T["accent2"], 0.18) + '<clipPath id="c"><rect width="1000" height="124" rx="22"/></clipPath>'
    body = (
        f'<g clip-path="url(#c)"><rect width="1000" height="124" fill="{T["card"]}"/>'
        f'<circle cx="960" cy="0" r="220" fill="url(#gb)"/><circle cx="0" cy="124" r="220" fill="url(#ga)"/></g>'
        f'<rect x=".5" y=".5" width="999" height="123" rx="21.5" fill="none" stroke="{T["borderStrong"]}"/>'
        f'<rect x="40" y="26" width="{pw:.1f}" height="28" rx="14" fill="{T["accent"]}" fill-opacity="0.10" '
        f'stroke="{T["accent"]}" stroke-opacity="0.38"/>'
        f'<text x="{40 + 17}" y="45" font-family="{MONO}" font-size="12" letter-spacing="1.6" fill="{T["accent"]}">{esc(label)}</text>'
        f'<text x="40" y="94" font-family="{SANS}" font-size="36" font-weight="800" letter-spacing="-0.8" fill="{T["fg"]}">{esc(s["title"])}</text>'
        f'<rect x="40" y="106" width="64" height="3" rx="1.5" fill="url(#g)"/>'
    )
    name = f"h-{key}.svg"
    save(name, svg(1000, 124, f"{label}: {s['title']}", body, defs))
    return name, f"{label}: {s['title']}"


def feature_card(i, title, desc):
    lines = textwrap.wrap(desc, 54)[:5]
    txt = "".join(
        f'<text x="32" y="{116 + 22 * j}" font-family="{SANS}" font-size="14.5" fill="{T["muted"]}">{esc(l)}</text>'
        for j, l in enumerate(lines)
    )
    defs = radial("ga", T["accent"], 0.2) + '<clipPath id="c"><rect width="490" height="290" rx="22"/></clipPath>'
    body = (
        f'<g clip-path="url(#c)"><rect width="490" height="290" fill="{T["card"]}"/>'
        f'<circle cx="490" cy="0" r="200" fill="url(#ga)"/><rect width="490" height="4" fill="url(#g)"/></g>'
        f'<rect x=".5" y=".5" width="489" height="289" rx="21.5" fill="none" stroke="{T["borderStrong"]}"/>'
        f'<text x="32" y="44" font-family="{MONO}" font-size="12" letter-spacing="1.2" fill="{T["subtle"]}">FUNCIONALIDADE {i:02d}</text>'
        f'<text x="32" y="82" font-family="{SANS}" font-size="28" font-weight="700" fill="{T["fg"]}">{esc(title)}</text>'
        f"{txt}"
    )
    name = f"f-{i:02d}.svg"
    save(name, svg(490, 290, f"{title}: {desc}", body, defs))
    return name, f"{title}: {desc}"


def stack_card():
    x, y, rows = 26, 26, 0
    out = ""
    for i, lab in enumerate(C["stack"]):
        w = chip_w(lab)
        if x + w > 1000 - 26:
            x, y = 26, y + 40
        col = T["accent"] if i % 2 == 0 else T["accent2"]
        out += (
            f'<rect x="{x}" y="{y}" width="{w:.1f}" height="32" rx="16" fill="{T["bg"]}" stroke="{T["borderStrong"]}"/>'
            f'<circle cx="{x + 17}" cy="{y + 16}" r="3.5" fill="{col}"/>'
            f'<text x="{x + 28}" y="{y + 21}" font-family="{MONO}" font-size="13" fill="{T["fg"]}">{esc(lab)}</text>'
        )
        x += w + 10
    h = y + 32 + 26
    body = (
        f'<rect x=".5" y=".5" width="999" height="{h - 1}" rx="19.5" fill="{T["card"]}" stroke="{T["borderStrong"]}"/>{out}'
    )
    alt = "Stack: " + ", ".join(C["stack"])
    save("stack.svg", svg(1000, h, alt, body))
    return "stack.svg", alt


def frame(name, alt, inner, w, content_h):
    """Moldura de janela de 1000 de largura. inner(y0) devolve o conteúdo a partir de y0."""
    h = 28 + content_h
    defs = radial("gl", T["accent"], 0.16) + f'<clipPath id="c"><rect width="{w}" height="{h}" rx="16"/></clipPath>'
    body = (
        f'<ellipse cx="{w / 2}" cy="{h}" rx="{w * 0.4}" ry="14" fill="url(#gl)"/>'
        f'<g clip-path="url(#c)"><rect width="{w}" height="{h}" fill="{T["card"]}"/>{inner(28)}'
        f'<rect width="{w}" height="28" fill="{T["card"]}"/>'
        f'<line x1="0" x2="{w}" y1="28" y2="28" stroke="{T["borderStrong"]}"/>{dots(0, 0)}</g>'
        f'<rect x=".5" y=".5" width="{w - 1}" height="{h - 1}" rx="15.5" fill="none" stroke="{T["borderStrong"]}"/>'
    )
    save(name, svg(w, h, alt, body, defs))


def shot(s):
    img = Image.open(ROOT / s["src"])
    uri, (w, h) = data_uri(img, 1280)
    ch = round(1000 * h / w)
    frame(
        f"shot-{s['id']}.svg", s["alt"],
        lambda y: f'<image x="0" y="{y}" width="1000" height="{ch}" href="{uri}"/>', 1000, ch,
    )


def shot_mobile(m):
    pw, pad = 380, 28
    ims = []
    for p in m["srcs"]:
        im = Image.open(ROOT / p)
        uri, (w, h) = data_uri(im, 780)
        ims.append((uri, round(pw * h / w)))
    ch = max(h for _, h in ims) + pad * 2
    gap = 1000 - pad * 2 - pw * 2
    def inner(y0):
        out = ""
        for i, (uri, h) in enumerate(ims):
            x = pad + i * (pw + gap)
            out += f'<clipPath id="m{i}"><rect x="{x}" y="{y0 + pad}" width="{pw}" height="{h}" rx="10"/></clipPath>'
            out += f'<image x="{x}" y="{y0 + pad}" width="{pw}" height="{h}" clip-path="url(#m{i})" href="{uri}"/>'
        return out

    frame("shot-mobile.svg", m["alt"], inner, 1000, ch)


def footer():
    body = (
        f'<line x1="0" x2="1000" y1="14" y2="14" stroke="url(#g)" stroke-width="2" stroke-opacity="0.7"/>'
        f'<text x="500" y="52" text-anchor="middle" font-family="{MONO}" font-size="12.5" fill="{T["subtle"]}">'
        f'© {C["year"]} {esc(C["author"].upper())}</text>'
    )
    save("footer.svg", svg(1000, 90, f"© {C['year']} {C['author']}", body))


# ---------------------------------------------------------------- README
def img(name, alt, width="100%", extra=""):
    return f'<img src="docs/assets/{name}" alt="{esc(alt)}" width="{width}"{extra} />'


def md(name):
    return (HERE / "content" / f"{name}.md").read_text(encoding="utf-8").rstrip() + "\n"


def center(*lines):
    return "<div align=\"center\">\n\n" + "\n\n".join(lines) + "\n\n</div>\n"


def readme():
    n = 0
    out = []

    def sec(key):
        nonlocal n
        n += 1
        name, alt = header(key, n)
        out.append(center(img(name, alt)))

    # banner + botões
    button("btn-demo.svg", "Demonstração", True)
    button("btn-code.svg", "Código", False)
    banner()
    btns = (
        f'<a href="{C["demo_url"]}"><img src="docs/assets/btn-demo.svg" alt="Demonstração ↗" height="46" /></a>\n'
        f'<a href="{C["code_url"]}"><img src="docs/assets/btn-code.svg" alt="Código ↗" height="46" /></a>'
    )
    out.append(center(
        img("banner.svg", f"{C['name']}: {C['tagline']}"), btns, "\n".join(C["badges"]),
    ))

    sec("sobre")
    out.append(md("sobre"))

    sec("demo")
    for s in C["shots"]:
        shot(s)
    shot_mobile(C["mobile"])
    shots = {s["id"]: s for s in C["shots"]}
    pic = (
        '<picture>\n'
        '  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/shot-painel-dark.svg" />\n'
        f'  {img("shot-painel-light.svg", shots["painel-light"]["alt"])}\n'
        "</picture>"
    )

    def cap(s):
        return f'<sub>{s["caption"]}</sub>'

    out.append(center(
        pic, f'<sub>{C["demo_caption"]}</sub>',
        img("shot-carteira.svg", shots["carteira"]["alt"]) + "\n<br />\n" + cap(shots["carteira"]),
        img("shot-proventos.svg", shots["proventos"]["alt"]) + "\n<br />\n" + cap(shots["proventos"]),
        img("shot-calculadoras.svg", shots["calculadoras"]["alt"]) + "\n<br />\n" + cap(shots["calculadoras"]),
        img("shot-mobile.svg", C["mobile"]["alt"]) + "\n<br />\n" + f'<sub>{C["mobile"]["caption"]}</sub>',
    ))

    sec("func")
    cards = [feature_card(i + 1, t, d) for i, (t, d) in enumerate(C["features"])]
    rows = []
    for i in range(0, len(cards), 2):
        rows.append(" ".join(img(nm, al, "49%") for nm, al in cards[i:i + 2]))
    out.append(center("\n<br />\n".join(rows)))

    sec("stack")
    nm, al = stack_card()
    out.append(center(img(nm, al)))

    sec("rodar")
    out.append(md("rodar"))
    sec("estrutura")
    out.append(md("estrutura"))
    sec("mais")
    out.append(md("mais"))

    sec("autor")
    abtns = []
    for a in C["authors"]:
        button(f"btn-{a['id']}.svg", a["label"], False)
        abtns.append(f'<a href="{a["url"]}"><img src="docs/assets/btn-{a["id"]}.svg" alt="{a["label"]} ↗" height="46" /></a>')
    out.append(center("\n".join(abtns)))

    footer()
    out.append(center(img("footer.svg", f"© {C['year']} {C['author']}"), f'<sub>{C["footer_line"]}</sub>'))
    (ROOT / "README.md").write_text("\n".join(out), encoding="utf-8")


if __name__ == "__main__":
    readme()
    print("ok")
