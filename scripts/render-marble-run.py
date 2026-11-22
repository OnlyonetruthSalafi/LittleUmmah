"""Bake the marble viaduct with the railway camera. Export the ball's projected centreline from the meshes."""
import json
import math
import random
import sys
from pathlib import Path

import bpy
from mathutils import Vector
sys.path.insert(0, str(Path(__file__).resolve().parent / 'lib'))
from blender_toys import beam, block, clear, cone, finish, mat, render, rock, solid

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT/'public/games/marble-run'
OUT = ROOT/'output/marble-run'
DATA = ROOT/'src/features/games/data'
CAM = json.loads((DATA/'railway.json').read_text())
ANGLE = math.radians(CAM['cameraAngle'])
TARGET = (0, 0, CAM['cameraZ'])
WIDTH = CAM['cameraWidth']
PLAY_GAUGE = 1.85
BED_DROP = .24  # A larger marble still rolls on the exported centreline.
GOLD, BRASS, DARK, IVORY, TEAL = 'FFD586','C58C46','244658','FFF0C6','269195'
WATER_Z = -2.43
START = Vector((0, 1.48, 5.36))
CUPS = ['BF5747','227F84','78639F','B17833']
THEMES = [
    ('A2D9E8','63B7B8','A58369','88AC78','547F80','D55E47'),
    ('FAC890','689F9C','B96F50','DBA16A','915F59','157C80'),
    ('90ACD4','659FB4','797C9B','AEBDD0','606D94','5378AB'),
]

def bake(path,size=(1120,560),target=TARGET,width=WIDTH,**kw):
    render(path,size,target,width,elevation=ANGLE,**kw)

def tube(name,points,r,color,closed=False):
    data=bpy.data.curves.new(name,'CURVE')
    data.dimensions='3D'
    data.bevel_depth=r
    data.bevel_resolution=2
    spline=data.splines.new('POLY')
    spline.points.add(len(points)-1)
    for p,co in zip(spline.points,points): p.co=(*co,1)
    spline.use_cyclic_u=closed
    obj=bpy.data.objects.new(name,data)
    bpy.context.collection.objects.link(obj)
    data.materials.append(mat(color))
    return obj

def hoop(p,r,wire,color,axis='z'):
    coords=[]
    for i in range(64):
        a=i*math.tau/64
        offset=(r*math.cos(a),r*math.sin(a),0) if axis=='z' else (r*math.cos(a),0,r*math.sin(a))
        coords.append(Vector(p)+Vector(offset))
    return tube('Rolled metal rim',coords,wire,color,True)

def project(p):
    x,y,z=p
    return [round(480+x*960/WIDTH,2),round(240-(y*math.sin(ANGLE)+(z-TARGET[2])*math.cos(ANGLE))*960/WIDTH,2)]

def layout(level):
    deep=level>1
    gates=[Vector((0,1.48,4.04 if deep else 3.05))]
    if deep: gates.extend([Vector((x,-.2,1.44)) for x in [-4.6,4.6]])
    cups=[Vector((x,-3.0,-.70)) for x in ([-7.38,-2.55,2.55,7.38] if deep else [-5.85,5.85])]
    return gates,cups

def routes(gates,cups):
    for i,g in enumerate(gates):
        targets=gates[1:] if len(gates)>1 and i==0 else cups[max(0,i-1)*2:max(0,i-1)*2+2]
        for side,to in enumerate(targets):
            pts=[]
            for k in range(33):
                t=k/32
                # A sweeping bank turns toward the viewer, flattening at the brass launch lip.
                x=g.x+(to.x-g.x)*t
                y=g.y+(to.y-g.y)*t-.66*math.sin(math.pi*t)
                z=g.z+(to.z+.55-g.z)*t+.20*math.sin(2*math.pi*t)
                pts.append(Vector((x,y,z)))
            yield i,side,pts,to

def normal(pts,k):
    v=pts[min(k+1,len(pts)-1)]-pts[max(k-1,0)]
    return Vector((-v.y,v.x,0)).normalized()

