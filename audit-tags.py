from html.parser import HTMLParser
class Audit(HTMLParser):
 def __init__(self): super().__init__();self.stack=[]
 def handle_starttag(self,t,a):
  if t not in 'area base br col embed hr img input link meta param source track wbr'.split(): self.stack.append((t,self.getpos(),dict(a).get('id'),dict(a).get('class')))
 def handle_endtag(self,t):
  if t not in [e[0] for e in self.stack]: print('UNMATCHED END',t,self.getpos());return
  while self.stack:
   e=self.stack.pop()
   if e[0]==t:break
   if e[0] in ('div','main'):print('UNCLOSED',e,'closed at',t,self.getpos())
p=Audit();p.feed(open('index-cmdk.html',encoding='utf-8').read())
