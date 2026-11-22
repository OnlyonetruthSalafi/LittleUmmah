"""Orthographic beach scenery and sand moulds. Run blender -b -P scripts/render-sandcastle.py.
PNG masters are written to public/games/sandcastle and public/games/hub.
Convert them using scripts/optimize-images.mjs for those two directories.
"""
import json
import math
import random
import sys
from pathlib import Path

import bpy
from mathutils import Vector

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
from blender_toys import beam, block, clear, cone, finish, mat, render, rock

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / "public/games/sandcastle"
ART.mkdir(parents=True, exist_ok=True)
ANGLE = math.radians(json.loads((ROOT/"src/features/games/data/railway.json").read_text())["cameraAngle"])
SAND, BISCUIT, EDGE = "E0A867", "E8B679", "D89851"
TEAL, BLUE, IVORY, CORAL, GOLD = "159591", "376E8F", "FFEFCD", "E96B45", "F7B945"


def grain(color, scale):
    material = mat(color)
    material.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = .82
    tree = material.node_tree
    noise = tree.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = scale
    noise.inputs["Detail"].default_value = 2.5
    coords = tree.nodes.new("ShaderNodeTexCoord")
    tree.links.new(coords.outputs["Object"], noise.inputs[0])
    bump = tree.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = .17
    bump.inputs["Distance"].default_value = .013
    tree.links.new(noise.outputs["Fac"], bump.inputs["Height"])
    tree.links.new(bump.outputs[0], tree.nodes["Principled BSDF"].inputs["Normal"])
    colors = tree.nodes.new("ShaderNodeValToRGB")
    rgb = material.diffuse_color
    for item, factor in zip(colors.color_ramp.elements, (.79, 1.15)):
        item.color = [min(1, rgb[i]*factor) for i in range(3)]+[1]
    tree.links.new(noise.outputs["Fac"], colors.inputs[0])
    tree.links.new(colors.outputs[0], tree.nodes["Principled BSDF"].inputs["Base Color"])


def mesh(name, verts, faces, color, bevel=0):
    data = bpy.data.meshes.new(name)
    data.from_pydata(verts, [], faces)
    data.update()
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    return finish(obj, color, bevel)


def tube(points, radius, color):
    data = bpy.data.curves.new("Bend", "CURVE")
    data.dimensions = "3D"
    data.resolution_u = 6
    data.bevel_depth = radius
    data.bevel_resolution = 3
    spline = data.splines.new("POLY")
    spline.points.add(len(points)-1)
    for point, loc in zip(spline.points, points):
        point.co = (*loc, 1)
    obj = bpy.data.objects.new("Rounded edge", data)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat(color))
    return obj


def group(make, xyz, s=1, a=0):
    before = set(bpy.context.scene.objects)
    make()
    parent = bpy.data.objects.new("Toy", None)
    bpy.context.collection.objects.link(parent)
    for obj in set(bpy.context.scene.objects)-before-{parent}:
        if obj.parent is None:
            obj.parent = parent
    parent.location, parent.scale, parent.rotation_euler.z = xyz, (s,s,s), a


def arch(half, height, radius, depth, color):
    # Each span is a solid section above a continuous semicircular vault.
    spring = .53
    edge = [(-half,0),(-radius,0),(-radius,spring)]
    for j in range(1,17):
        a = math.pi - math.pi*j/16
        edge.append((radius*math.cos(a),spring+radius*math.sin(a)))
    edge += [(radius,0),(half,0)]
    verts = []
    for x,z in edge:
        verts += [(x,-depth,z),(x,-depth,height),(x,depth,height),(x,depth,z)]
    faces = [(3,2,1,0),tuple(range(len(verts)-4,len(verts)))]
    for i in range(len(edge)-1):
        for k in range(4):
            u=4*i+k; v=4*i+(k+1)%4
            faces.append((u,v,v+4,u+4))
    return mesh("Sand gate with open arch",verts,faces,color,.024)


