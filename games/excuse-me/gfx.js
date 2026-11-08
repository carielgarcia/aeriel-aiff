/* EXCUSE ME — graphics foundation for the 16-bit engine: the render scale, colour ramps with hue-shifted shadows and
   highlights, a small pixel-art drawing surface (flat and lit shapes, no anti-aliasing) and the Scale2x filter.
   Everything here is pure: no game state. */
'use strict';
(function () {
  const EM = window.EM;

  /* The game logic runs in "logical pixels" (a 320x180 view, 16 px tiles, 16x32 people). Art and canvas are drawn at RS times
     that, so a logical pixel is RS x RS device pixels. Never put RS into game rules: only into drawing. */
  const RS = EM.RS = 2;

  /* ------------------------------------------------------------ colour */
  function rgb(h) { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function hex(r, g, b) {
    r = Math.max(0, Math.min(255, Math.round(r))); g = Math.max(0, Math.min(255, Math.round(g))); b = Math.max(0, Math.min(255, Math.round(b)));
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase();
  }
  function mix(a, b, t) { const A = rgb(a), B = rgb(b); return hex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t); }
  EM.rgb = rgb; EM.hex = hex; EM.mix = mix;

  /* shade(hex, f): f < 0 darkens toward a cool blue-violet, f > 0 lightens toward a warm light (hue shift, not just luminance) */
  const shadeCache = {};
  function shade(h, f) {
    const key = h + f;
    if (shadeCache[key]) return shadeCache[key];
    let [r, g, b] = rgb(h);
    if (f < 0) { const t = Math.min(1, -f); r = r * (1 + f) * (1 - 0.14 * t); g = g * (1 + f) * (1 - 0.06 * t); b = b * (1 + f) * (1 + 0.14 * t) + 12 * t; }
    else { r = r + (255 - r) * f; g = g + (255 - g) * f * 0.94; b = b + (255 - b) * f * 0.76; }
    return (shadeCache[key] = hex(r, g, b));
  }
  EM.shade = shade;

  /* a five-tone ramp: s2 (deep shadow), s (shadow), b (base), h (light), h2 (highlight). kind picks the hue behaviour. */
  const rampCache = {};
  EM.ramp = function (base, kind) {
    const key = base + (kind || '');
    if (rampCache[key]) return rampCache[key];
    const [r, g, b] = rgb(base);
    let R;
    if (kind === 'skin') {
      /* skin shadows go warm and a little red, highlights go warm and light */
      R = { s2: hex(r * 0.62, g * 0.46, b * 0.52), s: hex(r * 0.82, g * 0.68, b * 0.72), b: base, h: hex(r + (255 - r) * 0.10, g + (255 - g) * 0.12, b + (255 - b) * 0.10), h2: hex(r + (255 - r) * 0.28, g + (255 - g) * 0.28, b + (255 - b) * 0.24) };
    } else if (kind === 'hair') {
      R = { s2: shade(base, -0.62), s: shade(base, -0.34), b: base, h: mix(base, '#FFF3DA', 0.30), h2: mix(base, '#FFFFFF', 0.58) };
    } else {
      R = { s2: shade(base, -0.55), s: shade(base, -0.28), b: base, h: shade(base, 0.20), h2: shade(base, 0.42) };
    }
    return (rampCache[key] = R);
  };

  /* ------------------------------------------------------------ a pixel surface */
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  EM.BAYER = BAYER;

  function Surf(w, h, ox, oy) {
    this.c = document.createElement('canvas'); this.c.width = w; this.c.height = h;
    this.g = this.c.getContext('2d'); this.g.imageSmoothingEnabled = false;
    this.ox = ox || 0; this.oy = oy || 0; this.w = w; this.h = h;
  }
  Surf.prototype.px = function (x, y, c) { this.g.fillStyle = c; this.g.fillRect(x + this.ox, y + this.oy, 1, 1); };
  Surf.prototype.rect = function (x, y, w, h, c) { if (w <= 0 || h <= 0) return; this.g.fillStyle = c; this.g.fillRect(x + this.ox, y + this.oy, w, h); };
  Surf.prototype.span = function (y, x0, x1, c) { if (x1 < x0) return; this.g.fillStyle = c; this.g.fillRect(x0 + this.ox, y + this.oy, x1 - x0 + 1, 1); };
  Surf.prototype.get = function (x, y) { const d = this.g.getImageData(x + this.ox, y + this.oy, 1, 1).data; return d[3] ? [d[0], d[1], d[2]] : null; };
  Surf.prototype.line = function (x0, y0, x1, y1, c) {
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1; let err = dx + dy;
    for (;;) { this.px(x0, y0, c); if (x0 === x1 && y0 === y1) break; const e2 = 2 * err; if (e2 >= dy) { err += dy; x0 += sx; } if (e2 <= dx) { err += dx; y0 += sy; } }
  };
  /* a flat ellipse (cx, cy are edge coordinates, so cx = 16 is the line between pixel 15 and 16) */
  Surf.prototype.ell = function (cx, cy, rx, ry, c) {
    for (let y = Math.floor(cy - ry); y < Math.ceil(cy + ry); y++) {
      const ny = (y + 0.5 - cy) / ry; if (Math.abs(ny) > 1) continue;
      const hw = rx * Math.sqrt(1 - ny * ny);
      this.span(y, Math.round(cx - hw), Math.round(cx + hw) - 1, c);
    }
  };
  /* tone from a lighting value (light from the upper left): thresholds picked so a lit volume has a clear core and rim */
  function tone(R, v) { return v > 0.64 ? R.h2 : v > 0.30 ? R.h : v > -0.16 ? R.b : v > -0.52 ? R.s : R.s2; }
  /* an ellipse lit from the upper left, with a checkerboard at the tone boundaries (the 16-bit dithered ramp) */
  Surf.prototype.ellS = function (cx, cy, rx, ry, R, o) {
    o = o || {};
    for (let y = Math.floor(cy - ry); y < Math.ceil(cy + ry); y++) for (let x = Math.floor(cx - rx); x < Math.ceil(cx + rx); x++) {
      const nx = (x + 0.5 - cx) / rx, ny = (y + 0.5 - cy) / ry;
      if (nx * nx + ny * ny > 1) continue;
      const v = -(nx * 0.62 + ny * 0.78) + (o.bias || 0) + (((x + y) & 1) ? 0.08 : -0.08);
      this.px(x, y, tone(R, v));
    }
  };
  /* a limb or box lit like a cylinder: light on the left, shadow on the right and underneath */
  Surf.prototype.rectS = function (x, y, w, h, R, o) {
    o = o || {};
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      if (o.round && ((i === 0 || i === w - 1) && (j === 0 || j === h - 1)) && w > 2) continue;
      const u = w > 1 ? i / (w - 1) : 0.5, v = h > 1 ? j / (h - 1) : 0.5;
      const lit = (0.40 - u) * 1.7 - (v - 0.3) * (o.vert === undefined ? 0.5 : o.vert) + (o.bias || 0) + (((x + i + y + j) & 1) ? 0.06 : -0.06);
      this.px(x + i, y + j, tone(R, lit));
    }
  };
  EM.Surf = Surf;

  /* ------------------------------------------------------------ Scale2x (AdvMAME2x): a smooth 2x for hand-made pixel art */
  EM.scale2x = function (src) {
    const w = src.width, h = src.height;
    const out = document.createElement('canvas'); out.width = w * 2; out.height = h * 2;
    const sg = src.getContext('2d'), og = out.getContext('2d');
    const si = sg.getImageData(0, 0, w, h), sd = new Uint32Array(si.data.buffer);
    const oi = og.createImageData(w * 2, h * 2), od = new Uint32Array(oi.data.buffer);
    const at = function (x, y) { return x < 0 || y < 0 || x >= w || y >= h ? 0 : sd[y * w + x]; };
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const P = sd[y * w + x], A = at(x, y - 1), B = at(x + 1, y), C = at(x - 1, y), Dn = at(x, y + 1);
      const o0 = (C === A && C !== Dn && A !== B) ? A : P, o1 = (A === B && A !== C && B !== Dn) ? B : P;
      const o2 = (Dn === C && Dn !== B && C !== A) ? C : P, o3 = (B === Dn && B !== A && Dn !== C) ? Dn : P;
      const i = (y * 2) * w * 2 + x * 2;
      od[i] = o0; od[i + 1] = o1; od[i + w * 2] = o2; od[i + w * 2 + 1] = o3;
    }
    og.putImageData(oi, 0, 0);
    return out;
  };
})();