def chute(pts,start,end,width,drop=0):
    rows=[]; edges=[[],[]]
    for k in range(start,end+1):
        p=pts[k]-Vector((0,0,drop)); n=normal(pts,k)*width
        # Ball centre is above the concave enamel bed, which sits between two real brass rims.
        rows.append([p+n*w+Vector((0,0,h)) for w,h in [(-.32,-.23),(-.32,-.12),(-.22,-.16),(0,-.22),(.22,-.16),(.32,-.12),(.32,-.23),(0,-.34)]])
        for edge,sign in zip(edges,[-1,1]): edge.append(p+n*.32*sign+Vector((0,0,-.095)))
    solid('Enamel flume',rows,TEAL)
    for edge in edges: tube('Brass safety lip',edge,.046*(1.40 if drop else 1),GOLD)
    for k in range(start,end+1):
        if k%4==0 or k in (start,end):
            n=normal(pts,k)*width;p=pts[k]+Vector((0,0,-.34-drop))
            beam(p-n*.355,p+n*.355,.055,BRASS,10)

def tower(p,r,foot=-2.38):
    x,y,z=p; cap=z-.31
    cone((x,y,foot+.18),r*1.5,r*1.35,.38,'AD8F72',8)
    cone((x,y,foot+.42),r*1.28,r*1.22,.18,IVORY,8)
    for side in [-1,1]:
        for back in [-1,1]:
            beam((x+side*r*.76,y+back*r*.6,foot+.46),(x+side*r*.54,y+back*r*.48,cap),r*.145,DARK,8)
        beam((x+side*r*.72,y-r*.58,foot+.54),(x-side*r*.55,y-r*.48,cap-.12),r*.084,BRASS,8)
    band=(foot+cap)/2
    block((x,y,band),(r*1.63,r*1.45,.12),BRASS)
    block((x,y,cap),(r*1.97,r*1.67,.21),DARK,.055)
    block((x,y,cap+.11),(r*2,r*1.72,.08),GOLD,.035)

def cup(p,tint):
    x,y,z=p
    # An actual hollow bowl with a flared opening, a foot and a polished lip.
    profile=[(.39,-.57),(.47,-.56),(.61,-.31),(.83,.01),(.81,.08),(.71,.09),(.59,-.15),(.35,-.31),(.03,-.33)]
    for (r1,h1),(r2,h2) in zip(profile,profile[1:]):
        rows=[[(x+r*math.cos(i*math.tau/48),y+r*math.sin(i*math.tau/48),z+h) for i in range(48)] for r,h in [(r1,h1),(r2,h2)]]
        # Avoid caps across the bowl opening.
        mesh=bpy.data.meshes.new('Spun bowl')
        mesh.from_pydata(rows[0]+rows[1],[],[(i,(i+1)%48,(i+1)%48+48,i+48) for i in range(48)])
        obj=bpy.data.objects.new('Collector',mesh);bpy.context.collection.objects.link(obj)
        finish(obj,tint if h2>=h1 else '416070')
    hoop((x,y,z+.08),.80,.065,GOLD)
    cone((x,y,z-.67),.36,.25,.26,BRASS)
    cone((x,y,z-.86),.66,.54,.14,DARK,12)
    cone((x,y,z-1.18),.61,.54,.58,'CDA97C',10)

def intake(g):
    x,y,z=START
    # An open throat lets the child follow the ball between the retracting plates and the track.
    for side in [-1,1]:
        beam((x+side*.49,y+.18,g.z-.06),(x+side*.91,y+.18,z-.31),.072,BRASS)
        block((x+side*.98,y,z-.39),(.40,.66,.28),DARK,.06)
        block((x+side*.98,y,z-.27),(.44,.68,.08),GOLD,.03)
    hoop((x,y,g.z+.05),.54,.05,TEAL)

def crystal(x,y,z,r,h,color):
    rows=[]
    for height,radius in [(0,.70),(.12,1),(.73,.83),(1,.026)]:
        rows.append([(x+r*radius*math.cos(k*math.tau/6),y+r*radius*math.sin(k*math.tau/6),z+height*h) for k in range(6)])
    solid('Faceted crystal',rows,color)

def mill(x,y,z,r):
    p=Vector((x,y,z))
    for offset in [-.16,.16]:
        hoop(p+Vector((0,offset,0)),r,.095,'A86843','y')
        hoop(p+Vector((0,offset,0)),r*.78,.056,BRASS,'y')
    for i in range(12):
        a=i*math.tau/12;vx,vz=math.cos(a),math.sin(a)
        tip=p+Vector((vx*r,0,vz*r))
        beam(p,tip,.055,BRASS)
        paddle=block(tip,(.15,.63,.38),'BD8350');paddle.rotation_euler.y=-a
    beam((x,y-.47,z),(x,y+.48,z),.20,DARK,24)