def flag(x, y, z, accent=CORAL):
    beam((x,y,z),(x,y,z+.76),.033,"BD854E")
    perim=[(x,y,z+.70),(x+.51,y+.045,z+.61),(x+.38,y+.078,z+.51),
           (x+.58,y+.09,z+.41),(x+.23,y+.04,z+.36),(x,y,z+.42)]
    mesh("Pennant",perim,[(0,1,2,3,4,5)],accent)
    rock((x,y,z+.78),(.064,.064,.065),GOLD,2)


def tower(pennant=True):
    cone((0,0,.10),.93,.94,.19,EDGE,36)
    cone((0,0,.79),.90,.68,1.43,SAND,36)
    cone((0,0,1.45),.71,.80,.21,BISCUIT,36)
    cone((0,0,1.59),.80,.78,.12,BISCUIT,36)
    for j in range(8):
        a=j*math.tau/8
        obj=block((.64*math.cos(a),.64*math.sin(a),1.77),(.29,.37,.32),BISCUIT,.054)
        obj.rotation_euler.z=a
    # A small stone frame around a deeply shaded arrow slit.
    for j in [-1,1]:
        block((j*.09,-.795,.90),(.05,.05,.32),EDGE,.022)
    block((0,-.805,.91),(.135,.065,.31),"846147",.06)
    if pennant:
        flag(.04,.04,1.60)


def keep():
    arch(1.31,1.58,.48,.64,SAND)
    # Voussoirs follow the opening; each block has a wedge-shaped cross section.
    for j in range(9):
        a,b=math.pi*j/9+.012,math.pi*(j+1)/9-.012
        verts=[(r*math.cos(t),y,.53+r*math.sin(t)) for y in [-.72,-.629] for r,t in [( .48,a),(.67,a),(.67,b),(.48,b)]]
        mesh("Sand archstone",verts,[(0,1,2,3),(4,7,6,5),(0,4,5,1),(1,5,6,2),(2,6,7,3),(3,7,4,0)],BISCUIT,.018)
    for s in [-1,1]:
        for z in [.13,.39]:
            block((s*.571,-.67,z),(.18,.12,.255),BISCUIT,.018)
        for j in range(2):
            block((s*1.18,-.58+j*1.16,1.78),(.31,.30,.39),BISCUIT,.046)
    block((0,0,1.55),(2.72,1.39,.19),BISCUIT,.05)
    for x in [-.58,0,.58]:
        for y in [-.55,.55]:
            block((x,y,1.77),(.33,.30,.38),BISCUIT,.045)


def bucket():
    cone((0,0,.72),.91,.65,1.40,TEAL,36)
    cone((0,0,.085),.965,.96,.16,"0E6F78",40)
    cone((0,0,.16),.93,.925,.075,"58CDC0",40)
    cone((0,0,1.44),.67,.67,.095,"63D5C3",36)
    cone((0,0,1.50),.29,.23,.055,TEAL,28)
    for x in (-.83,.83):
        rock((x,-.04,.44),(.11,.105,.115),GOLD,2)
    tube([(.84*math.cos(i*math.pi/24),-.11,.44+1.32*math.sin(i*math.pi/24)) for i in range(25)],.052,GOLD)
    for j in range(6):
        a=math.tau*j/6
        beam((.89*math.cos(a),.89*math.sin(a),.2),(.714*math.cos(a),.714*math.sin(a),1.15),.025,"59BAB2",9)


def can():
    cone((0,0,.56),.60,.59,1.03,TEAL,36)
    cone((0,0,.13),.65,.65,.135,"076F81",36)
    cone((0,0,1.10),.60,.48,.09,"55C5BB",36)
    cone((0,0,1.146),.32,.32,.012,"255C69",32)
    tube([(.34+(.70*math.sin(i*math.pi/24)),.03,.66+.52*math.cos(i*math.pi/24)) for i in range(25)],.095,GOLD)
    beam((-.39,0,.36),(-1.27,0,1.03),.135,TEAL)
    beam((-1.26,0,1.03),(-1.41,0,1.20),.20,"D99B43")
    beam((-1.39,0,1.19),(-1.45,0,1.24),.22,GOLD)
    for dx in [-.14,0,.14]:
        rock((dx,-.60,.61),(.04,.018,.045),"BBE6D2",2)


