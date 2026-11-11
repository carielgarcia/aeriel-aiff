/* EXCUSE ME — room compaction.
   The toilets, the quiet room and the smoking area were drawn far larger than they play, which made the club
   impossible to show to scale. This file removes redundant rows and columns from those three zones once, after
   every story file has placed its people and objects with the ORIGINAL coordinates. Each cut is a row or column
   that is identical to its neighbour (plain floor, grass, wall) and holds no person, sign or one-tile object.
   Everything inside the zone (tiles, doors, objects, NPCs, signs, lights, crowd rects, friend spots) is remapped,
   so no story file needs to change. Runtime arrivals (doors, travel, saves from before the change) go through
   EM.compactPt / EM.compactSave. Must load after the last story file. */
'use strict';
(function () {
  const EM = window.EM;
  const CUTS = {
    restrooms: { cols: [2, 3, 4, 6, 7, 8, 16, 18, 24, 27, 30], rows: [13, 15, 16, 18, 20] },
    courtyard: { cols: [3, 5, 10, 11, 12, 15, 16, 23, 25, 34, 37], rows: [19, 20, 21, 22, 23, 24, 25] },
    welfare: { cols: [3, 4, 6, 9, 15, 19], rows: [10] }
  };

  function axis(n, cuts) {
    const cut = new Array(n).fill(false);
    cuts.forEach(function (i) { cut[i] = true; });
    const before = []; let k = 0;
    for (let i = 0; i <= n; i++) { before.push(k); if (i < n && !cut[i]) k++; }
    return {
      n: n, cut: cut, size: k,
      /* a point: position inside a kept cell is preserved; a point in a cut cell lands on the seam */
      pt: function (v) { const i = Math.max(0, Math.min(n - 1, Math.floor(v))); return before[i] + (cut[i] ? 0 : v - i); },
      /* a span [v, v+len): its new start and how many kept cells it still covers */
      span: function (v, len) {
        const a = Math.max(0, Math.floor(v)), b = Math.min(n, Math.ceil(v + len));
        let c = 0; for (let i = a; i < b; i++) if (!cut[i]) c++;
        return [before[a], Math.max(len > 0 ? 1 : 0, c)];
      }
    };
  }

  const MAPS = {};
  Object.keys(CUTS).forEach(function (id) {
    const z = EM.zones[id]; if (!z) return;
    const ax = axis(z.w, CUTS[id].cols), ay = axis(z.h, CUTS[id].rows);
    MAPS[id] = { ax: ax, ay: ay };
    const W = ax.size, H = ay.size;
    const tiles = new Uint8Array(W * H), crowd = new Uint8Array(W * H);
    for (let y = 0, ny = 0; y < z.h; y++) {
      if (ay.cut[y]) continue;
      for (let x = 0, nx = 0; x < z.w; x++) {
        if (ax.cut[x]) continue;
        tiles[ny * W + nx] = z.tiles[y * z.w + x]; crowd[ny * W + nx] = z.crowd[y * z.w + x]; nx++;
      }
      ny++;
    }
    z.ents.forEach(function (e) {
      if (e.type === 'npc') {
        if (e.box) {
          const sx = ax.span(e.x - e.box.w / 2, e.box.w), sy = ay.span(e.y - e.box.h / 2, e.box.h);
          e.x = sx[0] + sx[1] / 2; e.y = sy[0] + sy[1] / 2; e.box.w = sx[1]; e.box.h = sy[1];
        } else { e.x = ax.pt(e.x); e.y = ay.pt(e.y); }
      } else {
        const sx = ax.span(e.x, e.w), sy = ay.span(e.y, e.h);
        e.x = sx[0]; e.w = sx[1]; e.y = sy[0]; e.h = sy[1];
      }
    });
    z.signs.forEach(function (s) { s.x = Math.round(ax.pt(s.x)); s.y = Math.round(ay.pt(s.y)); });
    z.lights.forEach(function (l) { l.x = ax.pt((l.x - 8) / 16) * 16 + 8; l.y = ay.pt((l.y - 8) / 16) * 16 + 8; });
    Object.keys(z.friendAt).forEach(function (k) { const f = z.friendAt[k]; f.x = ax.pt(f.x); f.y = ay.pt(f.y); });
    z.crowdRects.forEach(function (c) { const sx = ax.span(c.x, c.w), sy = ay.span(c.y, c.h); c.x = sx[0]; c.w = sx[1]; c.y = sy[0]; c.h = sy[1]; });
    z.tiles = tiles; z.crowd = crowd; z.w = W; z.h = H;
  });

  /* authored coordinates (door arrivals, travel scripts) -> the compacted zone */
  EM.compactPt = function (zoneId, x, y) {
    const m = MAPS[zoneId]; if (!m || x === undefined) return [x, y];
    return [m.ax.pt(x), m.ay.pt(y)];
  };

  /* every new state is stamped as using the compacted layout; an older save is moved onto it once */
  const newState0 = EM.newState;
  EM.newState = function () { const s = newState0.apply(this, arguments); s.lay2 = 1; return s; };
  EM.compactSave = function (s) {
    if (!s || s.lay2) return s;
    const m = MAPS[s.zone];
    if (m) {
      const p = EM.compactPt(s.zone, s.x / 16, (s.y - 12) / 16);
      s.x = p[0] * 16; s.y = p[1] * 16 + 12;
    }
    s.lay2 = 1;
    return s;
  };
})();
