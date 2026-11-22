"""Render the Color Harbor toy set. Run Blender in background from the repo root."""
import math
import random
from pathlib import Path

import bpy
from mathutils import Vector


ROOT = Path(__file__).resolve().parents[1] / "public/games"
ART = ROOT / "color-match"
ART.mkdir(exist_ok=True)
COLORS = {"red": "EF4843", "blue": "2677DC", "yellow": "FFBE19", "green": "35A76C"}


def material(code):
    mat = bpy.data.materials.get(code)
    if mat:
        return mat
    mat = bpy.data.materials.new(code)
    channels = [int(code[i:i+2], 16) / 255 for i in (0, 2, 4)]
    mat.diffuse_color = [((c + .055) / 1.055) ** 2.4 if c > .04045 else c / 12.92 for c in channels] + [1]
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = mat.diffuse_color
    shader.inputs["Roughness"].default_value = .36
    return mat


def finish(color, bevel=0):
    obj = bpy.context.object
    obj.data.materials.append(material(color))
    if bevel:
        mod = obj.modifiers.new("Soft toy edges", "BEVEL")
        mod.width, mod.segments = bevel, 3
        obj.modifiers.new("Smooth highlights", "WEIGHTED_NORMAL")
    return obj


def block(pos, size, color, bevel=.08):
    bpy.ops.mesh.primitive_cube_add(size=1, location=pos)
    bpy.context.object.dimensions = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(color, bevel)


def taper(x, y, z, bottom, top, height, color, sides=48):
    bpy.ops.mesh.primitive_cone_add(vertices=sides, radius1=bottom, radius2=top,
                                    depth=height, location=(x, y, z + height / 2))
    return finish(color, min(.045, height / 8, bottom / 7))


def pebble(pos, scale, color):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=1, location=pos)
    obj = finish(color)
    obj.scale = scale
    return obj


def pine(x, y, z, size):
    taper(x, y, z, .095*size, .07*size, .56*size, "996444")
    for height, radius, tint in [(.28, .48, "278F77"), (.55, .4, "38AD81"), (.84, .29, "62C995")]:
        taper(x, y, z+height*size, radius*size, .035*size, .65*size, tint, 10)


def dock(x, y, color):
    # A stepped sandstone outcrop, with a plank jetty extending towards the camera.
    for z, r, h, tint in [(-.16, 1.38, .38, "AF7958"), (.12, 1.44, .25, "E9B87D"),
                            (.33, 1.38, .14, "F5D59A"), (.45, 1.26, .07, "9FCC78")]:
        taper(x, y, z, r*.94, r, h, tint, 12)
    pine(x-.83, y+.16, .5, .86)
    pine(x+.82, y+.38, .5, .6)
    for dx, dy, s in [(-1,-.46,.24),(.88,-.41,.28),(1.22,-.25,.16)]:
        pebble((x+dx, y+dy,.46), (s,s*.8,s*.65), "D6AB83")
    taper(x,y,.48,.63,.57,.22,"CFAB70")
    for z,r1,r2,h,tint in [(.68,.52,.48,.42,color),(1.1,.48,.44,.43,"FFF3D9"),
                             (1.53,.44,.39,.47,color),(2,.39,.38,.14,"FFF3D9"),
                             (2.14,.54,.54,.12,"274D63"),(2.26,.4,.4,.42,"FFD57A"),
                             (2.68,.57,.1,.34,color),(3.02,.085,.035,.22,"DCAA48")]:
        taper(x,y,z,r1,r2,h,tint)
    for index in range(8):
        a = math.tau * index / 8
        taper(x+.406*math.cos(a),y+.406*math.sin(a),2.25,.025,.025,.45,"385769",12)
    block((x,y-.5,.86),(.23,.06,.36),"31556A",.045)
    for i in range(8):
        block((x+.33,y-.87-i*.12,.4),(.85,.115,.09),"DAA16A" if i%3 else "F1BE82",.018)
    for dx in [-.36,.36]:
        for dy in [-.98,-1.68]:
            taper(x+.33+dx,y+dy,-.1,.072,.072,.66,"A16D49",16)
            taper(x+.33+dx,y+dy,.48,.076,.076,.055,"FCE3AF",16)


def hull_mesh(name, rings, color):
    verts = [v for ring in rings for v in ring]
    n = len(rings[0])
    faces = [tuple(reversed(range(n))), tuple(range(len(verts)-n,len(verts)))]
    for j in range(len(rings)-1):
        faces.extend((j*n+i,j*n+(i+1)%n,(j+1)*n+(i+1)%n,(j+1)*n+i) for i in range(n))
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material(color))
    mod = obj.modifiers.new("Rounded rim", "BEVEL")
    mod.width, mod.segments = .045, 3
    obj.modifiers.new("Hull normals", "WEIGHTED_NORMAL")