def scoop():
    # Concave rolled toy shovel with a real pile of loose sand.
    rows=[(-.99,.20,.07),(-.80,.57,.14),(-.19,.68,.21),(.15,.40,.33)]
    verts=[]
    for y,w,z in rows:
        verts += [(-w,y,z+.18),(-w*.58,y,z),(w*.58,y,z),(w,y,z+.18)]
    faces=[(4*i+k,4*i+k+1,4*i+k+5,4*i+k+4) for i in range(3) for k in range(3)]
    blade=mesh("Scooping blade",verts,faces,CORAL)
    solidify=blade.modifiers.new("Plastic thickness","SOLIDIFY");solidify.thickness=.075
    bevel=blade.modifiers.new("Smooth rim","BEVEL");bevel.width=.04;bevel.segments=3
    rock((0,-.41,.29),(.55,.51,.24),BISCUIT,2)
    for x,y in [(-.32,-.7),(.35,-.55),(.21,-.7),(-.13,-.78)]:
        rock((x,y,.27),(.13,.13,.10),SAND,1)
    beam((0,.04,.38),(0,.76,1.20),.088,GOLD,18)
    tube([(-.31,.78,1.28),(0,.70,1.17),(.31,.78,1.28),(.31,.96,1.49),(-.31,.96,1.49),(-.31,.78,1.28)],.085,TEAL)


def shore_y(x, level):
    return 4.55+.50*math.sin(x*.55+level*.85)+.22*math.cos(x*1.18)


def strip(name, left, right, side_a, side_b, color):
    xs=[left+(right-left)*i/76 for i in range(77)]
    verts=[(x,*f(x)) for x in xs for f in (side_a,side_b)]
    mesh(name,verts,[(i,i+2,i+3,i+1) for i in range(0,len(verts)-2,2)],color)


def sail(x,y,scale,accent):
    hull=rock((x,y,.24*scale),(1.0*scale,.40*scale,.25*scale),CORAL,2)
    hull.rotation_euler.z=-.1
    beam((x,y,.32*scale),(x,y,2.04*scale),.032*scale,"926F4D")
    for s,extent,c in [(1,.76,IVORY),(-1,.58,accent)]:
        mesh("Canvas sail",[(x+s*.06*scale,y,1.98*scale),(x+s*extent*scale,y, .56*scale),(x+s*.05*scale,y-.08*scale,.57*scale)],[(0,1,2)],c)


def umbrella(x,y,scale):
    beam((x,y,.02),(x,y,2.0*scale),.055*scale,"AC794C")
    for j in range(12):
        a,b=j*math.tau/12,(j+1)*math.tau/12
        m=(a+b)/2
        def v(r,t,z):
            return (x+r*scale*math.cos(t),y+r*scale*math.sin(t),z*scale)
        mesh("Striped parasol",[v(0,0,2.16),v(.76,a,2.02),v(.76,b,2.02),v(1.25,a,1.79),v(1.25,m,1.70),v(1.25,b,1.79)],[(0,1,2),(1,3,4,5,2)],CORAL if j%2 else IVORY)
    rock((x,y,2.17*scale),(.085*scale,)*3,GOLD,2)


def palm(x,y,s):
    beam((x,y,0),(x+.10*s,y,2.00*s),.12*s,"A77546",10)
    for j in range(8):
        a=j*math.tau/8
        def pos(rad,lat,z):
            return (x+s*(.1+rad*math.cos(a)-lat*math.sin(a)),y+s*(rad*math.sin(a)+lat*math.cos(a)),s*z)
        mesh("Palm frond",[pos(0,0,2.0),pos(.55,-.17,2.22),pos(.62,0,2.29),pos(.55,.17,2.22),pos(1.28,0,1.75)],
            [(0,1,2),(0,2,3),(1,4,2),(2,4,3)],"387E67" if j%2 else "6AA873")


