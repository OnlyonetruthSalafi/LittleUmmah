"""A 960 x 480 drawing plane shared by Blender and each interactive board."""
import math
from pathlib import Path

import bpy
from blender_toys import beam, block, clear, cone, finish, mat, render, rock

ROOT = Path(__file__).resolve().parents[2]
ANGLE = math.radians(64)
UNIT = 80
GOLD, CREAM, INK = "E8AA45", "FFF0D0", "284854"


def point(x, y, z=0):
    return ((x-480)/UNIT, ((240-y)/UNIT-z*math.cos(ANGLE))/math.sin(ANGLE), z)


def slab(x, y, z, width, depth, height, color, bevel=.09):
    return block(point(x,y,z), (width/UNIT, depth/(UNIT*math.sin(ANGLE)), height), color, bevel)


def disk(x,y,z,r,h,color,sides=48):
    return cone(point(x,y,z),r/UNIT,r/UNIT,h,color,sides)


def ring(x,y,z,r,wire,color,stretch=(1,1,1)):
    bpy.ops.mesh.primitive_torus_add(major_radius=r/UNIT, minor_radius=wire/UNIT,
                                    major_segments=48, minor_segments=10, location=point(x,y,z))
    obj=finish(bpy.context.object,color)
    obj.scale=stretch
    return obj


def cord(points, radius, color, name="Piping"):
    curve=bpy.data.curves.new(name,'CURVE')
    curve.dimensions='3D'
    curve.resolution_u=1
    curve.bevel_depth=radius/UNIT
    curve.bevel_resolution=3
    spline=curve.splines.new('POLY')
    spline.points.add(len(points)-1)
    for p,co in zip(spline.points,points):
        p.co=(*point(*co),1)
    obj=bpy.data.objects.new(name,curve)
    bpy.context.collection.objects.link(obj)
    curve.materials.append(mat(color))
    return obj


def frame(x,y,w,h,r,z,width,color):
    points=[]
    for cx,cy,a in [(x+w/2-r,y-h/2+r,-90),(x+w/2-r,y+h/2-r,0),
                    (x-w/2+r,y+h/2-r,90),(x-w/2+r,y-h/2+r,180)]:
        for j in range(9):
            angle=math.radians(a+j*90/8)
            points.append((cx+r*math.cos(angle),cy+r*math.sin(angle),z))
    return cord(points+[points[0]],width,color)


def table(color):
    slab(480,240,-.55,1600,1050,.36,color,.14)


def write_art(slug, build, extras=None, sprites=()):
    art=ROOT/'public/games'/slug
    out=ROOT/'output'/slug
    art.mkdir(exist_ok=True); out.mkdir(parents=True,exist_ok=True)
    for level in [1,2,3]:
        clear()
        build(level,False)
        render(art/f'level-{level}.png',(1120,560),(0,0,0),12,elevation=ANGLE)
    for name,make,scale in sprites:
        clear()
        make()
        render(art/(name+'.png'),(240,240),(0,0,0),scale,elevation=ANGLE)
    clear()
    build(2,True)
    if extras:
        extras()
    target=(0,0,.22)
    render(ROOT/'public/games/hub'/(slug+'.png'),(640,640),target,12,.28,elevation=math.radians(44))
    render('//workshop.png',(1120,560),(0,0,0),12,project=out/(slug+'.blend'),elevation=ANGLE)