def boat(x,y,color):
    points = [(-1.1,-.29),(-.83,-.46),(.37,-.46),(.93,-.27),(1.27,0),(.93,.27),
              (.37,.46),(-.83,.46),(-1.1,.29)]
    def ring(scale,z):
        return [(x+px*scale, y+(py+.27*px)*scale, z) for px,py in points]
    hull_mesh("Painted hull",[ring(.77,0),ring(1,.32)],color)
    hull_mesh("Ivory gunwale",[ring(1,.31),ring(1.02,.4)],"FFF2CE")
    hull_mesh("Teak deck",[ring(.94,.4),ring(.94,.44)],"C98D5B")
    taper(x+.13,y,.44,.045,.039,1.82,"9F683D")
    # Curved cloth panels catch light across the sail. Ivory seams are actual geometry.
    def sail(a,b,top,tint):
        segments=14
        verts=[]
        faces=[]
        for j in range(segments+1):
            t=j/segments
            for i in range(segments+1):
                u=i/segments
                dx=(a+(b-a)*u)*(1-.98*t)+top*.98*t
                bow=.23*math.sin(math.pi*u)*(1-t)
                verts.append((x+dx,y+.27*dx-bow,.58+1.54*t+.11*(1-u)*(1-t)))
        for j in range(segments):
            for i in range(segments):
                k=j*(segments+1)+i
                faces.append((k,k+1,k+segments+2,k+segments+1))
        mesh=bpy.data.meshes.new("Sailcloth")
        mesh.from_pydata(verts,[],faces)
        obj=bpy.data.objects.new("Sewn sail",mesh)
        bpy.context.collection.objects.link(obj)
        for c in (tint,"FFF3D6"):
            mesh.materials.append(material(c))
        for poly in mesh.polygons:
            poly.use_smooth=True
            poly.material_index=int(poly.index//segments==1)
        obj.modifiers.new("Cloth thickness","SOLIDIFY").thickness=.025
    sail(-1.02,.06,.08,color)
    sail(.22,1.07,.22,"FFF1CF")
    hull_mesh("Mast pennant", [[(x+.1,y,2.08),(x+.1,y,2.35),(x-.42,y,2.24)],
                               [(x+.1,y+.035,2.08),(x+.1,y+.035,2.35),(x-.42,y+.035,2.24)]],color)


def clear():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)


def render(path, size, center, direction, scale):
    scene=bpy.context.scene
    center=Vector(center)
    bpy.ops.object.camera_add(location=center+Vector(direction))
    camera=bpy.context.object
    camera.rotation_euler=(-Vector(direction)).to_track_quat("-Z","Y").to_euler()
    camera.data.type="ORTHO"
    camera.data.ortho_scale=scale
    scene.camera=camera
    bpy.ops.object.light_add(type="AREA",location=(-4,-6,10))
    light=bpy.context.object
    light.rotation_euler=(-light.location).to_track_quat("-Z","Y").to_euler()
    light.data.energy,light.data.shape,light.data.size=1400,"DISK",6
    scene.render.engine="CYCLES"
    scene.cycles.samples=12
    scene.cycles.use_denoising=True
    scene.world.color=(.62,.72,.85)
    scene.world.use_nodes=True
    scene.world.node_tree.nodes.get("Background").inputs["Color"].default_value=(.8,.88,1,1)
    scene.world.node_tree.nodes.get("Background").inputs["Strength"].default_value=.55
    scene.view_settings.view_transform="AgX"
    scene.view_settings.look="AgX - Medium High Contrast"
    scene.render.film_transparent=True
    scene.render.resolution_x,scene.render.resolution_y=size
    scene.render.resolution_percentage=100
    scene.render.image_settings.color_mode="RGBA"
    scene.render.filepath=str(path)
    bpy.ops.render.render(write_still=True)


if __name__ == "__main__":
    for name, color in COLORS.items():
        clear()
        dock(0,0,color)
        render(ART/f"dock-{name}.png",(400,400),(0,-.18,1.32),(3,-12,6.6),4.25)
        clear()
        boat(0,0,color)
        render(ART/f"boat-{name}.png",(384,384),(0,0,1.08),(2,-12,5.3),2.83)

    clear()
    # A compact floating bay for the hub card and the instruction page.
    block((0,0,-.57),(7.65,5.7,.84),"168AA6",.4)
    block((0,0,-.16),(7.65,5.7,.32),"49CDD4",.23)
    dock(-1.52,.6,COLORS["red"])
    dock(1.61,1.0,COLORS["blue"])
    boat(.22,-1.67,COLORS["red"])
    rng=random.Random(15)
    for i in range(26):
        x,y=rng.uniform(-3.48,3.48),rng.uniform(-2.55,2.55)
        pebble((x,y,.008),(rng.uniform(.12,.28),.035,.018),"BAF3EC")
    render(ROOT/"hub/color-match.png",(720,720),(0,0,.85),(4.5,-12,6.6),9.85)

    # A separate distant coast preserves the silhouette and tappable area of every dock.
    clear()
    rng=random.Random(26)
    # The sea surface hides the submerged half of the rocks and catches their shadows.
    block((0,-5.8,-.16),(48,30,.28),"55C9CA",.02)
    bpy.ops.object.light_add(type="SUN",location=(0,0,10))
    bpy.context.object.rotation_euler=(.48,-.54,-.25)
    bpy.context.object.data.energy=2.0
    bpy.context.object.data.angle=.24
    for x in [-9.4,-7.8,-6.0,6.5,8.0,10.5,1.6]:
        y=rng.uniform(6.7,8.4)
        size=rng.uniform(.42,.92)
        pebble((x,y,0),(size*2,size*.8,size*.7),"76BBA8")
        for j in range(4):
            pine(x+rng.uniform(-size,size),y,.25*size,rng.uniform(.5,1.1)*size)
    for x,y in [(-5,8.8),(3,9.1),(8.7,8.9)]:
        for j in range(3):
            pebble((x+j*.30,y,1.48+(j%2)*.10),(.44,.24,.18+(j%2)*.09),"FFF5DC")
    for i in range(160):
        x,y=rng.uniform(-12,12),rng.uniform(-9,13)
        if y<9:
            pebble((x,y,-.014),(rng.uniform(.05,.29),.026,.016),"B2ECE3")
    render(ART/"bay.png",(1280,640),(0,0,1.0),(0,-18,7.6),19)