def beach(level):
    sky,water,sand=[("A9DCE9","43ABB8","EBC88E"),("A8CFDF","4FABAA","F2D097"),("E1C5BA","66AAB5","E6BB8F")][level-1]
    rng=random.Random(510+level)
    strip("Beach",-16,16,lambda x:(-18,0),lambda x:(shore_y(x,level),0),sand)
    strip("Wet sand",-16,16,lambda x:(shore_y(x,level)-.15,.01),lambda x:(shore_y(x,level)+.64,-.07),"D9B78A")
    strip("Lace of foam",-16,16,lambda x:(shore_y(x,level)+.55,-.06),lambda x:(shore_y(x,level)+.67,-.07),"D9F0DA")
    strip("Translucent shallows",-16,16,lambda x:(shore_y(x,level)+.64,-.079),lambda x:(shore_y(x,level)+1.51,-.085),"83CCC4")
    block((0,8.55,-.25),(34,6.65,.29),water,.02)
    for j in range(75):
        x,y=rng.uniform(-12.6,12.6),rng.uniform(5,11.5)
        if y<shore_y(x,level)+.9: continue
        block((x,y,-.078),(rng.uniform(.12,.65),rng.uniform(.025,.072),.016),rng.choice(["A4DFD8","82CEC9","C8E6D9"]),.011)
    for side in (-1,1):
        cx=side*(9+level*.35)
        rock((cx,10.25,.16),(3.0,2.0,.51),"DDBA8F",2)
        for j in range(4):
            x=cx+rng.uniform(-1.78,1.78); y=10+rng.uniform(-.3,.85)
            rock((x,y,.43),(rng.uniform(.62,1.4),.60,rng.uniform(.35,1.27)),rng.choice(["82B295","76A489","91B197"]),2)
    if level==1:
        sail(-5.8,8.6,.76,GOLD);umbrella(9.2,3.20,.95);palm(-10.3,3.55,.93)
    elif level==2:
        for x in [-8.85,-7.08]:
            for j in range(3):rock((x,8.65,.25+.51*j),(.56,.64,.47),"BA977E",2)
        rock((-7.96,8.65,1.70),(1.43,.66,.48),"D5AC86",2)
        sail(5.35,8.48,.65,TEAL);umbrella(-10.5,2.8,.84);palm(9.33,3.28,1.20)
    else:
        for i,x in enumerate([-9.75,-8.35]):
            block((x,4.0,.45),(1.20,.98,.9),[TEAL,CORAL][i],.055)
            for side in [-1,1]:
                o=block((x+side*.34,4.0,1.02),(.89,1.17,.15),IVORY,.04);o.rotation_euler.y=side*.41
            block((x,3.49,.37),(.39,.05,.66),BLUE,.026)
        umbrella(9.73,3.0,1.02); sail(1.55,9.88,.63,CORAL)
    # Wind-blown sand drifts and sea glass frame the work surface.
    for side in [-1,1]:
        px=side*10.0
        for j in range(4):
            cy=-.9-j*.33
            tube([(px+side*i*.12,cy+.12*math.cos(i*.4+j),.018) for i in range(8+j)],.023,"E2BB87")
        for j in range(5):
            x=side*rng.uniform(9.3,11.75)
            y=rng.uniform(-4.4,-2.5)
            rock((x,y,.035),(.16,.13,.061),rng.choice(["B6D7C3","C4D9C8","DED1AD"]),2)
    # Sand glints are scattered only along the edge of the construction site.
    for i in range(52):
        x=rng.uniform(-12,12); y=rng.uniform(-8,4)
        if abs(x)<6.6 and y<3.3:continue
        size=rng.uniform(.025,.075)
        rock((x,y,.017),(size*1.9,size,.021),rng.choice(["DAC096","E2C69C","E4CBAB"]),1)
    return sky


