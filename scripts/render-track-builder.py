"""Bake the railway's orthographic scenery and locomotive. Run with blender -b -P this_file."""
import json
import math
import random
import sys
from pathlib import Path

import bpy
from functools import partial

sys.path.insert(0, str(Path(__file__).resolve().parent / 'lib'))
from blender_toys import mat, block, cone, beam, rock, solid, clear, render as render_toy

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / "src/features/games/data/railway.json").read_text())
ART = ROOT / "public/games/track-builder"
FRAMES = ROOT / "output/track-builder/frames"
ART.mkdir(exist_ok=True)
FRAMES.mkdir(parents=True, exist_ok=True)
ANGLE = math.radians(DATA["cameraAngle"])
render = partial(render_toy, elevation=ANGLE)
OCEAN = -1.62
GOLD, INK, CREAM = "F3B747", "244154", "FFF1CF"
THEMES = [
    ("419A94", "76B968", "C19068", "286D69", "A4E2F5", "AD704A"),
    ("5FA7A6", "DFA262", "B96F52", "647E60", "BBD4DC", "A9563C"),
    ("68B8CC", "ECF7F5", "8599AD", "517D8D", "BFDCEF", "747F98"),
]


def course(route, span, t):
    x = DATA["startX"]+(span+t)*DATA["span"]
    y = route["startY"]+DATA["rise"]*(sum(route["steps"][:span])+route["steps"][span]*t*t*(3-2*t))
    slope = DATA["rise"]*route["steps"][span]*6*t*(1-t)/DATA["span"]
    length = math.hypot(1,slope)
    return x,y,-slope/length,1/length


def section(route,span,t,back,front,bottom,top):
    x,y,nx,ny = course(route,span,t)
    return [(x+nx*d,y+ny*d,z) for d,z in [(front,bottom),(back,bottom),(back,top),(front,top)]]


def viaduct(route, stone):
    deck = DATA["railZ"]-.10
    for i in range(len(route["steps"])):
        def underside(t):
            return -.3+1.85*math.sqrt(max(0,1-((t-.5)/.50)**2))
        solid("Masonry arch",[section(route,i,j/24,.62,-.62,underside(j/24),deck-.18) for j in range(25)],stone)
        solid("Cut stone cornice",[section(route,i,j/24,.71,-.71,deck-.24,deck) for j in range(25)],"F3C895",.018)
        solid("Track bed",[section(route,i,j/24,.56,-.56,deck,deck+.025) for j in range(25)],"B28E70")
        for j in range(13):
            # The keystone and individual voussoirs follow the real arch opening.
            a,b=(j+.025)/13,(j+.975)/13
            solid("Dressed voussoir",[section(route,i,t,-.625,-.67,underside(t),underside(t)+.19) for t in (a,(a+b)/2,b)],
                  "F4CA9C" if j%3 else "E1AF82")
        for t in ([0,1] if i==6 else [0]):
            x,y,_,_=course(route,i,t)
            block((x,y,.06),(.43,1.35,3.6),stone,.055)
            block((x,y,-1.11),(.62,1.58,.7),"9E795F",.09)
            block((x,y,1.68),(.55,1.46,.19),"F8D4A5")
            block((x,y-.70,.25),(.19,.06,2.52),"E2B186",.025)


def pine(x,y,z,h,snow=False):
    cone((x,y,z+.20*h),.075*h,.05*h,.4*h,"96684A",10)
    for base,r,hh,tint in [(.18,.33,.47,"276A63"),(.40,.27,.44,"348575"),(.61,.19,.39,"51A381")]:
        cone((x,y,z+(base+hh/2)*h),r*h,.008,hh*h,tint,9)
        if snow:
            cone((x,y,z+(base+.65*hh)*h),r*.76*h,.008,.76*hh*h,"F2F7EE",9)