def turret(x,y,z,h,roof):
    cone((x,y,z+h/2),.61,.46,h,'E8C79B',12)
    for f in [.12,.69,.93]:cone((x,y,z+h*f),.59,.59,.095,BRASS,12)
    for dx in [-.23,.23]:
        block((x+dx,y-.46,z+h*.80),(.19,.055,h*.19),DARK,.055)
    cone((x,y,z+h+.27),.77,.26,.60,roof,12)
    cone((x,y,z+h+.68),.24,0,.33,GOLD,12)

def arcade(x0,x1,y,level):
    stone=['C6A077','C58C6B','9DADBA'][level-1]
    span=(x1-x0)/3
    crown=-.04
    for i in range(3):
        x=x0+i*span
        rows=[]
        for k in range(31):
            t=k/30
            ceiling=-2.15+1.74*math.sqrt(max(0,1-((t-.5)*2)**2))
            xx=x+t*span
            rows.append([(xx,y-.32,ceiling),(xx,y+.32,ceiling),(xx,y+.32,crown),(xx,y-.32,crown)])
        solid('Old spillway arch',rows,stone)
        for k in range(9):
            segment=[]
            for t in [(k+.04)/9,(k+.5)/9,(k+.96)/9]:
                zz=-2.15+1.74*math.sqrt(max(0,1-((t-.5)*2)**2))
                xx=x+t*span
                segment.append([(xx,y-.35,zz),(xx,y-.31,zz),(xx,y-.31,zz+.14),(xx,y-.35,zz+.14)])
            solid('Arch stone',segment,'F0CD9F')
    block(((x0+x1)/2,y,crown+.03),(x1-x0+.3,.84,.14),IVORY)
    for x in [x0+i*span for i in range(4)]:
        block((x,y,-1.31),(.42,.90,2.45),stone)
        block((x,y,crown+.18),(.48,.92,.18),BRASS)

def falls(x,y,level):
    stone=THEMES[level-1][2]
    rock((x,y+.42,-.55),(1.05,.77,1.65),stone,2)
    rock((x,y+.48,.65),(1.10,.78,.31),THEMES[level-1][3],2)
    for i in range(7):
        xx=x+(i-3)*.14
        pts=[(xx,y+.38,.89),(xx,y+.10,.89),(xx,y-.16,.80),(xx,y-.27,.51),
             (xx,y-.31,-.18),(xx+.035,y-.42,-1.23),(xx+.07,y-.49,WATER_Z+.03)]
        tube('Waterfall ribbon',pts,.085 if i%2 else .10,'B1E8DB' if i%3 else 'EDF7DC')
        rock((xx+.07,y-.48,WATER_Z+.055),(.24,.20,.14),'DDF7EA',2)
    for r in [.55,.83]:
        tube('Rippling foam',[(x+r*math.cos(k*.19),y-.46-r*.42*math.sin(k*.19),WATER_Z+.035) for k in range(17)],.024,'BCDDD4')

def airship(x,y,z,level):
    tint=THEMES[level-1][5]
    balloon=rock((x,y,z),(.49,.47,.62),GOLD,3)
    balloon.data.materials.append(mat(tint))
    for poly in balloon.data.polygons:
        poly.material_index=int((math.atan2(poly.center.y,poly.center.x)+math.pi)*6/math.pi)%2
    for dx in [-.13,.13]:
        beam((x+dx,y,z-.75),(x+dx*2,y,z-.43),.017,IVORY)
    block((x,y,z-.82),(.32,.32,.17),'986641')

# Pivots face world -Y. Foreshortening the spinning plane by cos(elevation)
# keeps the axle fixed in the same camera as the photographed supporting structure.
ROTORS=[(-8.8,2.41,2.72,2.68),(-8.30,.93,.43,3.54),(8.53,3.29,3.70,2.19)]

