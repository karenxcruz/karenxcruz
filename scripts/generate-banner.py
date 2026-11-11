from PIL import Image, ImageDraw, ImageFont, ImageChops
from pathlib import Path
import math, random, json, base64

ROOT=Path(__file__).resolve().parents[1]
W,H=960,400
INK='#f4f1ff'; MUTED='#b4b1cd'; VIOLET='#bda1ff'; MINT='#85efd0'
def font(n,bold=False): return ImageFont.truetype('C:/Windows/Fonts/arial'+('bd' if bold else '')+'.ttf',n)
base=Image.new('RGB',(W,H),'#0d1117');d=ImageDraw.Draw(base)
d.rounded_rectangle((1,1,958,398),26,fill='#17172a',outline='#443857',width=2)
d.rounded_rectangle((622,13,946,386),22,fill='#201d36',outline='#3c3557')
rng=random.Random(27)
stars=[(rng.randrange(640,928),rng.randrange(35,365),rng.choice([1,1,2]),rng.random()*6.28) for _ in range(38)]
d.text((35,30),'KARENXCRUZ  /  UNIVERSO EN CONSTRUCCIÓN',font=font(15,True),fill=VIOLET)
d.text((32,79),'Karen Ximena',font=font(62,True),fill=INK)
d.text((32,144),'Cruz Guzmán.',font=font(62,True),fill=INK)
d.rounded_rectangle((35,228,292,269),20,fill=VIOLET)
d.text((52,239),'ENFOQUE FULL STACK',font=font(18,True),fill='#211832')
d.text((35,298),'Pequeñas ideas.',font=font(26,True),fill=INK)
d.text((35,335),'Grandes conexiones.',font=font(26,True),fill=MINT)
cx,cy=785,193
planet=Image.new('RGB',(130,130));p=planet.load()
for y in range(130):
 for x in range(130):
  v=max(0,min(1,(x+y)/240));p[x,y]=(int(211-97*v),int(190-99*v),int(255-70*v))
mask=Image.new('L',(130,130));ImageDraw.Draw(mask).ellipse((0,0,129,129),fill=255)
frames=[]
for frame in range(36):
 t=frame/36*math.tau;im=base.copy();a=ImageDraw.Draw(im)
 for x,y,r,phase in stars:
  b=int(135+70*math.sin(t+phase));a.ellipse((x-r,y-r,x+r,y+r),fill=(b,b,min(255,b+35)))
 a.ellipse((cx-135,cy-104,cx+135,cy+104),outline='#55496e',width=1)
 a.ellipse((cx-113,cy-77,cx+113,cy+77),outline='#3f4e59',width=1)
 floaty=int(math.sin(t)*4);im.paste(planet,(cx-65,cy-65+floaty),mask)
 a=ImageDraw.Draw(im);a.text((cx,cy-20+floaty),'K',font=font(58,True),fill='#291d43',anchor='mm')
 a.text((cx,cy+34+floaty),'FULL STACK',font=font(11,True),fill='#36274b',anchor='mm')
 for i,label in enumerate(['JS','PY','DB']):
  ang=t+i*math.tau/3;x=cx+int(135*math.cos(ang));y=cy+int(104*math.sin(ang))
  a.rounded_rectangle((x-20,y-17,x+20,y+17),9,fill='#171f2b',outline=MINT if i==0 else VIOLET,width=2)
  a.text((x,y),label,font=font(14,True),fill=MINT if i==0 else VIOLET,anchor='mm')
 a.text((cx,350),'FRONTEND  ·  BACKEND  ·  DATOS',font=font(12,True),fill=MUTED,anchor='mm')
 frames.append(im)
palette=frames[0].quantize(colors=96)
frames=[im.quantize(palette=palette,dither=Image.Dither.NONE) for im in frames]
frames[0].save(ROOT/'assets/banner-universo.gif',save_all=True,append_images=frames[1:],duration=120,loop=0,optimize=True,disposal=1)
frames[0].convert('RGB').save(ROOT/'assets/banner-universo.png')