def station(x,y,z,roof):
    block((x,y,z+.12),(2.55,1.36,.24),"E0BC8D",.08)
    block((x,y+.13,z+.62),(1.9,.83,1.03),"FFE6AE")
    for dx in [-.63,-.18,.51]:
        block((x+dx,y-.306,z+.68),(.28,.045,.54),"41666F")
        block((x+dx,y-.34,z+.68),(.034,.035,.54),"F9CB8C",.008)
    for sign in [-1,1]:
        slab=block((x,y+.13+sign*.32,z+1.25),(2.22,.76,.13),roof)
        slab.rotation_euler.x=-sign*.38
    block((x+.67,y+.14,z+1.49),(.21,.23,.57),"AE7755")
    for dx in [-.95,.95]:
        beam((x+dx,y-.53,z+.22),(x+dx,y-.53,z+1.05),.046,"315961")
    block((x,y-.55,z+1.06),(2.24,.56,.10),"58A39A")
    # A brass station clock, readable as a landmark from either end of the bridge.
    px=x-.86
    block((px,y+.12,z+1.33),(.50,.51,1.06),CREAM)
    cone((px,y+.12,z+2.01),.47,.06,.46,roof,4).rotation_euler.z=math.pi/4
    beam((px,y-.14,z+1.61),(px,y-.19,z+1.61),.182,GOLD,32)
    beam((px,y-.19,z+1.61),(px,y-.21,z+1.61),.144,CREAM,32)
    beam((px,y-.23,z+1.61),(px,y-.23,z+1.71),.014,INK)
    beam((px,y-.23,z+1.61),(px+.08,y-.23,z+1.58),.014,INK)


def engine():
    # Model at wheel contact height zero, nose towards world +X.
    block((0,0,.42),(2.45,.91,.18),"B84639")
    block((.18,0,.57),(1.65,.75,.20),INK)
    beam((-.42,0,.85),(1.05,0,.85),.35,"168F8D",48)
    for x in [-.35,.12,.66,1.06]:
        beam((x-.032,0,.85),(x+.032,0,.85),.365,GOLD,48)
    beam((1.08,0,.85),(1.17,0,.85),.325,INK,40)
    beam((1.17,0,.88),(1.22,0,.88),.19,GOLD)
    beam((1.22,0,.88),(1.25,0,.88),.14,CREAM)
    cone((.73,0,1.31),.095,.15,.40,INK)
    cone((.73,0,1.53),.17,.18,.08,GOLD)
    rock((.04,0,1.23),(.18,.18,.16),GOLD,2)
    block((-.82,0,.67),(.70,.85,.4),"167A7D")
    for x in [-1.11,-.53]:
        for y in [-.365,.365]:
            block((x,y,1.12),(.095,.10,.72),"EAC182",.018)
    block((-.82,0,1.53),(.94,1.05,.19),"174E60",.08)
    block((-.82,0,1.44),(.98,1.09,.048),GOLD,.015)
    for side in [-1,1]:
        y=side*.45
        for x in [-.83,-.20,.48,.91]:
            r=.285 if x<.7 else .20
            beam((x,y-side*.09,r),(x,y+side*.04,r),r,INK,32)
            beam((x,y+side*.042,r),(x,y+side*.063,r),r*.77,"B64236",32)
            for a in range(0,180,45):
                dx,dz=r*.61*math.cos(math.radians(a)),r*.61*math.sin(math.radians(a))
                beam((x-dx,y+side*.068,r-dz),(x+dx,y+side*.068,r+dz),.02,GOLD,8)
        beam((-.83,y+side*.09,.27),(.49,y+side*.09,.27),.044,"D5B091")
    block((1.24,0,.34),(.16,1.02,.15),"C94C3E")
    for y in [-.31,.31]:
        beam((1.22,y,.34),(1.4,y,.34),.065,INK)


def coach():
    block((0,0,.4),(1.85,.86,.16),"9E4838")
    block((0,0,.77),(1.68,.79,.63),"297B85",.07)
    for side in [-1,1]:
        for x in [-.61,-.20,.21,.61]:
            block((x,side*.402,1.04),(.31,.045,.39),"F5CC84",.035)
            block((x,side*.431,1.04),(.24,.032,.31),"3B6577",.025)
        block((0,side*.412,.66),(1.60,.026,.075),GOLD,.01)
        for x in [-.60,.6]:
            beam((x,side*.34,.22),(x,side*.45,.22),.22,INK,32)
            beam((x,side*.45,.22),(x,side*.47,.22),.13,"C98955",24)
    block((0,0,1.29),(1.87,.97,.18),INK,.08)
    block((0,0,1.23),(1.90,.99,.045),GOLD,.018)


def mesh_group(make, pos, angle=0, scale=1):
    before=set(bpy.context.scene.objects)
    make()
    new=set(bpy.context.scene.objects)-before
    group=bpy.data.objects.new("Assembly",None)
    bpy.context.collection.objects.link(group)
    for obj in new:
        obj.parent=group
    group.location=pos
    group.rotation_euler.z=angle
    group.scale=(scale,)*3
    return group