def rotor(level,x,y,z):
    if level==1:
        for i in range(4):
            a=.42+i*math.pi/2
            tip=(x+1.19*math.cos(a),y,z+1.19*math.sin(a))
            beam((x,y,z),tip,.064,BRASS)
            sail=block((x+.80*math.cos(a),y,z+.80*math.sin(a)),(.80,.08,.23),IVORY)
            sail.rotation_euler.y=-a
        beam((x,y-.12,z),(x,y+.10,z),.15,TEAL,24)
    elif level==2:
        mill(x,y,z,1.48)
    else:
        hoop((x,y,z),.90,.052,GOLD,'y')
        for i in range(4):
            a=math.pi*.25+i*math.pi/2
            end=(x+.89*math.cos(a),y,z+.89*math.sin(a))
            beam((x,y,z),end,.031,BRASS)
            rock(end,(.12,.10,.12),IVORY if i%2 else '79DADD',2)
        beam((x,y-.11,z),(x,y+.12,z),.14,GOLD,20)

def world(level,with_rotor=False):
    sky,water,stone,grass,far,roof=THEMES[level-1]
    rng=random.Random(487+level)
    block((0,-3,WATER_Z-.3),(52,26,.58),water)
    for i in range(60):
        x,y=rng.uniform(-12,12),rng.uniform(-10,8)
        rock((x,y,WATER_Z+.004),(rng.uniform(.12,.55),.04,.014),'C4E5D9')
    for j in range(11):
        x=-15+j*3.02; y=7.8+rng.uniform(-.8,.8); h=rng.uniform(1.45,3.76)
        rings=[]
        for ht,rad in [(0,1),(.56,.68),(.82,.38),(1,.08 if level!=2 else .32)]:
            rings.append([(x+3*rad*math.cos(k*math.tau/7),y+2.25*rad*math.sin(k*math.tau/7),WATER_Z+h*ht) for k in range(7)])
        for i in range(3):solid('Distant headland',rings[i:i+2],[far,grass,IVORY if level==3 else grass][i])
    for a,b in [(-10.6,-3.65),(3.65,10.6)]: arcade(a,b,4.5,level)
    falls(-7.0,.68,level)
    if level!=1: falls(7.1,.71,level)
    airship(4.18,4.8,3.26,level)
    for side in [-1,1]:
        x=side*8.6;y=3.0
        for j,(dx,dy,s) in enumerate([(0,0,2.8),(-.95,.25,1.8),(.95,.55,1.5)]):
            rock((x+dx,y+dy,-1.07),(s,2.05,1.95-j*.19),stone,2)
        rock((x,y,.22),(2.69,1.78,.78),grass,2)
        if level==3:
            for j in range(8):
                crystal(x+rng.uniform(-1.6,1.5),y+rng.uniform(-.7,.9),.43,rng.uniform(.20,.45),rng.uniform(.9,2.65),rng.choice(['59B2C1','9D8CC7','C0DDE7']))
        else:
            for j in range(6):
                xx=x+rng.uniform(-2,1.9);yy=y+rng.uniform(-.6,1.1)
                cone((xx,yy,1.22),.32,.012,1.09,'4C897A' if level==1 else '728779',9)
    for x,y in [(-8.8,3.2),(8.5,3.6)]:
        turret(x,y,.62,2.45 if level==1 else 2.04,roof)
    x,y,z,_=ROTORS[level-1]
    beam((x,y+.75,z),(x,y,z),.14,DARK,24)
    if with_rotor: rotor(level,x,y,z)
    if level==3:
        hoop((x,y+.23,z),.99,.055,IVORY)
        crystal(x,y+.17,z-.43,.27,.90,'80E0DE')
    for x,y,z in [(-5.25,5.9,3.05),(2.43,6.8,2.45),(7.1,6.0,2.87)]:
        for j in range(3): rock((x+j*.42,y,z+(j%2)*.10),(.63,.32,.27),'FFF0D7',2)
    return sky

