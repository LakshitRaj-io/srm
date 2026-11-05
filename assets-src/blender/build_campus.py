"""Builds the three SRMIST building models. Run headless:
  blender -b -P build_campus.py -- <textures dir> <web output dir> <renders dir> <blend path>

Real geometry follows measurements taken from official photographs: window grids, string courses,
cornice, plinth arches, curtain-wall mullions, fins, inclined stair ribbons, canopies, roof cap.
The rectified photographs supply colour. World units are metres; the front of each model faces -Y.
Unknowns are estimates and are listed in README.md here: rear walls and every roof top.
"""
import math, os, sys
import bpy, bmesh
from mathutils import Vector

ARGS = sys.argv[sys.argv.index("--") + 1:]
TEX, WEB, RENDERS, BLEND = ARGS[:4]
ONLY_RENDER_PREVIEW = len(ARGS) > 4 and ARGS[4] == "preview"
os.makedirs(WEB, exist_ok=True)
os.makedirs(RENDERS, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene


# ---------- Materials ----------
def image(name):
    im = bpy.data.images.load(os.path.join(TEX, name), check_existing=True)
    return im


def mat(name, color=(1, 1, 1), rough=0.8, metal=0.0, tex=None):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if tex:
        t = m.node_tree.nodes.new("ShaderNodeTexImage")
        t.image = image(tex)
        t.extension = "EXTEND"
        m.node_tree.links.new(t.outputs["Color"], b.inputs["Base Color"])
    return m


def srgb(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple((x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4) for x in c)


# ---------- Geometry helpers ----------
def new_obj(name, verts, faces, m, col):
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    me.update()
    o = bpy.data.objects.new(name, me)
    col.objects.link(o)
    if m:
        me.materials.append(m)
    return o


def box(name, x0, x1, y0, y1, z0, z1, m, col):
    v = [(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0), (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)]
    f = [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]
    return new_obj(name, v, f, m, col)


def prism(name, pts, y0, y1, m, col, axis="y", at=0.0):
    """Extrude a 2D outline. axis y: pts are (x, z). axis x: pts are (y, z)."""
    n = len(pts)
    if axis == "y":
        v = [(a, y0, b) for a, b in pts] + [(a, y1, b) for a, b in pts]
    else:
        v = [(y0, a, b) for a, b in pts] + [(y1, a, b) for a, b in pts]
    f = [tuple(range(n - 1, -1, -1)), tuple(range(n, 2 * n))]
    f += [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
    o = new_obj(name, v, f, m, col)
    bm = bmesh.new()
    bm.from_mesh(o.data)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(o.data)
    bm.free()
    return o


def arch(cx, z0, z1, hw, seg=12):
    """Round-headed window outline."""
    p = [(cx - hw, z0), (cx + hw, z0)]
    zs = z1 - hw
    for i in range(seg + 1):
        a = math.pi * i / seg
        p.append((cx + hw * math.cos(a), zs + hw * math.sin(a)))
    return p


def ring(name, outer_pts, inner_pts, y0, y1, m, col, axis="y"):
    """Moulded frame between two outlines with the same point count."""
    n = len(outer_pts)
    verts, faces = [], []
    P = (lambda a, y, b: (a, y, b)) if axis == "y" else (lambda a, y, b: (y, a, b))
    for a, b in outer_pts: verts.append(P(a, y0, b))
    for a, b in inner_pts: verts.append(P(a, y0, b))
    for a, b in outer_pts: verts.append(P(a, y1, b))
    for a, b in inner_pts: verts.append(P(a, y1, b))
    for i in range(n):
        j = (i + 1) % n
        faces.append((i, j, n + j, n + i))
        faces.append((2 * n + i, 2 * n + j, 3 * n + j, 3 * n + i))
        faces.append((i, j, 2 * n + j, 2 * n + i))
        faces.append((n + i, n + j, 3 * n + j, 3 * n + i))
    o = new_obj(name, verts, faces, m, col)
    bm = bmesh.new()
    bm.from_mesh(o.data)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(o.data)
    bm.free()
    return o


def activate(o):
    bpy.context.view_layer.objects.active = o
    for s in bpy.context.selected_objects:
        s.select_set(False)
    o.select_set(True)


def join(objs, name):
    activate(objs[0])
    for o in objs[1:]:
        o.select_set(True)
    bpy.ops.object.join()
    objs[0].name = name
    return objs[0]


def cut(target, cutters):
    c = join(cutters, target.name + "_cut")
    md = target.modifiers.new("cut", "BOOLEAN")
    md.operation = "DIFFERENCE"
    md.solver = "EXACT"
    md.object = c
    activate(target)
    bpy.ops.object.modifier_apply(modifier=md.name)
    bpy.data.objects.remove(c, do_unlink=True)


def planar_uv(o, u_axis, u0, u1, v0, v1, v_axis=2, flip_u=False):
    """UVs straight from position, so geometry and elevation stay registered."""
    me = o.data
    uv = me.uv_layers.get("UVMap") or me.uv_layers.new(name="UVMap")
    for poly in me.polygons:
        for li in poly.loop_indices:
            p = me.vertices[me.loops[li].vertex_index].co
            u = (p[u_axis] - u0) / (u1 - u0)
            uv.data[li].uv = ((1 - u) if flip_u else u, (p[v_axis] - v0) / (v1 - v0))


def reveal_to(o, slot_mat, axis=1):
    """Faces that are not on the wall plane (window reveals) take the trim material."""
    me = o.data
    me.materials.append(slot_mat)
    idx = len(me.materials) - 1
    for poly in me.polygons:
        if abs(poly.normal[axis]) < 0.9:
            poly.material_index = idx


def collection(name):
    c = bpy.data.collections.new(name)
    scene.collection.children.link(c)
    return c


# ---------- University Building ----------
def build_ub():
    col = collection("University Building")
    S = 64 / 845.0  # metres per reference pixel: three tiers plus plinth over the 64 m height
    CX = 775
    W = 866 * S
    D = 42.0
    PL = 182 * S  # plinth height
    X = lambda px: (px - CX) * S
    Z = lambda py: 64 - (py - 122) * S
    HW, COLS = 19 * S, [445, 507, 568, 630, 692, 891, 978, 1062, 1134]
    ROWS = [(172, 342), (384, 553), (597, 768)]

    front_m = mat("UB front", tex="ub_front.jpg", rough=0.72)
    side_m = mat("UB side", tex="ub_side.jpg", rough=0.72)
    trim = mat("UB trim", srgb("F4EDE6"), 0.6)
    reveal = mat("UB reveal", srgb("B8A6A8"), 0.7)
    stone = mat("UB plinth stone", srgb("B9B4AC"), 0.78)
    pier = mat("UB plinth trim", srgb("C9855F"), 0.7)
    glass = mat("UB glass", srgb("2B57A3"), 0.12, 0.7)
    roof = mat("UB roof", srgb("D9CBC4"), 0.9)
    plant = mat("UB roof plant", srgb("4478B6"), 0.45)
    zu0, zu1 = Z(790), Z(122)
    parts = []

    # Upper walls with real arched openings. Front and rear use the elevation; flanks use the bays.
    def wall(name, y0, y1, xs, axis, m, flip=False):
        if axis == "y":
            o = box(name, -W / 2, W / 2, y0, y1, PL, 64, m, col)
        else:
            o = box(name, y0, y1, 0, D, PL, 64, m, col)
        cutters = []
        for c in xs:
            for t, b in ROWS:
                pts = arch(c, Z(b), Z(t), HW)
                cutters.append(prism("c", pts, (y0 - 1), (y1 + 1), None, col, axis))
        cut(o, cutters)
        return o

    fx = [X(c) for c in COLS]
    front = wall("UB front wall", 0, 0.8, fx, "y", front_m)
    planar_uv(front, 0, -W / 2, W / 2, zu0, zu1)
    reveal_to(front, reveal)
    parts.append(front)

    pitch = 62 * S
    sy = [D / 2 + (i - 3.5) * pitch for i in range(8)]
    for sgn, nm in ((-1, "left"), (1, "right")):
        x0 = sgn * W / 2 - (0 if sgn > 0 else 0)
        o = wall(f"UB {nm} wall", min(x0, x0 - sgn * 0.8), max(x0, x0 - sgn * 0.8), sy, "x", side_m)
        planar_uv(o, 1, 0, D, zu0, zu1, flip_u=(sgn > 0))
        reveal_to(o, reveal, axis=0)
        parts.append(o)
    rear = wall("UB rear wall", D - 0.8, D, fx, "y", front_m)
    planar_uv(rear, 0, W / 2, -W / 2, zu0, zu1)
    reveal_to(rear, reveal)
    parts.append(rear)

    # Glass set back in each opening, carrying the real glazing from the photographs.
    gf = box("UB front glass", -W / 2 + 0.4, W / 2 - 0.4, 0.34, 0.38, PL, 64, front_m, col)
    planar_uv(gf, 0, -W / 2, W / 2, zu0, zu1)
    parts.append(gf)
    for sgn in (-1, 1):
        x = sgn * (W / 2 - 0.34)
        g = box("UB side glass", x - 0.02, x + 0.02, 0.4, D - 0.4, PL, 64, side_m, col)
        planar_uv(g, 1, 0, D, zu0, zu1, flip_u=(sgn > 0))
        parts.append(g)
    core = box("UB core", -W / 2 + 0.7, W / 2 - 0.7, 0.7, D - 0.7, PL - 0.2, 63.9, roof, col)
    parts.append(core)

    # Moulded architraves, sills and keystones.
    def surround(c, t, b, face, axis, out):
        z0, z1 = Z(b), Z(t)
        inner = arch(c, z0, z1, HW + 0.02)
        outer = arch(c, z0 - 0.3, z1 + 0.32, HW + 0.34)
        y0, y1 = face - out * 0.02, face + out * 0.14
        parts.append(ring("frame", outer, inner, min(y0, y1), max(y0, y1), trim, col, axis))
        sill = [(c - HW - 0.62, z0 - 0.62), (c + HW + 0.62, z0 - 0.62), (c + HW + 0.62, z0 - 0.24), (c - HW - 0.62, z0 - 0.24)]
        parts.append(prism("sill", sill, min(face, face + out * 0.42), max(face, face + out * 0.42), trim, col, axis))

    for c in fx:
        for t, b in ROWS:
            surround(c, t, b, 0, "y", -1)
    for sgn in (-1, 1):
        for c in sy:
            for t, b in ROWS:
                surround(c, t, b, sgn * W / 2, "x", sgn)

    # String courses and the crowning cornice wrap the building.
    def band(z, h, out, m=trim):
        parts.append(box("band", -W / 2 - out, W / 2 + out, -out, D + out, z, z + h, m, col))

    for py in (362, 574, 786):
        band(Z(py) - 0.28, 0.56, 0.3)
    band(PL - 0.5, 0.7, 0.42)
    band(62.1, 0.5, 0.22)
    band(63.0, 1.0, 0.46)
    band(63.85, 0.32, 0.72)
    # Dentils under the cornice.
    n = 76
    for i in range(n):
        x = -W / 2 + (i + 0.5) * W / n
        parts.append(box("dentil", x - 0.2, x + 0.2, -0.46, 0, 62.6, 63.0, trim, col))
    for sgn in (-1, 1):
        for i in range(int(n * D / W)):
            y = (i + 0.5) * W / n
            parts.append(box("dentil", sgn * W / 2 - 0.23 + sgn * 0.23, sgn * W / 2 + sgn * 0.46, y - 0.2, y + 0.2, 62.6, 63.0, trim, col))
    # Corner pilasters.
    for x in (-W / 2, W / 2):
        for y in (0, D):
            parts.append(box("pier", x - 0.36, x + 0.36, y - 0.36, y + 0.36, PL, 62.2, trim, col))

    # Medallion: raised disc carrying the crest from the photograph.
    cx, cz, r = X(791), Z(464), 53 * S
    pts = [(cx + r * math.cos(i * math.tau / 48), cz + r * math.sin(i * math.tau / 48)) for i in range(48)]
    disc = prism("UB medallion", pts, -0.3, 0.02, front_m, col)
    planar_uv(disc, 0, -W / 2, W / 2, zu0, zu1)
    parts.append(disc)

    # Plinth: stone piers with tall arched glazing (measured from the three-quarter photograph).
    def plinth(name, length, n, axis, off, face_sign):
        if axis == "y":
            o = box(name, -length / 2, length / 2, off, off + 0.8, 0, PL, stone, col)
        else:
            o = box(name, off - 0.4, off + 0.4, 0, length, 0, PL, stone, col)
        cs = []
        arches = []
        for i in range(n):
            c = (i + 0.5) * length / n - (length / 2 if axis == "y" else 0)
            pts = arch(c, 1.1, PL - 1.5, 1.28)
            a, b = (off - 1, off + 2) if axis == "y" else (off - 2, off + 2)
            cs.append(prism("c", pts, a, b, None, col, axis))
            arches.append((c, pts))
        cut(o, cs)
        parts.append(o)
        for c, pts in arches:
            outer = arch(c, 0.9, PL - 1.22, 1.5)
            if axis == "y":
                parts.append(ring("pframe", outer, pts, off - 0.1, off + 0.1, pier, col, "y"))
                parts.append(prism("pglass", pts, off + 0.42, off + 0.5, None, col, "y"))
                parts[-1].data.materials.append(glass)
            else:
                parts.append(ring("pframe", outer, pts, off - face_sign * 0.1 - 0.1, off + 0.1, pier, col, "x"))
                parts.append(prism("pglass", pts, off - 0.04, off + 0.04, None, col, "x"))
                parts[-1].data.materials.append(glass)

    plinth("UB plinth front", W, 12, "y", 0, -1)
    plinth("UB plinth rear", W, 12, "y", D - 0.8, 1)
    plinth("UB plinth left", D, 8, "x", -W / 2 + 0.4, -1)
    plinth("UB plinth right", D, 8, "x", W / 2 - 0.4, 1)
    parts.append(box("UB plinth core", -W / 2 + 1, W / 2 - 1, 1, D - 1, 0, PL, stone, col))

    # Roof units visible in the photographs.
    parts.append(box("UB roof plant", X(965), X(1085), D / 2 - 7, D / 2 + 7, 64, 68.2, plant, col))
    lift = [(X(757) + 2.4 * math.cos(i * math.tau / 20), 2.4 * math.sin(i * math.tau / 20)) for i in range(20)]
    o = bpy.data.objects.new("x", None)
    bpy.data.objects.remove(o)
    parts.append(box("UB parapet", -W / 2, W / 2, 0, D, 64, 64.7, trim, col))
    parts.append(box("UB roof deck", -W / 2 + 0.8, W / 2 - 0.8, 0.8, D - 0.8, 64.1, 64.75, roof, col))
    ub = join(parts, "UniversityBuilding")
    return ub, col, W, D


# ---------- Tech Park ----------
def build_tp():
    col = collection("Tech Park")
    TOPV = 1905.0 / 1908.0
    Wd, H = 72.0, 63.0
    IMG_H = H * (2408 - 1205) / (2408 - 1278)  # the elevation image rises above the parapet
    px = lambda x: (x - 1133.5) / (2425 - 1133.5) * Wd - Wd / 2
    pz = lambda y: (2408 - y) / (2408 - 1278) * H
    tex = mat("TP front", tex="tp_front.jpg", rough=0.65)
    side_m = mat("TP side", tex="tp_side.jpg", rough=0.8)
    yellow = mat("TP yellow", srgb("F4C811"), 0.55)
    red = mat("TP red", srgb("D2343B"), 0.55)
    white = mat("TP white", srgb("E9E9E4"), 0.75)
    glassb = mat("TP curtain glass", srgb("1C57B0"), 0.1, 0.75)
    dark = mat("TP ribbon glass", srgb("121F3E"), 0.2, 0.3)
    rooftop = mat("TP roof", srgb("C9CBCF"), 0.9)
    tile = mat("TP terrace", srgb("B4583A"), 0.85)
    stepm = mat("TP steps", srgb("9EA29F"), 0.9)
    lawn = mat("TP lawn", srgb("4E8A35"), 1.0)
    DEPTH = 42.0
    YF, RW, WF = -6.0, 4.5, 0.0  # plan depths: yellow block front, ribbon wall, wing front
    parts = []

    def mapped(o):
        planar_uv(o, 0, -Wd / 2, Wd / 2, 0, IMG_H)
        return o

    xs = dict(wl=px(1133.5), wr=px(1365), rl=px(1420), yl=px(1530), yr=px(2040), rr=px(2147), er=px(2205), xr=px(2425))
    # Front planes, each carrying its own part of the elevation.
    for nm, a, b, y0 in (("left wing", xs["wl"], xs["wr"], WF), ("left red tower", xs["wr"], xs["rl"], WF - 0.4), ("right red tower", xs["rr"], xs["er"], WF - 0.4), ("right wing", xs["er"], xs["xr"], WF)):
        o = box(f"TP {nm}", a, b, y0, DEPTH, 0, H, tex, col)
        parts.append(mapped(o))
    # Recessed walls with inclined stair ribbons, cut through the wall.
    for side, a, b in (("left", xs["rl"], xs["yl"]), ("right", xs["yr"], xs["rr"])):
        o = box(f"TP {side} ribbon wall", a, b, RW, RW + 0.9, 0, H, tex, col)
        cs = []
        sgn = 1 if side == "left" else -1
        xa, xb = (px(1450), px(1529)) if side == "left" else (px(2044), px(2116))
        for i in range(15):
            yl = 1425 + i * 72.5  # image row at the outer end
            rise = 44 if side == "left" else -30
            ya = pz(yl)
            yb = pz(yl - rise)
            th = 1.05
            pts = [(xa, ya if side == "left" else yb), (xb, yb if side == "left" else ya), (xb, (yb if side == "left" else ya) + th), (xa, (ya if side == "left" else yb) + th)]
            cs.append(prism("c", pts, RW - 1, RW + 2, None, col))
        cut(o, cs)
        mapped(o)
        reveal_to(o, dark)
        parts.append(o)
        parts.append(box("TP ribbon back", a, b, RW + 0.8, RW + 1.0, 0, H, dark, col))
    # Central yellow block projects forward.
    yb = box("TP centre block", xs["yl"], xs["yr"], YF, RW + 1, 0, H + 1.0, tex, col)
    gx0, gx1, gz0, gz1 = px(1626), px(1950), pz(2112), pz(1307)
    lobby = (px(1619), px(1943), 0, pz(2228))
    cut(yb, [box("c", gx0, gx1, YF - 1, YF + 0.7, gz0, gz1, None, col), box("c", lobby[0], lobby[1], YF - 1, YF + 3.2, lobby[2] - 1, lobby[3], None, col)])
    mapped(yb)
    me = yb.data
    me.materials.append(yellow)
    for poly in me.polygons:
        if abs(poly.normal.y) < 0.9:
            poly.material_index = 1
    parts.append(yb)
    # Yellow block returns are white with small windows in the photographs.
    for x, sgn in ((xs["yl"], -1), (xs["yr"], 1)):
        o = box("TP return", x + sgn * 0.02 - 0.02, x + sgn * 0.02 + 0.02, YF, RW, 0, H, white, col)
        parts.append(o)
        for r in range(15):
            for j, y in enumerate((YF + 2.6, YF + 7.2)):
                z = 3.5 + r * 3.95
                parts.append(box("TP return window", x + sgn * 0.03 - 0.03, x + sgn * 0.03 + 0.03, y, y + 1.4, z, z + 2.0, dark, col))
    # Curtain wall: glass from the elevation, real yellow mullions in front of it.
    g = box("TP curtain wall", gx0, gx1, YF + 0.66, YF + 0.72, gz0, gz1, tex, col)
    parts.append(mapped(g))
    bars = []
    for x in (1705, 1868):
        bars.append(box("mullion", px(x) - 0.2, px(x) + 0.2, YF + 0.1, YF + 0.72, gz0, gz1, yellow, col))
    for y in (1452, 1602, 1752, 1902, 2055):
        bars.append(box("transom", gx0, gx1, YF + 0.1, YF + 0.72, pz(y) - 0.17, pz(y) + 0.17, yellow, col))
    parts += bars
    # Entrance: glazed lobby, yellow columns, red canopy.
    lg = box("TP lobby glass", lobby[0], lobby[1], YF + 3.1, YF + 3.2, 0, lobby[3], tex, col)
    parts.append(mapped(lg))
    for x in (1660, 1775, 1890):
        parts.append(box("TP lobby column", px(x) - 0.62, px(x) + 0.62, YF + 0.2, YF + 3.2, 0, lobby[3], yellow, col))
    cz = pz(2228)
    parts.append(prism("TP canopy", [(-6 - 6.5, cz), (YF + 0.2, cz + 0), (YF + 0.2, cz + 1.7), (-6 - 6.5, cz + 0.55)], px(1600), px(1958), red, col, "x"))
    # Red roof cap with a raking edge, per the frontal and three-quarter views.
    cx0, cx1 = px(1445), px(2125)
    cap = [(YF - 3.2, H + 1.0), (RW + 9, H + 1.0), (RW + 9, H + 3.0), (YF - 3.2, H + 1.5)]
    parts.append(prism("TP roof cap", cap, cx0, cx1, red, col, "x"))
    # Glass fins and strips on the wings.
    for xs5 in ((1185, 1225, 1267, 1307, 1347), (2245, 2285, 2325, 2365, 2405)):
        for x in xs5:
            parts.append(box("TP fin", px(x) - 0.2, px(x) + 0.2, WF - 0.55, WF, 0, pz(2050), white, col))
    # Long side walls.
    for x, flip in ((xs["wl"], False), (xs["xr"], True)):
        s = box("TP long side", x - 0.03, x + 0.03, WF, DEPTH, 0, H, side_m, col)
        planar_uv(s, 1, DEPTH, WF, 0, H, flip_u=flip)
        parts.append(s)
    # Roof, signboard and terrace.
    parts.append(box("TP roof slab", xs["wl"], xs["xr"], WF, DEPTH, H, H + 0.8, rooftop, col))
    parts.append(box("TP roof plant L", px(1430), px(1520), 8, 26, H, H + 5, white, col))
    parts.append(box("TP roof plant R", px(2050), px(2140), 8, 26, H, H + 5, white, col))
    sign = box("TP sign", px(1180), px(1415), 8, 8.3, H + 1.2, H + 4.2, tex, col)
    parts.append(sign)
    planar_uv(sign, 0, -Wd / 2, Wd / 2, 0, IMG_H)
    parts.append(box("TP terrace", -Wd / 2 - 4, Wd / 2 + 4, -14, 2, -0.4, 0, tile, col))
    # Broad central steps down to the forecourt, lawns either side.
    ST, RISE, TREAD = 22, 0.18, 0.62
    for i in range(ST):
        y = -14 - i * TREAD
        z = -0.4 - i * RISE
        parts.append(box("TP step", px(1560), px(2010), y - TREAD, y, z - 0.4, z, stepm, col))
    yend = -14 - ST * TREAD
    drop = -0.4 - ST * RISE
    lawn_pts = [(-14, -0.4), (yend, drop), (yend, drop - 0.8), (-14, drop - 0.8)]
    parts.append(prism("TP lawn left", lawn_pts, -Wd / 2 - 4, px(1560), lawn, col, "x"))
    parts.append(prism("TP lawn right", lawn_pts, px(2010), Wd / 2 + 4, lawn, col, "x"))
    tp = join(parts, "TechPark")
    return tp, col, Wd, DEPTH


# ---------- Tech Park 2 (from the rendering on the DSBS newsletter cover) ----------
def build_tp2():
    col = collection("Tech Park 2")
    EW, DEPTH, H0, H1 = 30.0, 46.0, 14.0, 62.0
    end = mat("TP2 end", tex="tp2_end.jpg", rough=0.75)
    side = mat("TP2 side", tex="tp2_side.jpg", rough=0.65)
    side.node_tree.nodes["Image Texture"].extension = "REPEAT"
    roofm = mat("TP2 roof", srgb("4C4A44"), 0.8)
    orange = mat("TP2 orange", srgb("E58A4A"), 0.7)
    inner = mat("TP2 podium", srgb("E9E4DA"), 0.8)
    parts = []
    # Upper floors stand on columns over the arched entrance.
    f = box("TP2 end wall", -EW / 2, EW / 2, 0, 0.6, H0, H1, end, col)
    planar_uv(f, 0, -EW / 2, EW / 2, H0, H1)
    parts.append(f)
    for x, flip in ((EW / 2, False), (-EW / 2, True)):
        s = box("TP2 long side", x - 0.3, x + 0.3, 0.4, DEPTH, 0, H1, side, col)
        me = s.data
        uv = me.uv_layers.new(name="UVMap")
        for poly in me.polygons:
            for li in poly.loop_indices:
                p = me.vertices[me.loops[li].vertex_index].co
                uv.data[li].uv = (p.y / 23.0, p.z / H1)
        parts.append(s)
    parts.append(box("TP2 mass", -EW / 2 + 0.3, EW / 2 - 0.3, 0.5, DEPTH, H0, H1, inner, col))
    parts.append(box("TP2 podium back", -EW / 2, EW / 2, 6.5, DEPTH, 0, H0, inner, col))
    parts.append(box("TP2 roof slab", -EW / 2 - 1.4, EW / 2 + 1.4, -1.4, DEPTH + 1.4, H1, H1 + 0.9, roofm, col))
    for x in (-EW / 2 + 0.5, EW / 2 - 0.5):
        parts.append(box("TP2 column", x - 0.5, x + 0.5, -0.2, 0.8, 0, H0, orange, col))
    # Orange arch across the podium.
    R = EW * 0.46
    outer = [(R * math.cos(math.pi * i / 40), R * 0.82 * math.sin(math.pi * i / 40)) for i in range(41)]
    inner_pts = [((R - 1.0) * math.cos(math.pi * i / 40), (R * 0.82 - 1.0) * math.sin(math.pi * i / 40)) for i in range(41)]
    pts = outer + inner_pts[::-1]
    parts.append(prism("TP2 arch", pts, -0.5, 0.5, orange, col))
    # Entrance ramp.
    parts.append(prism("TP2 ramp", [(-14, 0), (-1, 1.5), (5, 1.5), (5, 0)], -9, 9, orange, col, "x"))
    tp2 = join(parts, "TechPark2")
    return tp2, col, EW, DEPTH


ub, ub_col, UBW, UBD = build_ub()
tp, tp_col, TPW, TPD = build_tp()
tp2, tp2_col, T2W, T2D = build_tp2()
for o in (ub, tp, tp2):
    for p in o.data.polygons:
        p.use_smooth = False
print("TRIS", {o.name: sum(len(p.vertices) - 2 for p in o.data.polygons) for o in (ub, tp, tp2)})

# ---------- Light, world and camera ----------
world = bpy.data.worlds.new("Sky")
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
nt = world.node_tree
tc = nt.nodes.new("ShaderNodeTexCoord")
sep = nt.nodes.new("ShaderNodeSeparateXYZ")
ramp = nt.nodes.new("ShaderNodeValToRGB")
ramp.color_ramp.elements[0].position = 0.0
ramp.color_ramp.elements[0].color = (*srgb("E4EFF8"), 1)
ramp.color_ramp.elements[1].position = 0.55
ramp.color_ramp.elements[1].color = (*srgb("5B98DC"), 1)
nt.links.new(tc.outputs["Generated"], sep.inputs[0])
nt.links.new(sep.outputs["Z"], ramp.inputs["Fac"])
nt.links.new(ramp.outputs["Color"], bg.inputs[0])
bg.inputs[1].default_value = 1.0

sun = bpy.data.lights.new("Sun", "SUN")
sun.energy = 2.6
sun.angle = math.radians(1.5)
sun.color = (1, 0.96, 0.9)
so = bpy.data.objects.new("Sun", sun)
scene.collection.objects.link(so)
so.rotation_euler = (math.radians(52), 0, math.radians(-32))

ground = bpy.data.meshes.new("Ground")
ground.from_pydata([(-900, -900, -5), (900, -900, -5), (900, 900, -5), (-900, 900, -5)], [], [(0, 1, 2, 3)])
g_o = bpy.data.objects.new("Ground", ground)
scene.collection.objects.link(g_o)
ground.materials.append(mat("Ground", srgb("4A7A38"), 1.0))

cam_d = bpy.data.cameras.new("Camera")
cam_d.lens = 45
cam = bpy.data.objects.new("Camera", cam_d)
scene.collection.objects.link(cam)
scene.camera = cam
scene.render.engine = "CYCLES"
scene.cycles.samples = 48 if ONLY_RENDER_PREVIEW else 160
scene.cycles.use_denoising = True
try:
    prefs = bpy.context.preferences.addons["cycles"].preferences
    prefs.compute_device_type = "OPTIX"
    prefs.get_devices()
    for d in prefs.devices:
        d.use = True
    scene.cycles.device = "GPU"
except Exception as e:
    print("cpu render", e)
scene.view_settings.view_transform = "Standard"
scene.render.image_settings.file_format = "JPEG"
scene.render.image_settings.quality = 88


def shoot(name, target, pos, look, size=(1600, 1000)):
    for o in (ub, tp, tp2):
        o.hide_render = o is not target
    g_o.location.z = 0 if target is tp else 5
    scene.render.resolution_x, scene.render.resolution_y = size
    cam.location = pos
    d = Vector(look) - Vector(pos)
    cam.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    scene.render.filepath = os.path.join(RENDERS, name)
    bpy.ops.render.render(write_still=True)


S = (1000, 625) if ONLY_RENDER_PREVIEW else (1800, 1125)
shoot("ub.jpg", ub, (-96, -92, 4), (-4, 12, 30), S)
shoot("tp.jpg", tp, (-68, -124, 2), (0, 8, 27), S)
shoot("tp2.jpg", tp2, (-62, -74, 3), (3, 12, 27), S)

if not ONLY_RENDER_PREVIEW:
    bpy.ops.file.pack_all()
    bpy.ops.wm.save_as_mainfile(filepath=BLEND, compress=True)
    for o, f in ((ub, "university-building.glb"), (tp, "tech-park.glb"), (tp2, "tech-park-2.glb")):
        activate(o)
        bpy.ops.export_scene.gltf(filepath=os.path.join(WEB, f), export_format="GLB", use_selection=True, export_apply=True, export_image_format="WEBP", export_image_quality=82, export_yup=True)
    # Phones get the same geometry with half-size textures.
    for im in list(bpy.data.images):
        if im.size[0] > 256:
            im.scale(im.size[0] // 2, im.size[1] // 2)
    for o, f in ((ub, "university-building-sm.glb"), (tp, "tech-park-sm.glb"), (tp2, "tech-park-2-sm.glb")):
        activate(o)
        bpy.ops.export_scene.gltf(filepath=os.path.join(WEB, f), export_format="GLB", use_selection=True, export_apply=True, export_image_format="WEBP", export_image_quality=74, export_yup=True)
print("DONE")
