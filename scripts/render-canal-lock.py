"""Bake the canal and tug with the railway's orthographic toy camera.

Run blender -b -P scripts/render-canal-lock.py, then run scripts/optimize-images.mjs
with public/games/canal-lock and with public/games/hub canal-lock.png.
"""
import json
import math
import random
import sys
from pathlib import Path

import bpy

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
from blender_toys import beam, block, clear, cone, finish, render, rock, solid

ROOT = Path(__file__).resolve().parents[1]
MASTERS = ROOT / "public/games/canal-lock"
MASTERS.mkdir(parents=True, exist_ok=True)
ANGLE = math.radians(json.loads((ROOT / "src/features/games/data/railway.json").read_text())["cameraAngle"])
SCALE = 40  # Board pixels per world unit on the camera's horizontal axis.
DEPTH = 37 / (SCALE * math.sin(ANGLE))
GATE_X = 176 / SCALE
STEP_Z = 28 / (SCALE * math.cos(ANGLE))
BASE_Z = -38 / (SCALE * math.cos(ANGLE))
TARGET_Z = 70 / (SCALE * math.cos(ANGLE))
NAVY, GOLD, IVORY = "254859", "F1AE43", "FFF0CE"
TEAL, RED = "198C8D", "CE5A43"


def ring(pos, radius, tube, color):
    bpy.ops.mesh.primitive_torus_add(major_radius=radius, minor_radius=tube,
                                    major_segments=32, minor_segments=10,
                                    location=pos, rotation=(math.pi/2, 0, 0))
    return finish(bpy.context.object, color)


def group(builder, pos, scale=1, rotation=0):
    previous=set(bpy.context.scene.objects)
    builder()
    anchor=bpy.data.objects.new("Toy assembly", None)
    bpy.context.collection.objects.link(anchor)
    for obj in set(bpy.context.scene.objects)-previous-{anchor}:
        obj.parent=anchor
    anchor.location=pos
    anchor.scale=(scale,)*3
    anchor.rotation_euler.z=rotation


def tug():
    profile=[(-1.57,.25),(-1.39,.59),(-1.02,.67),(.62,.67),(1.12,.52),(1.51,.20),(1.62,.04)]
    def shell(bottom, top, low, high, color):
        rows=[[(x,-w*low,bottom),(x,w*low,bottom),(x,w*high,top),(x,-w*high,top)] for x,w in profile]
        solid("Curved tug hull", rows, color, .026)
    shell(.02,.15,.79,.93,"A53E35")
    shell(.15,.4,.93,1,NAVY)
    shell(.4,.445,1,1.015,IVORY)
    shell(.445,.495,1.015,1.02,"CE9868")
    block((-.27,0,.67),(1.41,.91,.40),TEAL,.09)
    block((-.30,0,.94),(1.17,.90,.30),IVORY,.045)
    block((-.32,0,1.17),(1.08,.81,.37),"F9D990",.06)
    for side in (-1,1):
        for x in [-.65,-.32,.02]:
            block((x,side*.411,1.19),(.26,.035,.23),"326476",.035)
    block((.234,0,1.18),(.04,.69,.23),"325D70",.03)
    block((-.3,0,1.41),(1.37,1.05,.12),RED,.075)
    block((-.3,0,1.35),(1.40,1.09,.035),IVORY,.024)
    cone((-.58,0,1.62),.155,.135,.36,GOLD)
    cone((-.58,0,1.81),.17,.185,.11,NAVY)
    cone((-.14,.05,1.58),.035,.035,.25,IVORY)
    rock((-.14,.05,1.73),(.075,.075,.085),"FFAD3B",2)
    for x in [-1.16,.70]:
        for side in [-1,1]:
            ring((x,side*.64,.36),.117,.042,NAVY)
            beam((x,side*.64,.48),(x,side*.60,.53),.02,"D9AA76")
    ring((-.29,-.481,.76),.15,.044,IVORY)
    for dx,dz in [(0,.151),(0,-.151),(.151,0),(-.151,0)]:
        rock((-.29+dx,-.483,.76+dz),(.042,.051,.042),RED,2)
    for x,w in [(.71,.46),(1.05,.35),(1.34,.18)]:
        for side in [-1,1]:
            beam((x,side*w,.49),(x,side*w,.72),.027,IVORY)
    for side in [-1,1]:
        beam((.71,side*.46,.73),(1.36,side*.18,.73),.027,GOLD)
    cone((1.05,0,.55),.11,.11,.11,NAVY)