def machine(level,complete=False):
    gates,cups=layout(level)
    for i,g in enumerate(gates):
        tower(g,.68)
        cone(g+Vector((0,0,-.25)),.56,.62,.18,TEAL,32)
        hoop(g+Vector((0,0,-.15)),.57,.055,GOLD)
    intake(gates[0])
    for i,p in enumerate(cups): cup(p,CUPS[i])
    for i,side,pts,to in routes(gates,cups):
        chute(pts,0 if complete else 9,32,PLAY_GAUGE,BED_DROP)
        for k in ([13,27] if abs(pts[0].x-to.x)>3 else [20]):
            # Keep the horizontal pedestal below the sloping bed, with a narrow mounting pin.
            saddle=pts[k]-Vector((0,0,BED_DROP))
            tower(saddle-Vector((0,0,.54)),.49)
            beam(saddle-Vector((0,0,.76)),saddle-Vector((0,0,.33)),.13,BRASS)

def marble(p,r):
    p=Vector(p)
    body=rock(p,(r,r,r),'238AA9',4)
    for poly in body.data.polygons: poly.use_smooth=True
    surface=mat('238AA9').node_tree.nodes.get('Principled BSDF')
    surface.inputs['Roughness'].default_value=.12
    surface.inputs['Metallic'].default_value=.48
    for j,color in enumerate([GOLD,'76E4D1',IVORY]):
        pts=[]
        for k in range(60):
            lat=-1.4+k*2.8/59
            lon=j*math.tau/3+lat*1.9
            pts.append(p+Vector((math.cos(lat)*math.cos(lon),math.cos(lat)*math.sin(lon),math.sin(lat)))*r)
        tube('Marble swirl',pts,r*.05,color)

def export_level(level):
    clear()
    sky=world(level)
    machine(level)
    bake(ART/f'level-{level}.png',sky=sky)
    gates,cups=layout(level)
    tracks=[[] for _ in gates]
    for i,side,pts,to in routes(gates,cups):
        tracks[i].append([project(p) for p in pts])
    return dict(intake=project(START),gates=list(map(project,gates)),cups=list(map(project,cups)),tracks=tracks)

def goal_star(center, radius):
    # The emblem faces the orthographic camera, so all five points survive at card size.
    toward = Vector((0, -math.cos(ANGLE), math.sin(ANGLE)))
    up = Vector((0, math.sin(ANGLE), math.cos(ANGLE)))
    center = Vector(center)

    def outline(size, depth):
        points = []
        for i in range(10):
            angle = math.pi / 2 + i * math.pi / 5
            r = size * (1 if i % 2 == 0 else .47)
            points.append(center + Vector((math.cos(angle)*r, 0, 0)) + up*math.sin(angle)*r + toward*depth)
        return points

    solid('Ivory enamel edge', [outline(radius*1.16, -.12), outline(radius*1.16, -.04)], IVORY, .035)
    solid('Midnight star outline', [outline(radius*1.10, -.035), outline(radius*1.10, .065)], '20374F', .018)
    rim = outline(radius, .09)
    mesh = bpy.data.meshes.new('Five-point gold face')
    mesh.from_pydata(rim + [center + toward*.31], [], [(i,(i+1)%10,10) for i in range(10)])
    obj = bpy.data.objects.new('Faceted destination star',mesh)
    bpy.context.collection.objects.link(obj)
    mesh.materials.append(mat('FFE25A'))
    mesh.materials.append(mat('F2AD27'))
    for face in mesh.polygons:
        face.material_index = face.index % 2

def render_practice():
    # A smaller working cutaway of the same machine, calibrated to the trainer's 300 x 200 view.
    clear()
    def point(px,py,depth):
        return Vector(((px-150)/37.5,depth,.55+((100-py)/37.5-depth*math.sin(ANGLE))/math.cos(ANGLE)))
    fork=point(137,91,0)
    block((0,0,-2.70),(14,18,.36),'89B7AD',.15)
    tower(fork,.51,foot=-2.50)
    for side in [-1,1]:
        cup_x=137+side*95
        path=[]
        for k in range(21):
            t=k/20
            path.append(point(137+side*95*t,91+61*(.75*t+.25*math.sin(math.pi*t/2)),-.9*t))
        chute(path,6,20,width=1.14,drop=.10)
        tower(path[14]-Vector((0,0,.35)),.31,foot=-2.50)
        before=set(bpy.context.scene.objects)
        cup(Vector((0,0,0)),CUPS[0] if side==1 else CUPS[1])
        parts=set(bpy.context.scene.objects)-before
        stand=bpy.data.objects.new('Practice collector',None)
        bpy.context.collection.objects.link(stand)
        stand.location=point(cup_x,174,-.90)
        stand.scale=(.77,.77,.60)
        for obj in parts: obj.parent=stand
        beam(point(137+side*19,89,0),point(137+side*27,40,0),.065,BRASS)
    bake(ART/'practice.png',(600,400),(0,0,.55),8,sky='D2EBDF')

