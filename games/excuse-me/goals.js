/* EXCUSE ME — where the active missions point.
   EM.goalSpots(state) returns one spot per current objective: { zone, x, y, quest } in tile coordinates of the
   (compacted) zone. The club map draws a star on each. People you are looking for come from EM.seekTargets
   (seek.js); everything else is a table keyed by quest id, driven by the same flags the quest text uses.
   A spec is { ent: id } (an NPC or object, found in whichever zone holds it), { zone } (the room as a whole)
   or { zone, x, y } (a tile). Must load after seek.js and every story file. */
'use strict';
(function () {
  const EM = window.EM;
  const F = function (s, k) { return !!s.flags[k]; };
  const sum = function (s, ks) { return ks.filter(function (k) { return F(s, k); }).length; };

  const GOALS = {
    q1: function (s) { return s.zone === 'doors' && !F(s, 'bouncer_ok') ? [{ ent: 'dragan' }] : [{ zone: 'main', x: 5.5, y: 15.5 }]; }, /* the pillar by the left speaker */
    q2: function () { return [{ zone: 'restrooms' }]; },
    q3: function () { return [{ ent: 'host' }]; },
    q4: function () { return [{ ent: 'rosa' }]; },
    q5: function (s) { return s.pill && s.pill.tested ? [{ zone: 'main' }] : [{ ent: 'nuri' }]; },
    q7: function () { return [{ ent: 'peak_spot' }]; },
    q10: function () { return [{ zone: 'main' }]; }, /* dance with your people on the main floor */
    q9: function () { return [{ ent: 'sunrise_spot' }]; },
    q13: function () { return [{ ent: 'frames_roof' }]; },
    q14: function () { return [{ ent: 'afters_host' }]; },
    /* q8 (find Benjamin and Fernando), q11 (the DJ) and q12 (FRAMES SHELL) are covered by the seekers */
    sq_rosa: function (s) {
      const out = [];
      if (!F(s, 'rosa_e1')) out.push({ ent: 'tavi' });
      if (!F(s, 'rosa_e2')) out.push({ ent: 'luca' });
      if (!F(s, 'rosa_e3')) out.push({ ent: 'water_w' });
      if (sum(s, ['rosa_e1', 'rosa_e2', 'rosa_e3']) >= (F(s, 'rosa_probation') ? 1 : 2)) out.push({ ent: 'rosa' });
      return out;
    },
    sq_biscuit: function (s) { return [{ ent: F(s, 'phone_held') ? 'luca' : 'lostphone' }]; },
    sq_kai: function (s) { return F(s, 'battery') ? [{ ent: 'kai' }] : [{ ent: 'bruce' }, { ent: 'mina' }]; },
    sq_lamp: function (s) { return [{ ent: !F(s, 'lamp_met') || F(s, 'lamp_gel') ? 'lampie' : 'geldrawer' }]; },
    sq_sia: function (s) {
      const out = [];
      if (!F(s, 'word_warm')) out.push({ zone: 'welfare' });
      if (!F(s, 'word_brave')) out.push({ zone: 'darkroom' });
      if (!F(s, 'word_silly')) out.push({ zone: 'main' });
      return out.length ? out : [{ ent: 'sia' }];
    },
    sq_isi: function (s) { return F(s, 'have_sandwich') || F(s, 'have_prawn') ? [{ ent: 'nuri' }] : [{ ent: 'vend', zone: 'foyer' }, { ent: 'ines' }]; },
    sq_napkin: function () { return [{ ent: 'resident' }]; },
    rv_petition: function (s) {
      const sig = [['sig_bea', 'bea'], ['sig_klaus', 'klaus'], ['sig_madison', 'madison'], ['sig_juniper', 'juniper'], ['sig_sub', 'sub']];
      if (sig.filter(function (p) { return F(s, p[0]); }).length >= 3) return [{ ent: 'maya' }];
      return sig.filter(function (p) { return !F(s, p[0]); }).map(function (p) { return { ent: p[1] }; });
    },
    sq_honey: function (s) {
      if (!F(s, 'fran_met')) return [{ ent: 'fran' }];
      return [{ ent: F(s, 'have_honeygum') ? 'lalo' : 'rumi' }];
    },
    sq_queue: function () { return [{ ent: 'rosario_q' }]; },
    sq_roots: function () { return [{ ent: 'hugo' }]; },
    sq_licence: function (s) {
      if (!F(s, 'lic_open')) return [{ ent: 'ofelia' }];
      const out = [];
      if (!F(s, 'lic_hugo')) out.push({ ent: 'hugo' });
      if (!F(s, 'lic_luca')) out.push({ ent: 'luca' });
      if (!F(s, 'lic_neigh')) out.push({ ent: 'valdes' });
      return out.length ? out : [{ ent: 'ofelia' }];
    }
  };

  function find(id, zoneHint) {
    const ids = zoneHint ? [zoneHint] : Object.keys(EM.zones);
    for (let i = 0; i < ids.length; i++) {
      const z = EM.zones[ids[i]]; if (!z) continue;
      for (let k = 0; k < z.ents.length; k++) if (z.ents[k].id === id && z.ents[k].type !== 'door') return { z: z, e: z.ents[k] };
    }
    return null;
  }
  function spot(spec, s, quest) {
    if (spec.ent) {
      const hit = find(spec.ent, spec.zone); if (!hit) return null;
      const e = hit.e, mv = s.moved && s.moved[e.id];
      let x, y;
      if (mv) { x = mv.x; y = mv.y; }
      else if (e.type === 'npc') { x = e.box || e.x !== Math.floor(e.x) ? e.x : e.x + 0.5; y = e.box || e.y !== Math.floor(e.y) ? e.y : e.y + 0.5; }
      else { x = e.x + e.w / 2; y = e.y + e.h / 2; }
      return { zone: hit.z.id, x: x, y: y, quest: quest, npc: e.type === 'npc' };
    }
    const z = EM.zones[spec.zone]; if (!z) return null;
    return { zone: z.id, x: spec.x !== undefined ? spec.x : z.w / 2, y: spec.y !== undefined ? spec.y : z.h / 2, quest: quest };
  }

  /* side quests only (sq_ and rv_ ids): these get the blue stars and arrows in the game world */
  EM.sideSpots = function (s) { return EM.goalSpots(s).filter(function (g) { return /^(sq_|rv_)/.test(g.quest); }); };

  EM.goalSpots = function (s) {
    const out = [];
    if (!s || s.ended) return out;
    const add = function (p) {
      if (!p) return;
      for (let i = 0; i < out.length; i++) if (out[i].zone === p.zone && Math.hypot(out[i].x - p.x, out[i].y - p.y) < 2) return;
      out.push(p);
    };
    Object.keys(GOALS).forEach(function (id) {
      if (s.quests[id] !== 'active') return;
      (GOALS[id](s) || []).forEach(function (sp) { add(spot(sp, s, id)); });
    });
    /* the people being looked for: a friend who wandered off stands at their room's spot, anyone else is an NPC */
    const targets = EM.seekTargets ? EM.seekTargets(s) : {};
    Object.keys(targets).forEach(function (k) {
      const t = targets[k], z = EM.zones[t.zone]; if (!z) return;
      if (EM.FRIENDS && EM.FRIENDS.indexOf(k) !== -1) {
        const f = z.friendAt[z.id] || z.friendAt['default'];
        add(f ? { zone: z.id, x: f.x + 0.5, y: f.y + 0.5, quest: 'seek' } : { zone: z.id, x: z.w / 2, y: z.h / 2, quest: 'seek' });
      } else add(spot({ ent: k }, s, 'seek') || { zone: z.id, x: z.w / 2, y: z.h / 2, quest: 'seek' });
    });
    return out;
  };
})();