def pine(x,y,z,h, snow=False):
    cone((x,y,z+.18*h),.066*h,.057*h,.36*h,"886149",9)
    for base,r,hh,col in [(.12,.33,.5,"33766D"),(.35,.28,.44,"408979"),(.57,.19,.43,"60A589")]:
        cone((x,y,z+(base+hh/2)*h),r*h,.016*h,hh*h,col,9)
        if snow:
            cone((x,y,z+(base+.67*hh)*h),r*.70*h,.013*h,.69*hh*h,"E5F4EA",9)


def lighthouse():
    cone((0,0,.16),.62,.57,.32,"CFB38A")
    for z,r1,r2,h,color in [(.62,.47,.43,.70,IVORY),(1.25,.43,.365,.58,RED),
                              (1.83,.36,.32,.58,IVORY),(2.18,.45,.46,.12,NAVY),
                              (2.41,.30,.30,.38,"FFE194"),(2.64,.49,.13,.23,RED)]:
        cone((0,0,z),r1,r2,h,color,24)
    for x in [-.20,.20]:
        for y in [-.20,.20]:
            beam((x,y,2.22),(x,y,2.60),.029,NAVY)
    block((0,-.46,.61),(.23,.08,.44),TEAL,.09)
    cone((0,0,2.84),.065,.018,.21,GOLD)


def quay_house(x,y,z,roof,scale=1):
    def house():
        block((0,0,.40),(1.65,1.1,.8),"F2C998",.075)
        for sx in [-.6,-.25,.4]:
            block((sx,-.559,.46),(.23,.06,.32),NAVY,.028)
            block((sx,-.592,.47),(.16,.035,.23),"70B5BB",.023)
        for s in [-1,1]:
            tile=block((0,s*.34,.99),(1.93,.83,.15),roof,.05)
            tile.rotation_euler.x=-s*.48
        beam((-.98,0,1.17),(.98,0,1.17),.068,IVORY)
        block((.62,.16,1.28),(.22,.25,.42),NAVY,.03)
    group(house,(x,y,z),scale,.12)


def mill():
    cone((0,0,1),.62,.4,2,"E6BD87",12)
    cone((0,0,2.13),.53,.04,.34,"A7523D",12)
    for j in range(4):
        a=.52+j*math.pi/2
        tip=(math.cos(a),-.51,1.73+math.sin(a))
        beam((0,-.53,1.73),tip,.045,NAVY)
        vane=block((.68*math.cos(a),-.54,1.73+.68*math.sin(a)),(.71,.075,.22),IVORY,.023)
        vane.rotation_euler.y=-a
    beam((0,-.56,1.73),(0,-.68,1.73),.12,GOLD)


def tower(x, y, deck):
    # Fixed back guide column. The near side is kept clear for the moving gate.
    block((x,y,deck+.15),(.86,.70,.32),"D0AF86",.07)
    block((x,y,deck+.74),(.63,.49,1.0),TEAL,.055)
    for dx in [-.235,.235]:
        block((x+dx,y-.26,deck+.76),(.07,.08,.97),IVORY,.018)
    block((x,y,deck+1.27),(.82,.67,.16),NAVY,.045)
    cone((x,y,deck+1.45),.22,.16,.27,GOLD)
    cone((x,y,deck+1.62),.16,.07,.08,"FDE7A4")
    ring((x,y-.294,deck+.85),.16,.04,GOLD)
    for a in [0,math.pi/2]:
        dx,dz=.14*math.cos(a),.14*math.sin(a)
        beam((x-dx,y-.30,deck+.85-dz),(x+dx,y-.30,deck+.85+dz),.023,IVORY)


