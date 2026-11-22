import*as F from'node:fs';
let o=new Uint8Array(65536),l=0;
const M=[2147418367,2031623,983043],I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
function r(p,d){
let n=p.length,s=new Int32Array(256),t=0,c=new Int32Array(64),u=0,m=new Int32Array(256),i=0,j=0,g=0;
l=0;
for(;;){
if(g==1e6)return 10;
if(j<0||j>=n)return 9;
let y=p[j];
if(!(M[y>>5]>>(y&31)&1))return 5;
let k=y+1-8*(y>>4)+("0072/)".charCodeAt(y>>4)-48),v="0Aq46:;?999999959995999999PTTP0584414".charCodeAt(k-1)-48,q=v>>4,w=v>>2&3,z=v&3;
if(j+q>=n)return 9;
g++;
if(t<w)return 2;
if(t-w+z>256)return 3;
j+=1+q;
switch(k){
case 1:return 0;
case 2:s[t++]=(p[j-1]<<24)>>24;break;
case 3:s[t++]=p[j-4]|p[j-3]<<8|p[j-2]<<16|p[j-1]<<24;break;
case 4:t--;break;
case 5:s[t]=s[t-1],t++;break;
case 6:[s[t-1],s[t-2]]=[s[t-2],s[t-1]];break;
case 7:s[t]=s[t-2],t++;break;
case 8:[s[t-3],s[t-2],s[t-1]]=[s[t-2],s[t-1],s[t-3]];break;
case 16:s[t-1]=-s[t-1];break;
case 20:s[t-1]=~s[t-1];break;
case 27:j+=(p[j-2]|p[j-1]<<8)<<16>>16;break;
case 28:case 29:if((k==28)==(s[--t]==0))j+=(p[j-2]|p[j-1]<<8)<<16>>16;break;
case 30:if(u==64)return 7;c[u++]=j;j=p[j-2]|p[j-1]<<8;break;
case 31:if(!u)return 8;j=c[--u];break;
case 32:let A=s[t-1];if(A>>8)return 6;s[t-1]=m[A];break;
case 33:let B=s[t-1];if(B>>8)return 6;m[B]=s[t-2];t-=2;break;
case 34:let C=''+s[--t];if(l+C.length>65536)return 11;for(let D of C)o[l++]=D.charCodeAt(0);break;
case 35:if(l>65535)return 11;o[l++]=s[--t]&255;break;
case 36:s[t++]=d[i++]??-1;break;
case 37:return s[--t]&255;
default:let E=s[t-1],F=s[t-2];if(k>11&&k<16&&!E)return 4;let G=k==9?F+E:k==10?F-E:k==11?Math.imul(F,E):k==12?F/E:k==13?F%E:k==14?(F>>>0)/(E>>>0):k==15?(F>>>0)%(E>>>0):k==17?F&E:k==18?F|E:k==19?F^E:k==21?F<<E:k==22?F>>E:k==23?F>>>E:k==24?+(F==E):k==25?+(F<E):+((F>>>0)<(E>>>0));t-=2;s[t++]=G;
}
}
}
for(const q of F.readdirSync(I).sort()){let f=I+'/'+q,h=O+'/'+q,a=r(F.readFileSync(f+'/program.bin'),F.readFileSync(f+'/input.bin'));F.mkdirSync(h,{recursive:true});F.writeFileSync(h+'/stdout.bin',o.subarray(0,l));F.writeFileSync(h+'/exit.txt',a+'\n');}