def landscape(route, level):
    water,grass,stone,deep,sky,arch=THEMES[level]
    rng=random.Random(92+level)
    block((0,-2.4,OCEAN-.21),(52,19,.4),water)
    for j in range(120):
        x,y=rng.uniform(-12,12),rng.uniform(-9,10)
        rock((x,y,OCEAN-.004),(rng.uniform(.08,.38),.036,.016),"BFE7DD")
    for x,y,z in [(-7.4,9,2.2),(-2.6,8.7,2.28),(6.6,9.1,1.9)]:
        for j in range(4):
            rock((x+j*.31,y,z+.14*math.sin(math.pi*j/3)),(.43,.26,.23+.06*(j%2)),"FFF1D9",2)
    for i in range(13):
        x=-13+i*2.25
        y=rng.uniform(4.7,6.7)
        h=rng.uniform(3.2,5.4)
        width=rng.uniform(1.6,2.9)
        # Jagged layered peaks have visible seams and a snow/sandstone cap.
        rings=[]
        count=9
        radii=[rng.uniform(.75,1.15) for _ in range(count)]
        crown=.44 if level==1 else .08
        lean=rng.uniform(-.65,.65)
        palette=([deep,"5D9382","BCD3BB","F5F3DA"] if level==0 else
                 ["BF795E","D48865","DC946A","F7B774"] if level==1 else
                 ["577D8D","86A4B4","BCCFD6","EFF7F4"])
        for q,(height,radius) in enumerate([(0,1),(.31,.86),(.55,.61),(.74,.41),(1,crown)]):
            ring=[]
            for j in range(count):
                a=2*math.pi*j/count+.12*i
                variation=rng.uniform(-.055,.055) if q in [1,2,3] else 0
                ring.append((x+lean*height+width*radius*radii[j]*math.cos(a),
                             y+.72*width*radius*radii[j]*math.sin(a),
                             OCEAN+h*(height+variation)))
            rings.append(ring)
        for j in range(4):
            solid("Alpine ridge",rings[j:j+2],palette[j])



    for x,y,s in [(-7,3.8,2.5),(-2.4,4.2,2.2),(4.7,4.7,2.1),(9,4.3,2.1),(-10,-4.6,2.4),(10,-5.0,2.6)]:
        rock((x,y,OCEAN-.2),(s,1.35,.94),stone,2)
        rock((x,y,OCEAN+.19),(s*.9,1.18,.67),grass,2)
        for j in range(5):
            pine(x+rng.uniform(-s*.65,s*.65),y+rng.uniform(-.46,.46),OCEAN+.62,rng.uniform(.65,1.5),level==2)
    # Two tall banks carry the terminals. Beyond them the bridge stands free over the gorge.
    for side, t in [(-1,0),(1,1)]:
        span=0 if side==-1 else 6
        x,y,_,_=course(route,span,t)
        for k in range(3):
            rock((x+side*.65,y+.84,-.6+k*.86),(2.42-k*.16,2.12-k*.08,1.29-k*.20),
                 stone if k!=1 else arch,2)
        for j in range(6):
            px=x+side*rng.uniform(.2,1.38)
            py=y+rng.uniform(-1.18,-.65)
            rock((px,py,OCEAN+.14),(.39,.31,.37),stone,2)
        block((x+side*.40,y+.8,1.93),(3.33,3.30,.30),grass,.14)
        station(x+side*.05,y+1.18,2.04,"B4513C" if side<0 else "25747B")
    viaduct(route,arch)
    # Falls behind the viaduct. Thin bright ribbons and foam catch the sunlight.
    for x in [[-4.7], [3.85], [-3.2,5.2]][level]:
        y=3.30
        rock((x,y+1.25,-.35),(1.55,1.15,1.65),stone,2)
        rock((x,y+1.30,1.06),(1.39,1.04,.30),grass,2)
        for k in range(5):
            px=x+(k-2)*.15
            top=1.28-.06*abs(k-2)
            solid("Cascade", [[(px+a,yy,zz+b) for a,b in [(-.09,0),(.09,0),(.09,-.06),(-.09,-.06)]]
                for yy,zz in [(y+.63,top),(y+.18,top-.06),(y-.04,top-.29),(y-.21,-.38),(y-.37,OCEAN+.04)]],
                "DEF8ED" if k%3==0 else "83D7DA")
            rock((px,y-.37,OCEAN),(.24,.19,.12),"D6F6ED",2)
    for px,py in [(-5.3,-3.0),(6.1,-2.4),(-2.4,-5.3),(3.1,-4.9)]:
        rock((px,py,OCEAN),(.64,.36,.26),stone)
        rock((px+.51,py-.13,OCEAN),(.27,.21,.16),grass)
    # Small striped balloon in the far sky.
    x,y,z=4.55,5,3.0
    obj=rock((x,y,z),(.43,.43,.58),GOLD,2)
    obj.data.materials.append(mat("E67347"))
    for poly in obj.data.polygons:
        poly.material_index=int(math.atan2(poly.center.y,poly.center.x)*6/math.pi)%2
    block((x,y,z-.79),(.23,.19,.16),"975D40",.025)
    for dx in [-.09,.09]:
        beam((x+dx,y,z-.74),(x+dx*2,y,z-.39),.013,INK,8)
    return sky