def pool(start,end,h,rng):
    z=STEP_Z*h
    column_top=z-.047
    block(((start+end)/2,0,(column_top+BASE_Z)/2),(end-start,2*DEPTH,column_top-BASE_Z),"239AB1",.014)
    block(((start+end)/2,0,z-.023),(end-start,2*DEPTH,.046),"4DBABC",.012)
    for _ in range(int(4*(end-start))):
        x,y=rng.uniform(start+.22,end-.22),rng.uniform(-DEPTH+.16,DEPTH-.16)
        block((x,y,z+.006),(rng.uniform(.14,.40),rng.uniform(.022,.044),.013),rng.choice(["85D6D2","72CBCB","B3E4DA"]),.011)
    for _ in range(int(end-start)*2):
        x = rng.uniform(start+.22,end-.22)
        block((x,-DEPTH-.003,rng.uniform(BASE_Z+.15,z-.13)),(.12,.015,.035),"54A6B5",.006)


def landscape(level):
    rng=random.Random(870+level)
    grass,stone,cap,sky=[
        ("87BB73","B38E72","F0C28D","A6E1ED"),
        ("A7B16B","BC8166","EAC08A","A6DBE6"),
        ("A3C8BB","7891A0","C5D6CA","AEDCEC")][level-1]
    # Layered mountains and scattered buildings give the railway's camera a sense of scale.
    for i in range(13):
        x=-17+i*2.9
        y=rng.uniform(6.8,8)
        h=rng.uniform(2.0,3.3)
        rock((x,y,.22),(rng.uniform(2.2,3.1),1.8,h),stone,1)
        rock((x-.12,y,.22+h*.54),(1.76,1.27,h*.52),cap if level!=1 else "83AC8A",1)
        if level==3:
            rock((x-.24,y,.22+h*.85),(1.35,.9,h*.28),"EEF5E9",1)
    for x,y,z in [(-8,9,3.05),(.70,10,2.85),(7.0,9,3.50)]:
        for dx,dz,scale in [(-.46,0,.48),(0,.16,.58),(.52,.025,.41)]:
            rock((x+dx,y,z+dz),(scale,.32,scale*.49),"EDF7E9",2)
    block((0,4.6,.56),(35,5.7,2.53),stone,.25)
    block((0,4.55,1.90),(35,5.46,.28),grass,.11)
    block((0,2.12,1.95),(31,.83,.23),cap,.05)
    for i in range(33):
        x=-15+i*.95
        for row in range(3):
            block((x+.45*(row%2),DEPTH+.055,.25+row*.58),(.91,.16,.53),
                  rng.choice([cap,stone,"D3AC86" if level<3 else "B2C4BF"]),.04)
    for i in range(7):
        x=-13+i*4.4+rng.uniform(-.8,.8)
        if abs(x-3.4)>1.2:
            for dx in [-.43,.53]:
                pine(x+dx,4.6+rng.uniform(0,1.8),2.02,rng.uniform(.9,1.9),level==3)
    for x,y,sc in [(-10,3.5,1.14),(2.8,3.3,.80),(10.6,4.2,1.0)]:
        quay_house(x,y,2.02,RED if level!=2 else TEAL,sc)
    group(mill if level==2 else lighthouse,(-6.75,3.7,2.04),1.21)
    for x in [-3.12,-2.30,1.72,5.89,7.12]:
        cone((x,1.98,2.20),.116,.116,.30,NAVY)
        cone((x,1.98,2.37),.149,.149,.07,GOLD)
    for x in [-8.5,-1.4,6.7]:
        for n in range(5):
            col=rng.choice(["F5C365","D99870","F2E6AE"])
            px,py=x+rng.uniform(-.52,.52),2.65+rng.uniform(-.1,.3)
            rock((px,py,2.055),(.16,.14,.10),"67A373",2)
            rock((px,py,2.15),(.076,.075,.052),col,2)
    for s in [-1,1]:
        tower(s*GATE_X,DEPTH+.17,2.02)
    # The plinth is cut away in front, like a physical working tabletop model.
    block((0,-.03,BASE_Z-.29),(34,2*DEPTH+.38,.60),"9D704F",.12)
    block((0,-.05,BASE_Z-.08),(34,2*DEPTH+.18,.16),cap,.035)
    block((0,-5.6,BASE_Z-.60),(48,7.9,.65),grass,.18)
    for x in [-10.5,-8.6,7.8,10.65]:
        rock((x,-3.35,BASE_Z-.27),(.70,.38,.25),stone,2)
        for d in [-.25,.2]:
            rock((x+d,-3.2,BASE_Z-.12),(.31,.21,.23),grass,2)
    for j in range(-8,9):
        block((j*1.57,-DEPTH-.18,BASE_Z-.32),(1.50,.09,.24),"BC8D62" if j%2 else "C1936A",.035)
    # A work landing and its coiled mooring line frame the cutaway from below.
    for side in [-1,1]:
        x,y=side*9.0,-3.70
        block((x,y,BASE_Z-.24),(2.60,1.35,.22),stone,.10)
        for i in range(8):
            block((x-1.13+i*.32,y,BASE_Z-.085),(.30,1.38,.105),"DAB18A" if i%3 else "CFA178",.024)
        for dx in [-.96,.96]:
            cone((x+dx,y-.40,BASE_Z+.15),.135,.125,.39,NAVY)
            cone((x+dx,y-.40,BASE_Z+.38),.157,.156,.085,GOLD)
        for i in range(3):
            bpy.ops.mesh.primitive_torus_add(major_radius=.15+i*.038,minor_radius=.027,
                major_segments=24,minor_segments=7,location=(x-.24,y+.12,BASE_Z-.003))
            finish(bpy.context.object,"A97C50")
        block((x+.50,y+.1,BASE_Z+.18),(.45,.45,.41),TEAL,.045)
        for dx in [-.13,.13]:
            block((x+.50+dx,y+.1,BASE_Z+.39),(.045,.46,.03),GOLD,.009)
    source,exit_height=(2,0) if level==2 else (0,2)
    pool(-15,-GATE_X,source,rng)
    pool(GATE_X,15,exit_height,rng)
    return sky


