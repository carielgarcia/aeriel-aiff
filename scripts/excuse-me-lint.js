#!/usr/bin/env node
/* EXCUSE ME copy lint. Run from the repo root:  node scripts/excuse-me-lint.js
   Reads every trilingual string t(`en`,`es`,`pt`) / T(...) in games/excuse-me/*.js and checks:
   1. VOICE BUDGETS: the English tics that made every character sound alike (similes, "a very [adj]",
      personification gags, "Nobody asks" stingers). Budgets sit just above the post-rewrite counts, so new
      writing has to spend them deliberately instead of adding to the pile.
   2. LANGUAGE RULES: no voseo in Spanish, no European Portuguese, « » quotes, … not "...", {name} and ${} parity.
   Exit code 1 when anything is over budget or broken. No dependencies. */
'use strict';
const fs = require('fs'), path = require('path');
const DIR = path.join(__dirname, '..', 'games', 'excuse-me');
const Q = "(`(?:\\\\[\\s\\S]|[^`\\\\])*`|'(?:\\\\.|[^'\\\\\\n])*'|\"(?:\\\\.|[^\"\\\\\\n])*\")";
const RE = new RegExp('\\b[tT]\\(\\s*' + Q + '\\s*,\\s*' + Q + '\\s*,\\s*' + Q + '\\s*\\)', 'g');
const un = function (s) { return s.slice(1, -1).replace(/\\(.)/g, function (m, c) { return c === 'n' ? '\n' : c; }); };
const rows = [];
fs.readdirSync(DIR).filter(function (f) { return f.endsWith('.js'); }).forEach(function (f) {
  const src = fs.readFileSync(path.join(DIR, f), 'utf8'); let m;
  while ((m = RE.exec(src))) rows.push({ loc: f + ':' + src.slice(0, m.index).split('\n').length, en: un(m[1]), es: un(m[2]), pt: un(m[3]) });
});

/* ---- 1. voice budgets (English). Raise one only with a reason in the commit message. ---- */
const BUDGETS = [
  ['simile "like a/an/the ..."', /\blike (a|an|the|someone|somebody|two|three)\b/gi, 58],
  ['"the way a/you ..." simile', /\bthe way (a|an|you|people|someone|somebody)\b/gi, 8],
  ['"as if / as though"', /\bas (if|though)\b/gi, 10],
  ['"a very [adj]"', /\b(a|an) (very|truly|deeply|entirely|perfectly) [a-z]+/gi, 12],
  ['"a person/man/woman who ..."', /\b(a|the) (person|man|woman|human) (who|with|of|whose)\b/gi, 18],
  ['"Nobody asks / knows / says" stinger', /\bnobody (asks|knows|says|tells|notices|has ever)\b/gi, 16],
  ['personification gags (has opinions / files a complaint / with great ceremony)', /\b(has|have) (strong |very )?opinions?\b|\bfiles? (a |one )?(formal|sincere|single|small)?,? ?complaint|\bwith (total|great|enormous|terrifying|utmost|absolute|complete|ceremonial)( [a-z]+)? ?(seriousness|ceremony|dignity|grace|solemnity|reverence)/gi, 3]
];
/* ---- 2. language rules ---- */
const L = '\\p{L}';
const VOSEO = new RegExp('(?<!' + L + ')(vos|tenés|querés|sos|andá|mirá|decí|fijate|pensás|podés|sabés|hacé|vení|boludo|laburo)(?!' + L + ')', 'iu');
const EUPT = new RegExp('(?<!' + L + ')(telemóvel|autocarro|casa de banho|pequeno-almoço|fixe|miúdo|rapariga|comboio|ecrã|estás|tens|fazes|queres|vais|podes)(?!' + L + ')', 'iu');
const ph = function (s) { return (s.match(/\{name\}/g) || []).length; };
const ex = function (s) { return (s.match(/\$\{[^}]*\}/g) || []).length; };

let bad = 0;
const fail = function (msg) { bad++; console.log('FAIL  ' + msg); };
console.log('EXCUSE ME lint: ' + rows.length + ' trilingual strings\n');
BUDGETS.forEach(function (b) {
  let n = 0; rows.forEach(function (r) { n += (r.en.match(b[1]) || []).length; });
  const ok = n <= b[2];
  console.log((ok ? 'ok    ' : 'FAIL  ') + String(n).padStart(3) + ' / ' + String(b[2]).padStart(3) + '  ' + b[0]);
  if (!ok) bad++;
});
console.log('');
rows.forEach(function (r) {
  if (VOSEO.test(r.es)) fail(r.loc + ' voseo in Spanish: ' + r.es.match(VOSEO)[0]);
  if (EUPT.test(r.pt)) fail(r.loc + ' European Portuguese: ' + r.pt.match(EUPT)[0]);
  if (/"[^"]{3,}"/.test(r.es) && !/«/.test(r.es)) fail(r.loc + ' Spanish uses straight quotes');
  if (/"[^"]{3,}"/.test(r.pt) && !/«/.test(r.pt)) fail(r.loc + ' Portuguese uses straight quotes');
  if (/\.\.\./.test(r.en + r.es + r.pt)) fail(r.loc + ' ASCII "..." (use the single character …)');
  if (!r.en.trim() || !r.es.trim() || !r.pt.trim()) fail(r.loc + ' empty language');
  if (ph(r.en) !== ph(r.es) || ph(r.en) !== ph(r.pt)) fail(r.loc + ' {name} count differs between languages');
  if (ex(r.en) !== ex(r.es) || ex(r.en) !== ex(r.pt)) fail(r.loc + ' ${} count differs between languages');
});
console.log(bad ? '\n' + bad + ' problem(s).' : '\nAll clear.');
process.exit(bad ? 1 : 0);