def export_model():
    clear()
    route=DATA["routes"][0]
    sky=landscape(route,0)
    for i in range(7):
        for j in range(8):
            x,y,nx,ny=course(route,i,(j+.5)/8)
            sleeper=block((x,y,2.11),(.12,.98,.065),"986943",.018)
            sleeper.rotation_euler.z=math.atan2(-nx,ny)
        for d in [-DATA["gauge"]/2, DATA["gauge"]/2]:
            pts=[]
            for j in range(17):
                x,y,nx,ny=course(route,i,j/16)
                pts.append((x+nx*d,y+ny*d,DATA["railZ"]))
            for a,b in zip(pts,pts[1:]):
                beam(a,b,.035,"4C585B",8)
    for make,distance in [(engine,3.62),(coach,2.72)]:
        i=int(distance)
        x,y,nx,ny=course(route,i,distance-i)
        mesh_group(make,(x,y,DATA["railZ"]+.03),math.atan2(-nx,ny))
    render("//valley-express.png",(1280,640),(0,0,DATA["cameraZ"]),DATA["cameraWidth"],sky=sky,
           project=ROOT/"output/track-builder/valley-express.blend")


if __name__=='__main__' and '--blend' in sys.argv:
    export_model()
elif __name__=='__main__':
    for i,route in enumerate(DATA["routes"]):
        clear()
        sky=landscape(route,i)
        render(ART/(route["scene"]+".png"),(1280,640),(0,0,DATA["cameraZ"]),DATA["cameraWidth"],sky=sky)
    clear()
    train=mesh_group(engine,(0,0,0))
    for i,angle in enumerate([-48,-24,0,24,48]):
        train.rotation_euler.z=math.radians(angle)
        render(FRAMES/f"{i}.png",(224,224),(0,0,.66),3.35)
    clear()
    carriage=mesh_group(coach,(0,0,0))
    for i,angle in enumerate([-48,-24,0,24,48]):
        carriage.rotation_euler.z=math.radians(angle)
        render(FRAMES/f"{i+5}.png",(224,224),(0,0,.66),3.35)
    clear()
    block((0,0,-.35),(6.45,4.18,.58),"9B7252",.28)
    block((0,0,-.09),(6.5,4.20,.22),"65B9B5",.18)
    for x in [-2.04,0,2.04]:
        block((x,-.14,.66),(.50,1.18,1.4),"BD885F",.1)
        block((x,-.14,.14),(.73,1.42,.23),"ECC394",.06)
    block((0,-.14,1.3),(5.54,1.28,.32),"EDBD83",.08)
    for x in [-2.6+j*.29 for j in range(19)]:
        block((x,-.14,1.50),(.13,1.02,.10),"875C47",.025)
    for y in [-.49,.21]:
        beam((-2.71,y,1.56),(2.71,y,1.56),.055,INK)
    mesh_group(engine,(.24,-.14,1.61),0,1.61)
    for x,y,h in [(-2.4,.9,2.0),(-1.7,1.1,1.6),(2.30,1.1,1.75)]:
        rock((x,y,.12),(.78,.64,.35),"92BB77",2)
        pine(x,y,.32,h)
    for i in range(3):
        rock((1.40-i*.34,-.14,4.24+i*.22),(.17+i*.07,.16+i*.06,.15+i*.045),"F5EACF",2)
    render(ROOT/"public/games/hub/track-builder.png",(720,720),(0,0,1.75),8.35,.42)