def cover():
    # A compact tabletop cutaway: two staggered stretches of water and a lock gate.
    block((0,0,-.27),(6.48,4.03,.56),"996C4D",.24)
    block((0,0,.0),(6.50,4.05,.16),"E9BD88",.10)
    block((0,.10,.22),(6.28,3.71,.35),"2598AF",.12)
    block((-.58,-.16,.39),(4.96,2.82,.065),"50C5C6",.08)
    block((2.30,-.12,.64),(1.37,2.92,.60),"2E9FB4",.1)
    block((2.30,-.12,.96),(1.38,2.91,.09),"55C8C5",.07)
    block((-.05,1.39,.56),(6.18,.68,.78),"C59770",.1)
    block((-.05,1.42,.98),(6.2,.72,.13),"84B877",.065)
    for x in [-2.45,-2.16,-1.88,.12,.43]:
        block((x,-.92,.435),(.24,.043,.018),"A5E6D9",.013)
    for y in [-1.42,1.30]:
        tower(1.53,y,.49)
    for side in [-1,1]:
        y=side*.68
        block((1.53,y,1.0),(.24,1.27,1.24),TEAL,.065)
        for z in [.57,.87,1.19,1.51]:
            block((1.384,y,z),(.09,1.26,.07),GOLD,.023)
        beam((1.374,y-.51,.61),(1.374,y+.51,1.46),.049,IVORY)
    group(tug,(-.65,-.44,.42),1.10,.04)
    group(lighthouse,(-2.13,1.36,1.04),.61)
    pine(.35,1.41,1.03,1.33)
    pine(.83,1.57,1.03,1.04)
    for x,y,length in [(-1.93,-1.15,.38),(-1.40,-1.21,.20),(.74,-1.27,.28),(2.19,-1.02,.33),(2.59,-.90,.2)]:
        block((x,y,.43 if x<1.5 else 1.018),(length,.054,.019),"A7E6DA",.012)
    render(ROOT/"public/games/hub/canal-lock.png",(720,720),(0,0,1.16),7.78,-.34,elevation=ANGLE)


if __name__=="__main__":
    for level in [1,2,3]:
        clear()
        sky=landscape(level)
        render(MASTERS/f"level-{level}.png",(1120,560),(0,0,TARGET_Z),24,sky=sky,elevation=ANGLE)
    clear()
    tug()
    # The contact waterline is four fifths of the way down the sprite.
    render(MASTERS/"boat.png",(300,200),(0,0,.30*(4.15*2/3)/math.cos(ANGLE)),4.15,elevation=ANGLE)
    clear()
    cover()
