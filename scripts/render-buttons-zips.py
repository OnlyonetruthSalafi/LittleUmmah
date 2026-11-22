"""A stitched travel pouch, working button tabs and a two-part brass zipper."""
import math
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent/'lib'))
from workshop_art import CREAM, GOLD, INK, cord, disk, frame, point, ring, slab, table, write_art

FABRICS=[("267F85","69B9AE","EFBA68"),("4E83B7","8CC4D7","EFA86A"),("A35463","DB8C84","8EC4B1")]
LANES=[[480],[320,640],[250,480,710]]


def button(x,y):
    disk(x,y,.48,39,.14,"AA672A")
    disk(x,y-2,.56,37,.12,"F6BB4B")
    ring(x,y-2,.635,30,2.4,"FEDA83")
    for dx in [-8,8]:
        for dy in [-6,6]:
            disk(x+dx,y+dy-2,.63,4.3,.02,"805230",20)
    for dx in [-8,8]:
        cord([(x+dx,y-8,.67),(x+dx+1,y-2,.69),(x+dx,y+4,.67)],2.0,CREAM)


def pull(x,y):
    slab(x,y,.45,41,31,.20,"996425",.10)
    slab(x,y-2,.57,37,25,.12,GOLD,.08)
    ring(x+11,y-3,.71,18,4.3,"FFE09A",(.96,.50,1))


def build(level,cover):
    fabric,trim,leather=FABRICS[level-1]
    if not cover:
        table("A4D9CE")
        # A few spools sit outside the work area, like a child's sewing table.
        for x,y,c in [(55,64,leather),(905,395,trim),(42,382,"DC8378")]:
            disk(x,y,-.09,23,.26,"B68051")
            for j in range(6): disk(x,y-j*.8,.03+j*.035,18,.04,c)
            disk(x,y-5,.27,23,.07,"E7BC82")
            disk(x,y-5,.32,5,.02,INK)
    slab(480,252,-.03,770,350,.47,"985F40",.24)
    slab(480,245,.17,766,345,.41,fabric,.22)
    frame(480,242,738,319,33,.42,2.7,trim)
    # Quilted lower pocket, leather binding and hand stitches.
    slab(480,317,.38,650,118,.12,trim,.13)
    for x in range(187,785,19):
        cord([(x,361,.49),(x+8,361,.49)],1.3,CREAM)
    cord([(238,321,.55),(722,321,.55)],8,"735642")
    for x in LANES[level-1]:
        slab(x,172,.39,113,154,.14,leather,.16)
        frame(x,170,95,131,15,.49,1.6,CREAM)
        slab(x,139,.50,64,17,.045,"564333",.065)
        frame(x,139,68,19,8,.54,2.5,CREAM)
        if cover: button(x,211)
    if cover:
        for i in range(47):
            slab(244+i*10,320+(i%2)*4,.64,5,12,.065,GOLD,.02)
        pull(657,320)
    for x in [150,810]:
        ring(x,80,.32,20,5.4,GOLD,(1,.7,1))
    cord([(142,88,.24),(143,52,.37),(169,30,.43),(220,30,.44),(245,51,.37),(246,82,.24)],6,"AA714D")


write_art('buttons-zips',build,sprites=[
    ('button',lambda:button(480,240),1.22),('pull',lambda:pull(480,240),1.02),
])
