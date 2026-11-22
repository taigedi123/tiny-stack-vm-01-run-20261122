import{mkdirSync,readdirSync,readFileSync,writeFileSync}from'node:fs';
function r(p,d){
let n=p.length,s=new Int32Array(256),t=0,c=new Int32Array(64),u=0,m=new Int32Array(256),o=new Uint8Array(65536),l=0,i=0,j=0,g=0,e=x=>({b:o,l,c:x});
for(;;){
if(g==1e6)return e(10);
if(j<0||j>=n)return e(9);
let y=p[j];
if(y>7&&!(y>15&&y<31)&&!(y>31&&y<35)&&!(y>47&&y<53)&&!(y>63&&y<66)&&!(y>79&&y<84))return e(5);
let k=y+1-8*(y>>4)+("0072/)".charCodeAt(y>>4)-48),q=k==2?1:k==3?4:k>26&&k<31?2:0;
if(j+q>=n)return e(9);
g++;
let v="01146:;?99999995999599999904400584414".charCodeAt(k-1)-48,w=v>>2,z=v&3;
if(t<w)return e(2);
if(t-w+z>256)return e(3);
let x=j+1+q;j=x;
switch(k){
case 1:return e(0);
case 2:s[t++]=(p[x-1]<<24)>>24;break;
case 3:s[t++]=p[x-4]|p[x-3]<<8|p[x-2]<<16|p[x-1]<<24;break;
case 4:t--;break;
case 5:s[t]=s[t-1];t++;break;
case 6:let a=s[t-1];s[t-1]=s[t-2];s[t-2]=a;break;
case 7:s[t]=s[t-2];t++;break;
case 8:let b=s[t-3];s[t-3]=s[t-2];s[t-2]=s[t-1];s[t-1]=b;break;
case 16:s[t-1]=-s[t-1]|0;break;
case 20:s[t-1]=~s[t-1];break;
case 27:j=x+(((p[x-2]|p[x-1]<<8)<<16)>>16);break;
case 28:case 29:let f=((p[x-2]|p[x-1]<<8)<<16)>>16,h=s[--t];if((k==28)==(h==0))j=x+f;break;
case 30:if(u==64)return e(7);c[u++]=x;j=p[x-2]|p[x-1]<<8;break;
case 31:if(!u)return e(8);j=c[--u];break;
case 32:let A=s[t-1];if(A<0||A>255)return e(6);s[t-1]=m[A];break;
case 33:let B=s[t-1];if(B<0||B>255)return e(6);m[B]=s[t-2];t-=2;break;
case 34:let C=String(s[--t]);if(l+C.length>65536)return e(11);for(let D=0;D<C.length;D++)o[l++]=C.charCodeAt(D);break;
case 35:if(l+1>65536)return e(11);o[l++]=s[--t]&255;break;
case 36:s[t++]=i<d.length?d[i++]:-1;break;
case 37:return e(s[--t]&255);
default:let E=s[t-1],F=s[t-2];if(k>11&&k<16&&!E)return e(4);let G=k==9?(F+E)|0:k==10?(F-E)|0:k==11?Math.imul(F,E):k==12?(F/E)|0:k==13?F%E|0:k==14?Math.floor((F>>>0)/(E>>>0))|0:k==15?(F>>>0)%(E>>>0)|0:k==17?F&E:k==18?F|E:k==19?F^E:k==21?F<<(E&31):k==22?F>>(E&31):k==23?F>>>(E&31):k==24?F==E?1:0:k==25?F<E?1:0:(F>>>0)<(E>>>0)?1:0;t-=2;s[t++]=G;
}
}
}
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
for(const q of readdirSync(I).sort()){let a=r(readFileSync(I+'/'+q+'/program.bin'),readFileSync(I+'/'+q+'/input.bin'));mkdirSync(O+'/'+q,{recursive:true});writeFileSync(O+'/'+q+'/stdout.bin',a.b.subarray(0,a.l));writeFileSync(O+'/'+q+'/exit.txt',a.c+'\n');}