def render_cover():
    clear()
    # A toy-sized S bend keeps the marble, the route and its destination legible as silhouettes.
    for z, height, radius, color in [(-.99,.32,3.66,'234A59'),(-.79,.11,3.69,BRASS),(-.62,.24,3.66,'39A9A7')]:
        base = cone((0,-.11,z),radius,radius,height,color,64)
        base.scale.y = .70
    # Constant-radius hairpins give both brass rails room through each turn.
    radius=.92
    xy=[(-2.55+i*3.15/12,2.12) for i in range(13)]
    for i in range(1,25):
        a=math.pi/2-math.pi*i/24
        xy.append((.6+radius*math.cos(a),1.20+radius*math.sin(a)))
    xy.extend([(.6-1.88*i/9,.28) for i in range(1,10)])
    for i in range(1,25):
        a=math.pi/2+math.pi*i/24
        xy.append((-1.28+radius*math.cos(a),-.64+radius*math.sin(a)))
    xy.extend([(-1.28+3.15*i/13,-1.56) for i in range(1,14)])
    distances=[0.]
    for a,b in zip(xy,xy[1:]):
        distances.append(distances[-1]+math.dist(a,b))
    pts=[Vector((x,y,2.95-1.99*s/distances[-1])) for (x,y),s in zip(xy,distances)]
    chute(pts,0,len(pts)-1,width=1.65)
    for k in [2,19,43,60,78]:
        tower(pts[k]-Vector((0,0,.23)),.46,foot=-.51)
    marble(pts[2]+Vector((0,0,.60)),.80)
    # Enlarge the collector as one assembly, including its recessed interior and brass rim.
    before=set(bpy.context.scene.objects)
    cup(Vector((0,0,0)),'D76D45')
    parts=set(bpy.context.scene.objects)-before
    collector=bpy.data.objects.new('Destination cup',None)
    bpy.context.collection.objects.link(collector)
    collector.location=(2.07,-1.40,.68)
    collector.scale=(1.47,1.47,.83)
    for obj in parts: obj.parent=collector
    beam((2.22,-.58,.67),(2.22,-.58,2.38),.10,BRASS)
    goal_star((2.22,-.58,2.54),.98)
    bake(ROOT/'public/games/hub/marble-run.png',(720,720),(0,0,1.77),8.10)

ART.mkdir(parents=True,exist_ok=True)
OUT.mkdir(parents=True,exist_ok=True)
if '--practice' in sys.argv:
    render_practice()
    sys.exit(0)
if '--cover' in sys.argv:
    render_cover()
    sys.exit(0)
render_practice()
courses=[export_level(level) for level in (1,2,3)]
rotors=[]
for level,(x,y,z,size) in enumerate(ROTORS,1):
    clear()
    rotor(level,0,0,0)
    render(ART/f'rotor-{level}.png',(192,192),(0,0,0),size,elevation=0)
    rotors.append(dict(pivot=project((x,y,z)),width=round(size*960/WIDTH,2),height=round(size*960/WIDTH*math.cos(ANGLE),2)))
metadata=dict(courses=courses[:2],rotors=rotors)
(DATA/'marble-course.json').write_text(json.dumps(metadata,separators=(',',':'))+'\n',encoding='utf-8')
# The two advanced stages share switch geometry. Each transparent layer contains one direction per junction.
for level in [1,2]:
    gates,cups=layout(level)
    for side,label in enumerate(['left','right']):
        clear()
        for _,s,pts,_ in routes(gates,cups):
            if side==s:chute(pts,0,9,PLAY_GAUGE,BED_DROP)
        bake(ART/f'switch-{level}-{label}.png')
clear()
marble((0,0,0),.41)
bake(ART/'marble.png',(144,144),(0,0,0),.92)
render_cover()
clear()
sky=world(3,with_rotor=True)
machine(3,True)
marble(START,.50)
bake('//marble-viaduct.png',sky=sky,project=OUT/'marble-viaduct.blend')
