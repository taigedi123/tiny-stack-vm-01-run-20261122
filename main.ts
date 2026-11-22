// Tiny stack VM for make.fun's tiny stack ISA (kit: generator/subject/ISA.md).
// One run answers a whole set: /input/<id>/program.bin + input.bin in,
// /output/<id>/stdout.bin + exit.txt out. Values wrap at 32 bits; the data
// stack holds 256, the call stack 64, memory 256 words; ten traps carry
// their own exit codes, checked in the order the ISA states them.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Opcode bytes in kind order (kind = position + 1), with per-kind facts as
// digit strings indexed by kind - 1: immediate bytes, values popped, pushed.
const OPS = '\0\x01\x02\x03\x04\x05\x06\x07\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1a\x1b\x1c\x1d\x1e\x20\x21\x22\x30\x31\x32\x33\x34\x40\x41\x50\x51\x52\x53';
const IMM = '0140000000000000000000000022220000000';
const POP = '0001122322222221222122222201100121101';
const PSH = '0110223311111111111111111100000100010';
const KIND = new Uint8Array(256);
for (let i = 0; i < 37; i++) KIND[OPS.charCodeAt(i)] = i + 1;

function run(p: Uint8Array, inp: Uint8Array): { b: Uint8Array; l: number; c: number } {
  const n = p.length;
  const s = new Int32Array(256);
  let sp = 0;
  const cs = new Int32Array(64);
  let cp = 0;
  const m = new Int32Array(256);
  const o = new Uint8Array(65536);
  let ol = 0;
  let ip = 0;
  let pc = 0;
  let st = 0;
  const end = (c: number) => ({ b: o, l: ol, c });
  for (;;) {
    if (st === 1000000) return end(10);
    if (pc < 0 || pc >= n) return end(9);
    const op = p[pc];
    const k = KIND[op];
    if (k === 0) return end(5);
    const im = IMM.charCodeAt(k - 1) - 48;
    if (pc + im >= n) return end(9);
    st++;
    const pops = POP.charCodeAt(k - 1) - 48;
    if (sp < pops) return end(2);
    if (sp - pops + (PSH.charCodeAt(k - 1) - 48) > 256) return end(3);
    const nx = pc + 1 + im;
    pc = nx;
    switch (k) {
      case 1: return end(0);
      case 2: s[sp++] = (p[nx - 1] << 24) >> 24; break;
      case 3: s[sp++] = p[nx - 4] | (p[nx - 3] << 8) | (p[nx - 2] << 16) | (p[nx - 1] << 24); break;
      case 4: sp--; break;
      case 5: s[sp] = s[sp - 1]; sp++; break;
      case 6: { const t = s[sp - 1]; s[sp - 1] = s[sp - 2]; s[sp - 2] = t; break; }
      case 7: s[sp] = s[sp - 2]; sp++; break;
      case 8: { const a = s[sp - 3]; s[sp - 3] = s[sp - 2]; s[sp - 2] = s[sp - 1]; s[sp - 1] = a; break; }
      case 16: s[sp - 1] = -s[sp - 1] | 0; break;
      case 20: s[sp - 1] = ~s[sp - 1]; break;
      case 27: pc = nx + (((p[nx - 2] | (p[nx - 1] << 8)) << 16) >> 16); break;
      case 28:
      case 29: { const r = ((p[nx - 2] | (p[nx - 1] << 8)) << 16) >> 16; const v = s[--sp]; if ((k === 28) === (v === 0)) pc = nx + r; break; }
      case 30:
        if (cp === 64) return end(7);
        cs[cp++] = nx;
        pc = p[nx - 2] | (p[nx - 1] << 8);
        break;
      case 31:
        if (cp === 0) return end(8);
        pc = cs[--cp];
        break;
      case 32: { const a = s[sp - 1]; if (a < 0 || a > 255) return end(6); s[sp - 1] = m[a]; break; }
      case 33: { const a = s[sp - 1]; if (a < 0 || a > 255) return end(6); m[a] = s[sp - 2]; sp -= 2; break; }
      case 34: {
        const v = s[sp - 1];
        let u = v < 0 ? -v : v;
        let d = 1;
        for (let t = u; t >= 10; t = (t / 10) | 0) d++;
        const w = d + (v < 0 ? 1 : 0);
        if (ol + w > 65536) return end(11);
        sp--;
        let q = ol + w;
        while (u >= 10) { const z = (u / 10) | 0; o[--q] = 48 + (u - z * 10); u = z; }
        o[--q] = 48 + u;
        if (v < 0) o[--q] = 45;
        ol += w;
        break;
      }
      case 35:
        if (ol + 1 > 65536) return end(11);
        o[ol++] = s[--sp] & 255;
        break;
      case 36: s[sp++] = ip < inp.length ? inp[ip++] : -1; break;
      case 37: return end(s[--sp] & 255);
      default: {
        const b = s[sp - 1];
        const a = s[sp - 2];
        let r: number;
        if (k === 9) r = (a + b) | 0;
        else if (k === 10) r = (a - b) | 0;
        else if (k === 11) r = Math.imul(a, b);
        else if (k === 12) { if (b === 0) return end(4); r = a === -2147483648 && b === -1 ? a : (a / b) | 0; }
        else if (k === 13) { if (b === 0) return end(4); r = b === -1 ? 0 : (a % b) | 0; }
        else if (k === 14) { if (b === 0) return end(4); r = Math.floor((a >>> 0) / (b >>> 0)) | 0; }
        else if (k === 15) { if (b === 0) return end(4); r = ((a >>> 0) % (b >>> 0)) | 0; }
        else if (k === 17) r = a & b;
        else if (k === 18) r = a | b;
        else if (k === 19) r = a ^ b;
        else if (k === 21) r = a << (b & 31);
        else if (k === 22) r = a >> (b & 31);
        else if (k === 23) r = (a >>> (b & 31)) | 0;
        else if (k === 24) r = a === b ? 1 : 0;
        else if (k === 25) r = a < b ? 1 : 0;
        else r = (a >>> 0) < (b >>> 0) ? 1 : 0;
        sp -= 2;
        s[sp++] = r;
        break;
      }
    }
  }
}

const I = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const O = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
for (const id of readdirSync(I).sort()) {
  const r = run(readFileSync(join(I, id, 'program.bin')), readFileSync(join(I, id, 'input.bin')));
  mkdirSync(join(O, id), { recursive: true });
  writeFileSync(join(O, id, 'stdout.bin'), r.b.subarray(0, r.l));
  writeFileSync(join(O, id, 'exit.txt'), `${r.c}\n`);
}
