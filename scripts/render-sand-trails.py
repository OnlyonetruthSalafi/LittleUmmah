"""A portable drawing beach with a sandcastle, pegged frame and enamel pail."""
import math
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent/'lib'))
from workshop_art import cord, disk, frame, point, ring, slab, table, write_art
from blender_toys import cone, mat, rock

def build(level,cover):
    sand,paint,wood=[("EFCC89","448F92","C4804B"),("EAC091","508A78","AC704C"),("E2B28E","79678B","996347")][level-1]
    if not cover: table(paint)
    slab(480,245,-.14,864,405,.38,wood,.26)
    slab(480,239,.03,838,378,.22,sand,.20)
    material=mat(sand)
    nodes=material.node_tree.nodes
    noise=nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value=320
    bump=nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value=.24
    bump.inputs['Distance'].default_value=.035
    material.node_tree.links.new(noise.outputs['Fac'],bump.inputs['Height'])
    material.node_tree.links.new(bump.outputs['Normal'],nodes.get('Principled BSDF').inputs['Normal'])
    frame(480,239,845,386,22,.24,9,wood)
    for x in [75,885]:
        for y in [61,418]: disk(x,y,.30,5,.05,"EEC06E")
    # Crenellated towers and a little pennant gather at the edge of the sand.
    for x,y,r,h in [(128,100,24,.52),(165,105,16,.35),(110,126,14,.26)]:
        cone(point(x,y,.30),r/80,r/105,h,"D89F60",32)
        for j in range(6):
            a=j*math.pi/3
            slab(x+r*.69*math.cos(a),y+r*.63*math.sin(a)-6,.30+h/2,7,7,.085,"E6BB79",.025)
    cord([(128,94,.65),(128,61,1.02)],1.7,"8E623A")
    slab(139,67,.98,21,10,.04,"DF7556",.025)
    # Pail and arched handle. Pebbles give the tray a sense of scale.
    cone(point(824,367,.34),.24,.34,.49,paint,40)
    disk(824,360,.60,23,.035,"BE9A6C")
    ring(824,360,.63,26,2.2,"F7DE92")
    cord([(824+25*math.cos(j*math.pi/18),361-31*math.sin(j*math.pi/18),.64+.22*math.sin(j*math.pi/18)) for j in range(19)],2.4,"F5DDA0")
    for x,y,r,c in [(130,383,11,"A47D6E"),(155,388,7,"C39470"),(791,90,13,"C6A18D"),(812,84,8,"CC9C77")]:
        rock(point(x,y,.19),(r/80,r/100,r/145),c,2)
    if cover:
        pts=[(190+i*5,241-65*math.sin(i/18),.18) for i in range(115)]
        cord(pts,5.5,"BB8959");cord([(x,y+5,z) for x,y,z in pts],2,"FFE2AC")

write_art('sand-trails',build)