def cover():
    block((0,0,-.38),(5.9,4.55,.76),"52B6BA",.31)
    block((0,0,-.12),(5.67,4.33,.44),"E5C38D",.26)
    rock((0,-.05,.03),(2.75,2.0,.36),BISCUIT,2)
    group(keep,(0,-.67,.18),1.02)
    for s in [-1,1]:
        group(tower,(1.63*s,-.65,.18),.83)
        group(lambda:tower(False),(1.35*s,.94,.18),.67)
        block((s*1.53,.13,.67),(.42,1.53,.81),SAND,.09)
        for y in [-.14,.30,.73]:block((s*1.51,y,1.17),(.51,.25,.33),BISCUIT,.042)
    group(tower,(0,.80,.28),1.27)
    group(bucket,(-2.24,-1.05,.21),.42,-.13)
    group(scoop,(2.05,-1.20,.19),.49,-.81)
    for x,y in [(-2.45,.54),(-2.34,.91),(2.05,1.62)]:
        block((x,y,-.17),(.38,.11,.06),"A3E0D9",.045)
    for x,y in [(-2.39,-.7),(2.19,-1.18),(1.76,-1.56),(-1.90,-1.38),(.76,-1.55)]:
        rock((x,y,.19),(.15,.13,.11),"E8C992",2)


def framed(name, make, size, azimuth):
    clear()
    make()
    bpy.context.view_layer.update()
    right=Vector((math.cos(azimuth),math.sin(azimuth),0))
    up=Vector((-math.sin(azimuth)*math.sin(ANGLE),math.cos(azimuth)*math.sin(ANGLE),math.cos(ANGLE)))
    coords=[obj.matrix_world@v.co for obj in bpy.context.scene.objects if obj.type=="MESH" for v in obj.data.vertices]
    coords += [obj.matrix_world@Vector(c) for obj in bpy.context.scene.objects if obj.type=="CURVE" for c in obj.bound_box]
    xx=[v.dot(right) for v in coords]; yy=[v.dot(up) for v in coords]
    scale=max(max(xx)-min(xx),max(yy)-min(yy))*1.115
    # The bottom anchor is consistent even for broad, flat tools.
    vertical=(min(yy)+max(yy))/2 if name.stem=="sandcastle" else min(yy)+scale*.455
    target=right*((min(xx)+max(xx))/2)+up*vertical
    if name.stem in {"keep","tower"}:
        roof_y=.5-(Vector((0,0,1.65)).dot(up)-vertical)/scale
        print(f"Roof centre anchor for {name.name}: (0.50, {roof_y:.3f})", flush=True)
    render(name,(size,size),target,scale,azimuth,elevation=ANGLE)


if __name__=="__main__":
    for color in [SAND,BISCUIT,EDGE]: grain(color,46)
    for color in ["EBC88E","F2D097","E6BB8F"]:grain(color,34)
    selected=set(sys.argv[sys.argv.index("--")+1:]) if "--" in sys.argv else set()
    entries={"tower":(lambda:tower(False),-.18),"keep":(keep,-.19),"bucket":(bucket,-.15),"can":(can,-.25),"scoop":(scoop,-.66)}
    for key,(make,azimuth) in entries.items():
        if not selected or key in selected:
            framed(ART/(key+".png"),make,320,azimuth)
    if not selected or "cover" in selected:
        framed(ROOT/"public/games/hub/sandcastle.png",cover,720,-.28)
    for level in range(1,4):
        if selected and f"level-{level}" not in selected:
            continue
        clear()
        sky=beach(level)
        render(ART/f"level-{level}.png",(1120,560),(0,0,1.03),24,sky=sky,elevation=ANGLE)
