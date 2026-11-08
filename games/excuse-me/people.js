/* EXCUSE ME — people, 16-bit: a layered, parametric character generator.
   A character is a "look" (a handful of small integers). Every part (body, head, face, hair, outfit, shoes, accessories) is drawn
   from the same anchors in all four directions, so any combination composes. Sprites are 36x68 device pixels: a 32x64 body box
   plus a 2 px outline margin, which is the old 18x34 logical box at the render scale (EM.RS = 2).
   This file: the catalog (options and their names) and the legacy mapping. The drawing is in people_draw.js. */
'use strict';
(function () {
  const EM = window.EM, T = EM.T;
  const C = EM.CHAR = {};
  const NM = function (arr) { return arr.map(function (x) { return T(x[0], x[1], x[2]); }); };

  /* ------------------------------------------------------------ colours (the first entries are the originals, so every old look is unchanged) */
  EM.SKINS = ['#FFE0C9', '#F4C79B', '#DDA66F', '#B97A4F', '#8A5634', '#5A3622', '#FBE6DA', '#E6B48E', '#A56B42', '#3E2418'];
  EM.HAIRS = ['#171717', '#4A2E1A', '#7A4B2A', '#E9C46A', '#D9622B', '#A9A9B3', '#F2F2F2', '#FF4FA3', '#3D7BFF', '#14C8B0',
    '#7B2D8E', '#9E1B32', '#C9A27A', '#2B2440', '#FF9CC4', '#8CE0D0', '#B5651D', '#5E7A99'];
  EM.CLOTHES = ['#F4F4F4', '#141414', '#FF2D95', '#19D3FF', '#B6FF3B', '#FFB020', '#8A5CFF', '#FF3B30', '#2F6BFF', '#00C2A8', '#FF6A00', '#E8DFC8',
    '#7A2E3A', '#2E5E3A', '#FF9CC4', '#6B4B2A', '#3B3F8F', '#9A9AA6'];
  EM.BOTTOMS = ['#2F4F9F', '#141414', '#555560', '#7A2E3A', '#2E5E3A', '#6B4B2A', '#FF2D95', '#19D3FF', '#8A5CFF', '#E8DFC8',
    '#1B2A55', '#B7B7C2', '#C9A27A', '#3D2F4F'];
  EM.EYES = ['#2A1A10', '#7A5A2A', '#2F8F5B', '#2F6B9F', '#7C8794', '#B8731E', '#7A4DB8', '#0E0E12'];
  EM.ACCENTS = ['#FF2D95', '#19D3FF', '#B6FF3B', '#FFB020', '#8A5CFF', '#FF6A00', '#FF3B30', '#00C2A8', '#FFD23F'];
  EM.LOOK = { skin: 6, hair: 20, hc: 18, expr: 10, top: 18, tc: 18, bottom: 11, bc: 14, acc: 8 };

  /* ------------------------------------------------------------ the options, in the order the creator shows them */
  C.names = {
    skin: NM([['PORCELAIN', 'PORCELANA', 'PORCELANA'], ['SAND', 'ARENA', 'AREIA'], ['TAN', 'BRONCEADO', 'BRONZEADO'], ['CARAMEL', 'CARAMELO', 'CARAMELO'], ['BROWN', 'MARRÓN', 'MARROM'], ['DEEP', 'PROFUNDO', 'PROFUNDO'],
      ['ROSE', 'ROSADO', 'ROSADO'], ['HONEY', 'MIEL', 'MEL'], ['CHESTNUT', 'CASTAÑA', 'CASTANHA'], ['EBONY', 'ÉBANO', 'ÉBANO']]),
    build: NM([['SLIM', 'DELGADO', 'MAGRO'], ['REGULAR', 'NORMAL', 'NORMAL'], ['BROAD', 'ANCHO', 'LARGO']]),
    eye: NM([['BROWN', 'CAFÉ', 'CASTANHO'], ['HAZEL', 'AVELLANA', 'AVELÃ'], ['GREEN', 'VERDE', 'VERDE'], ['BLUE', 'AZUL', 'AZUL'], ['GREY', 'GRIS', 'CINZA'], ['AMBER', 'ÁMBAR', 'ÂMBAR'], ['VIOLET', 'VIOLETA', 'VIOLETA'], ['BLACK', 'NEGRO', 'PRETO']]),
    expr: NM([['NEUTRAL', 'CARA NEUTRA', 'CARA NEUTRA'], ['SMILE', 'SONRISA', 'SORRISO'], ['GRIN', 'SONRISOTA', 'SORRISÃO'], ['SMIRK', 'MEDIA SONRISA', 'MEIO SORRISO'], ['SLEEPY FACE', 'CARA DE SUEÑO', 'CARA DE SONO'], ['WIDE-EYED', 'OJOS ABIERTOS', 'OLHOS ARREGALADOS'],
      ['CONTENT', 'CARA TRANQUILA', 'CARA TRANQUILA'], ['CHEEKY', 'CARA TRAVIESA', 'CARA TRAVESSA'], ['WORRIED', 'CARA PREOCUPADA', 'CARA PREOCUPADA'], ['DEADPAN', 'CARA IMPASIBLE', 'CARA IMPASSÍVEL']]),
    fhair: NM([['NONE', 'NADA', 'NADA'], ['STUBBLE', 'BARBA DE DÍAS', 'BARBA POR FAZER'], ['MOUSTACHE', 'BIGOTE', 'BIGODE'], ['GOATEE', 'PERILLA', 'BODE'], ['FULL BEARD', 'BARBA', 'BARBA CHEIA'], ['SOUL PATCH', 'MOSCA', 'MOSCA']]),
    hair: NM([['BALD', 'CALVO', 'CARECA'], ['BUZZ', 'RAPADO', 'RASPADO'], ['SHORT', 'CORTO', 'CURTO'], ['LONG', 'LARGO', 'LONGO'], ['AFRO', 'AFRO', 'AFRO'], ['MOHAWK', 'MOHAWK', 'MOICANO'], ['BUN', 'MOÑO', 'COQUE'], ['BOB', 'BOB', 'BOB'], ['PIGTAILS', 'COLETAS', 'MARIA-CHIQUINHA'],
      ['PONYTAIL', 'COLA DE CABALLO', 'RABO DE CAVALO'], ['CURLY CROP', 'RIZOS CORTOS', 'CACHOS CURTOS'], ['UNDERCUT', 'UNDERCUT', 'UNDERCUT'], ['WAVY LONG', 'ONDAS LARGAS', 'ONDAS LONGAS'], ['SPACE BUNS', 'DOS MOÑOS', 'DOIS COQUES'],
      ['BRAIDS', 'TRENZAS', 'TRANÇAS'], ['SLICKED BACK', 'PEINADO ATRÁS', 'PENTEADO PRA TRÁS'], ['SHAG', 'DESFILADO', 'DESFIADO'], ['DREADS', 'DREADS', 'DREADS'], ['POMPADOUR', 'TUPÉ', 'TOPETE'], ['HALF-UP', 'MEDIO RECOGIDO', 'MEIO PRESO']]),
    hc: NM([['BLACK', 'NEGRO', 'PRETO'], ['DARK BROWN', 'CASTAÑO OSCURO', 'CASTANHO ESCURO'], ['BROWN', 'CASTAÑO', 'CASTANHO'], ['BLONDE', 'RUBIO', 'LOURO'], ['GINGER', 'PELIRROJO', 'RUIVO'], ['GREY', 'GRIS', 'CINZA'], ['WHITE', 'BLANCO', 'BRANCO'], ['PINK', 'ROSA', 'ROSA'],
      ['BLUE', 'AZUL', 'AZUL'], ['TEAL', 'TURQUESA', 'TURQUESA'], ['PURPLE', 'MORADO', 'ROXO'], ['BURGUNDY', 'BORGOÑA', 'BORDÔ'], ['DIRTY BLONDE', 'RUBIO OSCURO', 'LOURO ESCURO'], ['INK', 'AZABACHE', 'AZUL-NOITE'],
      ['PASTEL PINK', 'ROSA PASTEL', 'ROSA PASTEL'], ['MINT', 'MENTA', 'MENTA'], ['COPPER', 'COBRE', 'COBRE'], ['STEEL', 'ACERO', 'AÇO']]),
    top: NM([['TEE', 'CAMISETA', 'CAMISETA'], ['TANK', 'MUSCULOSA', 'REGATA'], ['STRIPES', 'RAYAS', 'LISTRAS'], ['HOODIE', 'BUZO', 'MOLETOM'], ['MESH', 'MALLA', 'TELA'], ['HARNESS', 'ARNÉS', 'HARNESS'], ['CROP TOP', 'CROP TOP', 'CROPPED'],
      ['DRESS', 'VESTIDO', 'VESTIDO'], ['VEST', 'CHALECO', 'COLETE'], ['LEATHER JACKET', 'CHAQUETA DE CUERO', 'JAQUETA DE COURO'], ['CROSS VEST', 'CHALECO CRUZ', 'COLETE CRUZ'],
      ['BUTTON SHIRT', 'CAMISA', 'CAMISA'], ['KNIT SWEATER', 'SUÉTER', 'SUÉTER'], ['BOMBER', 'BOMBER', 'BOMBER'], ['TRACK JACKET', 'CHAQUETA DEPORTIVA', 'JAQUETA ESPORTIVA'], ['SEQUINS', 'LENTEJUELAS', 'LANTEJOULAS'],
      ['DUNGAREES', 'OVEROL', 'MACACÃO'], ['CARDIGAN', 'CARDIGÁN', 'CARDIGÃ']]),
    tc: NM([['WHITE', 'BLANCO', 'BRANCO'], ['BLACK', 'NEGRO', 'PRETO'], ['MAGENTA', 'MAGENTA', 'MAGENTA'], ['CYAN', 'CIAN', 'CIANO'], ['LIME', 'LIMA', 'LIMA'], ['AMBER', 'ÁMBAR', 'ÂMBAR'], ['VIOLET', 'VIOLETA', 'VIOLETA'], ['RED', 'ROJO', 'VERMELHO'],
      ['BLUE', 'AZUL', 'AZUL'], ['TEAL', 'TURQUESA', 'TURQUESA'], ['ORANGE', 'NARANJA', 'LARANJA'], ['CREAM', 'CREMA', 'CREME'], ['WINE', 'VINO', 'VINHO'], ['FOREST', 'BOSQUE', 'FLORESTA'], ['PINK', 'ROSA', 'ROSA'], ['BROWN', 'MARRÓN', 'MARROM'],
      ['INDIGO', 'ÍNDIGO', 'ÍNDIGO'], ['GREY', 'GRIS', 'CINZA']]),
    bottom: NM([['JEANS', 'JEANS', 'JEANS'], ['PANTS', 'PANTALÓN', 'CALÇA'], ['SHORTS', 'SHORTS', 'SHORTS'], ['SKIRT', 'FALDA', 'SAIA'], ['CARGO', 'CARGO', 'CARGO'], ['LEATHER', 'CUERO', 'COURO'], ['WIDE LEG', 'PIERNA ANCHA', 'PERNA LARGA'],
      ['JOGGERS', 'JOGGERS', 'JOGGERS'], ['MAXI SKIRT', 'FALDA LARGA', 'SAIA LONGA'], ['BIKE SHORTS', 'CALZA CORTA', 'BERMUDA JUSTA'], ['PLAID SKIRT', 'FALDA ESCOCESA', 'SAIA XADREZ']]),
    bc: NM([['DENIM', 'JEAN', 'JEANS'], ['BLACK', 'NEGRO', 'PRETO'], ['GREY', 'GRIS', 'CINZA'], ['WINE', 'VINO', 'VINHO'], ['GREEN', 'VERDE', 'VERDE'], ['BROWN', 'MARRÓN', 'MARROM'], ['MAGENTA', 'MAGENTA', 'MAGENTA'], ['CYAN', 'CIAN', 'CIANO'],
      ['VIOLET', 'VIOLETA', 'VIOLETA'], ['CREAM', 'CREMA', 'CREME'], ['NAVY', 'MARINO', 'MARINHO'], ['SILVER', 'PLATA', 'PRATA'], ['KHAKI', 'CAQUI', 'CAQUI'], ['PLUM', 'CIRUELA', 'AMEIXA']]),
    shoes: NM([['SNEAKERS', 'ZAPATILLAS', 'TÊNIS'], ['BOOTS', 'BOTAS', 'BOTAS'], ['HIGH-TOPS', 'BOTINES', 'CANO ALTO'], ['PLATFORMS', 'PLATAFORMAS', 'PLATAFORMAS'], ['SANDALS', 'SANDALIAS', 'SANDÁLIAS'], ['LOAFERS', 'MOCASINES', 'MOCASSINS']]),
    ac: NM([['MAGENTA', 'MAGENTA', 'MAGENTA'], ['CYAN', 'CIAN', 'CIANO'], ['LIME', 'LIMA', 'LIMA'], ['AMBER', 'ÁMBAR', 'ÂMBAR'], ['VIOLET', 'VIOLETA', 'VIOLETA'], ['ORANGE', 'NARANJA', 'LARANJA'], ['RED', 'ROJO', 'VERMELHO'], ['TEAL', 'TURQUESA', 'TURQUESA'], ['YELLOW', 'AMARILLO', 'AMARELO']]),
    hat: NM([['NONE', 'NADA', 'NADA'], ['CAP', 'GORRA', 'BONÉ'], ['BACKWARDS CAP', 'GORRA AL REVÉS', 'BONÉ PRA TRÁS'], ['BANDANA', 'BANDANA', 'BANDANA'], ['HEADPHONES', 'AURICULARES', 'FONES'], ['BEANIE', 'GORRO', 'TOUCA'], ['HEADBAND', 'CINTA', 'FAIXA'],
      ['BUCKET HAT', 'SOMBRERO DE PESCADOR', 'CHAPÉU BUCKET'], ['CAT EARS', 'OREJAS DE GATO', 'ORELHAS DE GATO'], ['FLOWER CROWN', 'CORONA DE FLORES', 'COROA DE FLORES']]),
    face: NM([['NONE', 'NADA', 'NADA'], ['SUNGLASSES', 'LENTES', 'ÓCULOS ESCUROS'], ['ROUND GLASSES', 'LENTES REDONDOS', 'ÓCULOS REDONDOS'], ['FACE PAINT', 'PINTURA', 'PINTURA'], ['GLITTER', 'BRILLANTINA', 'GLITTER'], ['FRECKLES', 'PECAS', 'SARDAS'], ['WRAP SHADES', 'LENTES DEPORTIVOS', 'ÓCULOS ESPORTIVOS']]),
    neck: NM([['NONE', 'NADA', 'NADA'], ['CHAINS', 'CADENAS', 'CORRENTES'], ['SCARF', 'BUFANDA', 'CACHECOL'], ['CHOKER', 'GARGANTILLA', 'GARGANTILHA'], ['LANYARD', 'CORDÓN', 'CORDÃO'], ['NECK BANDANA', 'BANDANA AL CUELLO', 'BANDANA NO PESCOÇO']]),
    ear: NM([['NONE', 'NADA', 'NADA'], ['STUDS', 'ARETES', 'BRINCOS'], ['HOOPS', 'ARGOLLAS', 'ARGOLAS'], ['DANGLES', 'COLGANTES', 'PENDENTES']])
  };
  /* groups for the creator (the order shown on screen): [group id, [part keys]] */
  C.groups = [['body', ['skin', 'build']], ['face', ['expr', 'eye', 'fhair']], ['hair', ['hair', 'hc']], ['outfit', ['top', 'tc', 'bottom', 'bc', 'shoes', 'ac']], ['extras', ['hat', 'face', 'neck', 'ear']]];
  C.sizes = { skin: 10, build: 3, eye: 8, expr: 10, fhair: 6, hair: 20, hc: 18, top: 18, tc: 18, bottom: 11, bc: 14, shoes: 6, ac: 9, hat: 10, face: 7, neck: 6, ear: 4 };
  /* the creator shows skin tones from light to deep, not in storage order */
  C.order = { skin: [6, 0, 1, 7, 2, 3, 8, 4, 5, 9] };
  /* the keys a look can carry (everything else, like tee and ol, is passed through) */
  C.keys = Object.keys(C.sizes);

  /* ------------------------------------------------------------ legacy looks: every old NPC look still renders */
  /* old accessory (acc) -> the new slots. 0 none, 1 sunglasses, 2 cap, 3 bandana, 4 headphones, 5 chains, 6 face paint, 7 beanie */
  const ACC = { 1: { face: 1 }, 2: { hat: 1 }, 3: { hat: 3 }, 4: { hat: 4 }, 5: { neck: 1 }, 6: { face: 3 }, 7: { hat: 5 } };
  /* fill every key the generator needs. Old looks have skin, hair, hc, expr, top, tc, bottom, bc, acc (and sometimes ac, wide, tee). */
  C.normalize = function (look) {
    const L = look || {}, K = {};
    const n = function (k, d) { const v = L[k]; return v === undefined || v === null ? d : (v | 0) % C.sizes[k]; };
    K.skin = n('skin', 2); K.hair = n('hair', 2); K.hc = n('hc', 0); K.expr = n('expr', 1);
    K.top = n('top', 0); K.tc = n('tc', 0); K.bottom = n('bottom', 1);
    K.bc = L.bc === undefined ? [0, 1, 2, 3, 4, 1, 1, 2, 3, 0, 0][K.bottom] : n('bc', 1);
    K.build = L.build !== undefined ? n('build', 1) : (L.wide ? 2 : 1);
    /* eye colour: the old rule (dark skin or dark default: brown; pale hair: blue) unless the look names one */
    K.eye = L.eye !== undefined ? n('eye', 0) : (K.skin >= 4 && K.skin !== 8 ? 7 : ((K.hc === 3 || K.hc === 6) ? 3 : 0));
    K.fhair = n('fhair', 0);
    K.shoes = L.shoes !== undefined ? n('shoes', 0) : (K.bottom === 5 ? 1 : 0);
    const a = ACC[L.acc | 0] || {};
    K.hat = L.hat !== undefined ? n('hat', 0) : (a.hat || 0);
    K.face = L.face !== undefined ? n('face', 0) : (a.face || 0);
    K.neck = L.neck !== undefined ? n('neck', 0) : (a.neck || 0);
    K.ear = n('ear', 0);
    K.ac = L.ac === undefined ? (K.tc + 3) % 9 : (L.ac | 0) % 9;
    K.accent = L.accentHex || EM.ACCENTS[K.ac];
    K.tee = L.tee || null; K.teeC = L.teeC || null; K.ol = L.ol || null;
    return K;
  };
  /* the key that makes two looks draw the same */
  C.key = function (look) { const K = C.normalize(look); return C.keys.map(function (k) { return K[k]; }).join(',') + '|' + K.accent + '|' + (K.tee || '') + (K.teeC || '') + (K.ol || ''); };
  /* a pleasant random look: every part drawn from a pool that composes well (no clashing neon head to toe) */
  C.random = function (rnd) {
    rnd = rnd || Math.random;
    const pick = function (n) { return Math.floor(rnd() * n); };
    const look = {};
    C.keys.forEach(function (k) { look[k] = pick(C.sizes[k]); });
    look.hat = rnd() < 0.55 ? 0 : 1 + pick(C.sizes.hat - 1);
    look.face = rnd() < 0.6 ? 0 : 1 + pick(C.sizes.face - 1);
    look.neck = rnd() < 0.6 ? 0 : 1 + pick(C.sizes.neck - 1);
    look.ear = rnd() < 0.5 ? 0 : 1 + pick(C.sizes.ear - 1);
    look.fhair = rnd() < 0.7 ? 0 : 1 + pick(C.sizes.fhair - 1);
    /* a top and bottom that are not the same colour, and a bottom colour that is not the skin */
    if (look.bc === 9 && look.tc === 11) look.bc = 1;
    if (look.tc === look.bc) look.bc = (look.bc + 1) % C.sizes.bc;
    return look;
  };
})();
