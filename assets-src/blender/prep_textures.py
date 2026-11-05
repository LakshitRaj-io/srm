"""Turns official SRMIST photographs into rectified, evenly lit elevations for the Blender models.
Run with system Python (numpy + Pillow):  python prep_textures.py <references dir> <output dir>
References: ub.jpg, tp_zone.jpg, tp_side.png, tp2_cover.jpg (sources are listed in README.md here).
"""
import sys, os
import numpy as np
from PIL import Image, ImageFilter, ImageDraw

REF, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)


def rectify(im, quad, size):
    """Map the source quad (TL, TR, BR, BL) onto a size=(w, h) rectangle."""
    w, h = size
    dst = [(0, 0), (w, 0), (w, h), (0, h)]
    A, b = [], []
    for (x, y), (X, Y) in zip(quad, dst):
        A.append([X, Y, 1, 0, 0, 0, -x * X, -x * Y]); b.append(x)
        A.append([0, 0, 0, X, Y, 1, -y * X, -y * Y]); b.append(y)
    c = np.linalg.solve(np.array(A, float), np.array(b, float))
    return im.transform(size, Image.PERSPECTIVE, tuple(c), Image.BICUBIC)


def even_light(im, keep_mask, sigma, target=None):
    """Remove sun flare and uneven exposure, using only pixels where keep_mask is set."""
    a = np.asarray(im.convert("RGB"), np.float32)
    lum = a.mean(2)
    m = np.asarray(keep_mask, np.float32) / 255
    small = (max(1, im.width // 4), max(1, im.height // 4))
    def blur(x):
        lo, hi = float(x.min()), float(x.max()) or 1.0
        g = Image.fromarray(((x - lo) / (hi - lo + 1e-6) * 255).astype(np.uint8)).resize(small, Image.BILINEAR).filter(ImageFilter.GaussianBlur(sigma / 4)).resize(im.size, Image.BICUBIC)
        return np.asarray(g, np.float32) / 255 * (hi - lo) + lo
    field = blur(lum * m) / np.maximum(blur(m), 1e-3)
    t = target or float(np.median(lum[m > 0.5]))
    out = np.clip(a * (t / np.maximum(field, 20))[..., None], 0, 255)
    return Image.fromarray(out.astype(np.uint8))


# ---------- University Building: front photo, 1536-px reference grid ----------
ub = Image.open(f"{REF}/ub.jpg").convert("RGB")
K = ub.width / 1536
X0, X1, Y0, Y1 = 342, 1208, 122, 790  # facade above the plinth, clear of the palms
box = tuple(round(v * K) for v in (X0, Y0, X1, Y1))
crop = ub.crop(box)
SC = 2.2  # upscale to a texture size
front = crop.resize((round(crop.width * SC), round(crop.height * SC)), Image.LANCZOS)
COLS = [445, 507, 568, 630, 692, 891, 978, 1062, 1134]
ROWS = [(172, 342), (384, 553), (597, 768)]
px = lambda x, y: ((x - X0) * K * SC, (y - Y0) * K * SC)
mask = Image.new("L", front.size, 255)
d = ImageDraw.Draw(mask)
for c in COLS:
    for t, b in ROWS:
        d.rectangle([*px(c - 24, t - 4), *px(c + 24, b + 12)], fill=0)
for cx, cy, r in ((791, 464, 60), (793, 258, 72)):
    d.ellipse([*px(cx - r, cy - r), *px(cx + r, cy + r)], fill=0)
front = even_light(front, mask, 180)
front.save(f"{OUT}/ub_front.jpg", quality=90)

# Side wall: real window bays from the front, repeated at the real pitch.
fa = np.asarray(front)
sx = lambda x: round((x - X0) * K * SC)
bay = fa[:, sx(476):sx(538)]
margin = fa[:, sx(346):sx(400)]
side = np.concatenate([margin] + [bay] * 8 + [margin[:, ::-1]], axis=1)
Image.fromarray(side).save(f"{OUT}/ub_side.jpg", quality=88)
print("ub", front.size, Image.fromarray(side).size)

# ---------- Tech Park: frontal elevation from the official tour's drone panorama ----------
zone = Image.open(f"{REF}/tp_zone.jpg").convert("RGB")
TOP, BOT = 1205, 2408
quad = [(1140, TOP), (2432, TOP + 16), (2418, BOT), (1127, BOT)]
tp = rectify(zone, quad, (2048, 1908))
tp = tp.filter(ImageFilter.UnsharpMask(radius=2, percent=70, threshold=2))
tp.save(f"{OUT}/tp_front.jpg", quality=90)

# Long side wall, from the official elevated view. Trees hide the base, so its window rows repeat.
s = Image.open(f"{REF}/tp_side.png").convert("RGB")
quad = [(105, 303), (412, 305), (415, 905), (108, 852)]
side = rectify(s, quad, (1280, 1600))
a = np.asarray(side).copy()
h = a.shape[0]
row = round(h / 17)
clean_to = round(h * 0.74)
for y in range(clean_to, h):
    a[y] = a[clean_to - 2 * row + (y - clean_to) % (2 * row)]
side = even_light(Image.fromarray(a), Image.new("L", side.size, 255), 240, 196)
side.save(f"{OUT}/tp_side.jpg", quality=86)
print("tp", tp.size, side.size)

# ---------- Tech Park 2: official rendering on the DSBS newsletter cover ----------
c = Image.open(f"{REF}/tp2_cover.jpg").convert("RGB")
c = c.resize((c.width * 4, c.height * 4), Image.LANCZOS)
s4 = lambda q: [(x * 4, y * 4) for x, y in q]
end = rectify(c, s4([(47, 133), (288, 66), (292, 432), (62, 437)]), (1024, 1408))
end.filter(ImageFilter.UnsharpMask(radius=3, percent=60)).save(f"{OUT}/tp2_end.jpg", quality=86)
long_side = rectify(c, s4([(292, 66), (456, 150), (456, 548), (294, 548)]), (720, 1600))
long_side.filter(ImageFilter.UnsharpMask(radius=3, percent=60)).save(f"{OUT}/tp2_side.jpg", quality=86)
print("tp2 done")
