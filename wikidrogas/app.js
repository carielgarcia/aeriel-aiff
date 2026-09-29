/**
 * WIKIDROGAS DATA & APPLICATION ENGINE
 * Trilingual peer-reviewed harm reduction repository
 * Sources: DrugWise, Energy Control, PsychonautWiki, EMCDDA, PubMed/Google Scholar
 */

const WIKIDROGAS_DATA = [
  {
    id: "mdma",
    category: "empathogen",
    names: {
      en: { primary: "MDMA", street: "Ecstasy, Molly, XTC, Mandi, Cristal" },
      es: { primary: "MDMA", street: "Éxtasis, Moly, Pastis, Cristal, Rueda" },
      pt: { primary: "MDMA", street: "Êxtase, Michael Douglas, Bala, Cristal, Roda" }
    },
    dosimetry: {
      oral: { threshold: "30 mg", light: "40–75 mg", common: "75–125 mg", strong: "125–175 mg" },
      formula: "1.5 mg × bodyweight in kg (max ~120mg)"
    },
    timeline: {
      onset: "20–60 min",
      duration: "3–6 hrs",
      aftereffects: "12–48 hrs"
    },
    summary: {
      en: "Empathogen stimulant enhancing emotional empathy, sensory openness, euphoria, and social connection. Widely present in techno spaces.",
      es: "Estimulante empatógeno que incrementa la empatía emocional, apertura sensorial, euforia y conexión social. Frecuente en la escena techno.",
      pt: "Estimulante empatógeno que amplia a empatia emocional, abertura sensorial, euforia e conexão interpessoal. Comum na cena techno."
    },
    harmReduction: {
      en: [
        "Hydration control: Dancefloors induce hyperthermia. Sip water slowly: 250ml/hour during moderate activity, 500ml/hour during sustained dancing with electrolytes. Avoid overdrinking (risk of fatal hyponatremia).",
        "Cool down regularly: Take 10-15 min breaks from hot dancefloors to prevent heat stroke, the primary medical complication of MDMA.",
        "Test with reagents: High-dose pills or adulterants like cathinones (bath salts) or PMA/PMMA pose life threats. Test your substance.",
        "Follow the 6–8 week rule: Depletes serotonin storage vesicles. Allow minimum 6 to 12 weeks between sessions to avoid tolerance, mood crashes, and neurotoxicity."
      ],
      es: [
        "Control de hidratación: En pista se genera hipertermia. Beber despacio: 250ml/hora en actividad moderada, 500ml/hora si bailas intensamente con sales/electrolitos. Evitar el exceso brusco de agua (riesgo de hiponatremia mortal).",
        "Descansos de temperatura: Tomar pausas de 10-15 min fuera de salas calurosas para disipar calor corporal.",
        "Testeo de sustancias: Existen pastillas con dosis excesivas (>200-300mg) o adulteradas con catinonas o PMA/PMMA. Testea siempre antes de dosificar.",
        "Regla de 6 a 8 semanas: Vacía depósitos de serotonina. Espaciar su consumo al menos 2-3 meses para prevenir tolerancia, bajones severos y neurotoxicidad."
      ],
      pt: [
        "Controle de hidratação: Dançar eleva a temperatura corporal. Beba com moderação: 250ml/hora em repouso, até 500ml/hora dançando, com eletrólitos. Não beba água em excesso rápido (risco de hiponatremia).",
        "Pausas para resfriar: Saia da pista abafada por 10-15 minutos regularmente para evitar hipertermia.",
        "Reagentes de testagem: Comprimidos podem conter doses perigosas (>250mg) ou catinonas e PMA. Teste sempre.",
        "Intervalo de 6 a 8 semanas: A substância esgota a serotonina. Aguarde pelo menos 2 a 3 meses entre sessões para proteger os receptores e a saúde mental."
      ]
    },
    interactions: {
      en: "DANGEROUS: MAOIs / SSRIs / SNRIs (Serotonin Syndrome risk - potentially fatal). Stimulants (severe cardiovascular strain). Alcohol (dehydration & mask effect).",
      es: "PELIGROSO: IMAOs / ISRS / IRSN (Riesgo de Síndrome Serotoninérgico - potencialmente letal). Estimulantes (alta sobrecarga cardíaca). Alcohol (deshidratación y enmascaramiento).",
      pt: "PERIGOSO: IMAOs / ISRS / IRSN (Risco de Síndrome Serotoninérgica fatal). Estimulantes (sobrecarga cardiovascular extrema). Álcool (desidratação e máscara perceptiva)."
    },
    citations: "DrugWise UK; Energy Control Factsheets; Nichols DE, Chem Rev 2016."
  },
  {
    id: "ketamine",
    category: "dissociative",
    names: {
      en: { primary: "Ketamine", street: "K, Special K, Ket, Calvin Klein (with cocaine)" },
      es: { primary: "Ketamina", street: "Keta, Especial K, K, Calvin Klein (con cocaína)" },
      pt: { primary: "Ketamina", street: "Key, Keta, Cetamina, Especial K" }
    },
    dosimetry: {
      oral: { threshold: "5–10 mg (snorted)", light: "15–30 mg", common: "30–75 mg", strong: "75–150 mg (K-hole territory)" },
      formula: "Start with bumps (<20mg), not lines."
    },
    timeline: {
      onset: "1–5 min (snorted)",
      duration: "45–90 min",
      aftereffects: "1–3 hrs"
    },
    summary: {
      en: "Dissociative NMDA receptor antagonist inducing dose-dependent disconnection between body, sensory inputs, and conscious awareness.",
      es: "Disociativo antagonista de receptores NMDA que induce desconexión dosis-dependiente entre cuerpo, estímulos sensoriales y conciencia.",
      pt: "Dissociativo antagonista do receptor NMDA provocando desconexão dependente da dose entre corpo, sentidos e consciência."
    },
    harmReduction: {
      en: [
        "Avoid on crowded dancing floors: Impairs motor control, balance, and pain reception. High risk of traumatic physical injury and falls.",
        "Understanding the K-Hole: High doses trigger total mental detachment and paralysis. Ensure you are seated/lying down with trusted friends in a calm space.",
        "Do not eat immediately before: Nausea and vomiting combined with suppressed gag reflex create dangerous aspiration hazards. Fast 2 hours prior.",
        "Urinary & bladder warning: Frequent or chronic use induces ulcerative ketamine cystitis, severe bladder wall shrinkage, and renal impairment."
      ],
      es: [
        "Cuidado en pistas concurridas: Anula la propiocepción, coordinación y reflejos del dolor. Riesgo alto de caídas y traumatismos.",
        "Entender el K-Hole: Dosis altas provocan desconexión total y parálisis motora temporal. Permanecer sentado o acostado en lugar seguro con gente de confianza.",
        "No comer antes de consumir: Las náuseas unidas a la pérdida del reflejo de deglución conllevan riesgo severo de broncoaspiración. Ayunar 2 horas antes.",
        "Salud vesical: El uso frecuente o crónico provoca cistitis ulcerosa por ketamina, encogimiento de vejiga y daño renal irreversible."
      ],
      pt: [
        "Cuidado no meio da pista: Prejudica o equilíbrio, coordenação e percepção de dor. Alto risco de quedas e machucados.",
        "Compreendendo o K-Hole: Doses elevadas levam à paralisia física e desconexão sensorial completa. Fique sentado em local tranquilo com amigos de confiança.",
        "Não coma logo antes: A náusea somada à perda do reflexo de engolir cria risco gravíssimo de asfixia por vômito. Evite comer 2 horas antes.",
        "Proteção da bexiga: O uso frequente danifica as paredes da bexiga (cistite ulcerativa), podendo causar danos renais permanentes."
      ]
    },
    interactions: {
      en: "LETHAL RISK: Alcohol, GHB/GBL, Opioids, Benzodiazepines. Combining CNS depressants causes loss of consciousness, respiratory arrest, and vomit inhalation.",
      es: "RIESGO LETAL: Alcohol, GHB/GBL, Opioides, Benzodiacepinas. La mezcla de depresores del SNC produce paro respiratorio, coma y asfixia por vómito.",
      pt: "RISCO LETAL: Álcool, GHB/GBL, Opióides, Benzodiazepínicos. Mistura de depressores pode causar perda de consciência e parada respiratória fatal."
    },
    citations: "DrugWise UK; Energy Control; Morgan CJ & Curran HV, Addiction 2012."
  },
  {
    id: "ghb-gbl",
    category: "depressant",
    names: {
      en: { primary: "GHB / GBL", street: "G, Liquid Ecstasy, Gina, Geeb, Blue Nitro" },
      es: { primary: "GHB / GBL", street: "Éxtasis líquido, G, Bote, Chorri, Gina" },
      pt: { primary: "GHB / GBL", street: "G, Gisele, Êxtase líquido, GBL" }
    },
    dosimetry: {
      oral: { threshold: "0.5–1.0 ml (GHB)", light: "1.0–1.5 ml", common: "1.5–2.0 ml", strong: "2.0–2.5 ml (GBL is 2-3x stronger: 0.5-1.0ml max!)" },
      formula: "Always measure with 1ml oral syringe. NEVER use bottle caps."
    },
    timeline: {
      onset: "10–20 min",
      duration: "1.5–3 hrs",
      aftereffects: "2–4 hrs"
    },
    summary: {
      en: "Potent central nervous system depressant acting on GABA-B receptors. Steep dose-response curve: a fraction of a milliliter separates euphoria from coma.",
      es: "Potente depresor del sistema nervioso central actuando en receptores GABA-B. Margen terapéutico extremadamente estrecho: décimas de mililitro separan euforia de coma.",
      pt: "Potente depressor do sistema nervoso central atuando nos receptores GABA-B. Curva dose-resposta íngreme: frações de mililitro separam a euforia do coma."
    },
    harmReduction: {
      en: [
        "STRICT VOLUMETRIC DOSING: Never eyeball or dose with caps. Always use a calibrated 1ml or 2ml plastic oral syringe with clear markings.",
        "Set an alarm timer: Redosing too soon is the leading cause of G-overdose. Wait at absolute minimum 2 to 2.5 hours before any redose.",
        "Label your drink clearly: Never leave liquid G in plain bottles. Dye the liquid (food coloring) or mark containers to prevent accidental ingestion by others.",
        "Tolerance & severe dependence: Frequent use (every few hours) rapidly produces severe physical dependence with life-threatening delirium tremens-like withdrawal."
      ],
      es: [
        "DOSIFICACIÓN VOLUMÉTRICA ESTRICTA: Nunca usar tapones ni medir a ojo. Utilizar siempre una jeringuilla milimetrada de 1ml o 2ml.",
        "Poner alarma de tiempo: Redosificar antes de tiempo es la causa principal de sobredosis. Esperar mínimo 2 a 2.5 horas antes de considerar otra toma.",
        "Marcar y colorear el envase: Jamás dejar botellas sin rotular claramente. Usar colorante alimentario para evitar que amigos beban por error.",
        "Dependencia física severa: El uso continuado cada pocas horas genera abstinencia grave con riesgo vital similar al delirium tremens alcohólico."
      ],
      pt: [
        "DOSAGEM VOLUMÉTRICA PRECISA: Nunca meça na tampa ou a olho. Use exclusivamente seringa oral dosadora de 1ml ou 2ml.",
        "Use o cronômetro do celular: Redosar antes do tempo é a maior causa de coma por G. Espere no mínimo 2h a 2h30 entre as doses.",
        "Sinalize o copo/garrafa: Nunca deixe recipientes sem identificação. Coloque corante alimentício para evitar que alguém beba por engano.",
        "Risco de dependência física rápida: O uso contínuo desenvolve tolerância e crises de abstinência graves que exigem internação médica."
      ]
    },
    interactions: {
      en: "ABSOLUTELY CONTRAINDICATED: Alcohol, Ketamine, Opioids, Benzos. Even small sips of beer with G can induce sudden unconsciousness and respiratory arrest.",
      es: "ABSOLUTAMENTE CONTRAINDICADO: Alcohol, Ketamina, Opioides, Benzodiacepinas. Incluso un sorbo de cerveza puede desencadenar paro respiratorio o coma.",
      pt: "ABSOLUTAMENTE CONTRAINDICADO: Álcool, Ketamina, Opióides, Rivotril/calmantes. Misturar com um gole de álcool pode induzir coma e parada respiratória."
    },
    citations: "DrugWise UK; EMCDDA; Energy Control GHB protocols."
  },
  {
    id: "speed-amphetamine",
    category: "stimulant",
    names: {
      en: { primary: "Amphetamine (Speed)", street: "Speed, Whizz, Pep, Sulf, Paste" },
      es: { primary: "Anfetamina (Speed)", street: "Speed, Sulfato, Anfeta, Pep" },
      pt: { primary: "Anfetamina (Speed)", street: "Speed, Pasta base de anfetamina, Pep" }
    },
    dosimetry: {
      oral: { threshold: "5–10 mg", light: "10–20 mg", common: "20–40 mg", strong: "40–70 mg" },
      formula: "Dry paste fully before measuring; wet paste contains toxic industrial solvents."
    },
    timeline: {
      onset: "20–60 min (oral) / 5–15 min (snorted)",
      duration: "4–8 hrs",
      aftereffects: "12–24 hrs"
    },
    summary: {
      en: "Central nervous system psychostimulant increasing dopamine and norepinephrine transmission, inducing alertness, wakefulness, motor endurance, and appetite suppression.",
      es: "Psicoestimulante del sistema nervioso central que eleva dopamina y noradrenalina, generando alerta, vigilia continua, resistencia motora y supresión del apetito.",
      pt: "Psicoestimulante que eleva os níveis de dopamina e noradrenalina, promovendo vigília prolongada, foco, energia motora e supressão de apetite."
    },
    harmReduction: {
      en: [
        "Purify and dry the paste: Street speed paste is wet with leftover synthesis solvent residues. Spread on a plate and dry completely to avoid nasal burn and chemical ingestion.",
        "Remember to eat and hydrate: Amphetamine suppresses thirst and hunger signals. Force intake of nutritious smoothies, fruit, and mineral water.",
        "Dental hygiene: Causes teeth clenching (bruxism) and dry mouth (xerostomia). Chew gum and rinse mouth with water to protect enamel.",
        "Sleep deprivation psychosis: Staying awake past 24-48 hours frequently induces paranoid delusions and acute hallucinations. Prioritize sleep."
      ],
      es: [
        "Secar la pasta completamente: La pasta húmeda contiene disolventes químicos nocivos de la síntesis. Extender en un plato y dejar secar por completo antes de pulverizar.",
        "Nutrición e hidratación forzada: Bloquea el hambre y la sed. Tomar zumos naturales, fruta y agua con sales a intervalos regulares.",
        "Cuidado dental y bruxismo: Sequedad bucal y tensión mandibular dañan dientes y encías. Usar chicles sin azúcar e hidratar la boca.",
        "Psicosis por falta de sueño: Permanecer despierto más de 24-48 horas induce ideación paranoide, ansiedad y alucinaciones. Dormir es prioritario."
      ],
      pt: [
        "Seque a pasta por completo: A pasta de anfetamina úmida retém solventes químicos tóxicos da síntese. Espalhe e deixe secar antes de consumir.",
        "Alimente-se e hidrate-se: Inibe o apetite e a sede. Beba água e consuma frutas ou líquidos calóricos mesmo sem fome.",
        "Cuidado dental e bruxismo: Tensão nos dentes e boca seca danificam o esmalte. Masque chiclete sem açúcar e tome água.",
        "Privação de sono e psicose: Ficar acordado mais de 24 horas pode desencadear paranoia severa e alucinações. O descanso é essencial."
      ]
    },
    interactions: {
      en: "HIGH RISK: Other stimulants (Cocaine, MDMA) increase cardiac load, arrhythmia, and stroke risks. MAOIs (hypertensive crisis). Tramadol (seizure threshold lowered).",
      es: "ALTO RIESGO: Otros estimulantes (Cocaína, MDMA) multiplican la tensión cardíaca y arritmias. IMAOs (crisis hipertensiva letal). Tramadol (riesgo de convulsión).",
      pt: "ALTO RISCO: Outros estimulantes (Cocaína, MDMA) elevam sobrecarga cardíaca. IMAOs (crise hipertensiva perigosa). Tramadol (risco de convulsão)."
    },
    citations: "DrugWise UK; Heal DJ et al., Neuropharmacology 2013; Energy Control."
  },
  {
    id: "cocaine",
    category: "stimulant",
    names: {
      en: { primary: "Cocaine", street: "Coke, Blow, Snow, Charlie, White" },
      es: { primary: "Cocaína", street: "Coca, Perico, Blanca, Farlopa, Nieve" },
      pt: { primary: "Cocaína", street: "Pó, Neve, Branca, Raio, Farinha" }
    },
    dosimetry: {
      oral: { threshold: "10–20 mg (snorted)", light: "20–40 mg", common: "40–80 mg", strong: "80–120 mg" },
      formula: "Crush into fine powder; wash nasal cavity with saline spray."
    },
    timeline: {
      onset: "1–3 min (snorted)",
      duration: "30–60 min",
      aftereffects: "1–3 hrs"
    },
    summary: {
      en: "Potent tropane alkaloid dopamine, serotonin, and norepinephrine reuptake inhibitor with local anesthetic properties. Produces rapid, short-acting euphoria and alertness.",
      es: "Alcaloide tropánico inhibidor de la recaptación de dopamina, serotonina y noradrenalina con acción anestésica local. Produce euforia rápida y de corta duración.",
      pt: "Alcalóide estimulante inibidor da recaptação de dopamina e noradrenalina com propriedades anestésicas. Provoca euforia rápida e curta duração."
    },
    harmReduction: {
      en: [
        "Cardiovascular awareness: Constricts blood vessels while accelerating heart rate. Avoid heavy exertion or high temperatures if experiencing chest tightness.",
        "Nasal health care: Pulverize crystal chunks thoroughly. Always use individual clean straws (never rolled currency, which spreads Hepatitis C). Rinse nose with saline.",
        "Watch compulsive redosing: Short 30-45 min half-life frequently leads to compulsive use cycles and post-session depressive dysphoria.",
        "Adulterant awareness: Street cocaine frequently contains levamisole (immunosuppressant causing agranulocytosis) or phenacetin."
      ],
      es: [
        "Salud cardiovascular: Vasoconstrictor potente que acelera el ritmo cardíaco. Si sientes opresión en el pecho, cesa el baile y busca aire fresco.",
        "Cuidado nasal y hepatitis: Pulverizar fino. Usar tubos individuales desechables (nunca billetes, vector transmisor de Hepatitis C). Lavar con suero fisiológico.",
        "Evitar la compulsión de redosificación: Su corta duración (30-45 min) incita a consumos continuos y ansiedad intensa al descender.",
        "Adulterantes comunes: Se detecta frecuentemente adulterada con levamisol (inmunosupresor) y fenacetina."
      ],
      pt: [
        "Sobrecarga cardíaca: Contrai os vasos e acelera os batimentos. Se sentir dor ou pressão no peito, pare a atividade física e busque ajuda.",
        "Higiene nasal e canudos limpos: Triture bem. Nunca use cédulas de dinheiro (risco de hepatite C e bactérias). Lave o nariz com soro fisiológico.",
        "Cuidado com a compulsão: Como dura pouco tempo, a vontade de repetir a cada meia hora é forte, aumentando riscos de taquicardia e ansiedade.",
        "Adulterantes no mercado: Frequentemente cortada com levamisol (enfraquece o sistema imune) e anestésicos sintéticos."
      ]
    },
    interactions: {
      en: "DANGEROUS COCAETHYLENE FORMATION: Alcohol + Cocaine forms cocaethylene in the liver, which is significantly more cardiotoxic and increases sudden cardiac arrest risk by up to 18-25x.",
      es: "FORMACIÓN DE COCAETILENO: Mezclar con alcohol genera cocaetileno en el hígado, compuesto con toxicidad cardíaca muy superior y riesgo multiplicado de muerte súbita.",
      pt: "FORMAÇÃO DE COCAETILENO: Misturar cocaína com álcool produz cocaetileno no fígado, multiplicando o risco de arritmias graves e parada cardíaca súbita."
    },
    citations: "DrugWise UK; Andrews P, Addiction Biology 1997; Energy Control."
  },
  {
    id: "2c-b",
    category: "psychedelic",
    names: {
      en: { primary: "2C-B", street: "Nexus, Bees, Venus, Tucibi/Pink Powder (WARNING: see note)" },
      es: { primary: "2C-B", street: "Nexus, Abejas, Polvo Rosa/Tuci (ADVERTENCIA: ver nota)" },
      pt: { primary: "2C-B", street: "Nexus, Vênus, Tuci/Tusi (AVISO: veja a nota)" }
    },
    dosimetry: {
      oral: { threshold: "2–5 mg", light: "5–15 mg", common: "15–25 mg", strong: "25–35 mg" },
      formula: "Extremely steep dose-response curve: 2mg drastically alters intensity."
    },
    timeline: {
      onset: "40–90 min (oral)",
      duration: "4–8 hrs",
      aftereffects: "2–4 hrs"
    },
    summary: {
      en: "Psychedelic phenethylamine combining sensory visual enhancements with tactile empathogenic effects. Steep dosing curve requires milligram precision.",
      es: "Fenetilamina psicodélica que combina alteraciones visuales sensoriales con efectos empatógenos táctiles. Curva de dosificación sumamente empinada.",
      pt: "Fenetilamina psicodélica com fortes efeitos visuais e sensibilidade tátil eufórica. A curva de dosagem é extremamente íngreme."
    },
    harmReduction: {
      en: [
        "CRITICAL 'TUSI / PINK COCAINE' DISTINCTION: Pink colored powder sold on streets as 'Tusi' almost NEVER contains actual 2C-B; it is an unpredictable, dangerous cocktail of ketamine, caffeine, MDMA, and opioids. Test with reagents.",
        "Do not snort pure 2C-B: Intranasal administration causes extreme, excruciating burning pain to mucous membranes and unpredictable rapid onset.",
        "Oral patience: Can take up to 90 minutes to onset on a full stomach. Do NOT redose thinking the pill was inactive.",
        "Set and setting: Although more lucid than LSD, sensory overstimulation in loud or hostile spaces can provoke panic reactions. Seek safe chill zones."
      ],
      es: [
        "DISTINCIÓN CRÍTICA CON EL 'TUSI / COCAÍNA ROSA': El polvo rosa vendido en la calle como 'Tusi' casi NUNCA contiene 2C-B real; suele ser una mezcla impredecible y peligrosa de ketamina, cafeína, MDMA u opioides. Analiza siempre.",
        "No esnifar 2C-B puro: Provoca un dolor abrasivo extremo y daño agudo en la mucosa nasal.",
        "Paciencia por vía oral: Puede tardar hasta 90 minutos en hacer efecto con el estómago lleno. No redosifiques pensando que no funciona.",
        "Entorno y estímulos: En clubes muy cargados, las alteraciones visuales pueden provocar ansiedad. Acude a una zona de descanso si te sientes sobreestimulado."
      ],
      pt: [
        "DIFERENÇA CRÍTICA COM 'TUSI / COCAÍNA ROSA': O pó rosa vendido como Tusi quase NUNCA contém 2C-B de verdade; costuma ser uma mistura perigosa de ketamina, cafeína e MDMA. Teste antes.",
        "Não inale (cheire) 2C-B puro: Causa uma queimação extrema e dolorosa nas vias nasais.",
        "Paciência na via oral: Pode demorar até 90 minutos para bater se você comeu antes. Jamais redose antes desse período.",
        "Atenção ao ambiente: Estímulos visuais intensos na balada podem causar desconforto. Se ficar sobrecarregado, vá para um espaço tranquilo."
      ]
    },
    interactions: {
      en: "CAUTION: Cannabis heavily potentiates psychedelic hallucinations and thought loops. Stimulants increase anxiety and panic risks. Tramadol lower seizure threshold.",
      es: "PRECAUCIÓN: El cannabis multiplica de forma impredecible la intensidad psicodélica y bucles mentales. Estimulantes aumentan paranoia y taquicardia.",
      pt: "CUIDADO: Maconha potencializa fortemente as alucinações e a confusão mental. Estimulantes aumentam o risco de pânico e taquicardia."
    },
    citations: "Energy Control 2C-B monograph; DrugWise UK; Papaseit E et al., J Psychopharmacol 2018."
  },
  {
    id: "lsd",
    category: "psychedelic",
    names: {
      en: { primary: "LSD", street: "Acid, Blotter, Tabs, Lucy, Trips" },
      es: { primary: "LSD", street: "Ácido, Tripis, Cartón, Lucy, Soles" },
      pt: { primary: "LSD", street: "Ácido, Doce, Papel, Cartela, Trip" }
    },
    dosimetry: {
      oral: { threshold: "15–25 µg (micrograms)", light: "25–75 µg", common: "75–150 µg", strong: "150–300 µg" },
      formula: "Measured in micrograms (µg, 1/1,000,000 g). Street blotters are often unevenly dosed."
    },
    timeline: {
      onset: "30–90 min",
      duration: "8–12 hrs",
      aftereffects: "12–24 hrs"
    },
    summary: {
      en: "Potent classical ergoline psychedelic serotonergic agonist (5-HT2A). Induces prolonged sensory synesthesia, altered cognition, and emotional expansion.",
      es: "Psicodélico clásico serotoninérgico ergolínico (agonista 5-HT2A). Induce sinestesia sensorial prolongada, disolución del ego y expansión emocional profunda.",
      pt: "Psicodélico clássico serotoninérgico (agonista 5-HT2A). Causa profunda alteração perceptiva, sinestesia sensorial e longa duração de efeitos."
    },
    harmReduction: {
      en: [
        "12-Hour commitment: Long duration means you cannot 'switch it off'. Only take when you have free time, trusted companions, and a secure environment.",
        "'If it's bitter, it's a spitter': Real LSD has no taste. If blotter tastes distinctly metallic, numbing, or bitter, it is likely an NBOMe compound (potentially fatal). Spit it out immediately.",
        "Difficult experiences / 'Bad Trips': Shift setting, dim bright lights, play gentle ambient music, and remember the effect is temporary. Reassure friends with calm presence.",
        "Psychiatric vulnerability: Avoid if you or immediate family have a history of schizophrenia, psychosis, or bipolar spectrum disorders."
      ],
      es: [
        "Compromiso de 12 horas: No se puede frenar a voluntad. Consume solo si dispones de tiempo, compañía de confianza y lugar seguro.",
        "'Si es amargo, escúpelo': El LSD auténtico no tiene sabor ni adormece. Si el cartón sabe fuertemente a químico metálico o amargo, puede ser NBOMe (potencialmente letal).",
        "Manejo de malos viajes: Cambiar de ambiente, buscar aire fresco, hablar con voz calmada y recordar que el efecto terminará. Cuidar al compañero.",
        "Vulnerabilidad psicológica: Desaconsejado en personas con antecedentes personales o familiares de brotes psicóticos, esquizofrenia o trastorno bipolar."
      ],
      pt: [
        "Compromisso de 12 horas: Não há botão de desliga. Tome apenas quando tiver tempo livre, ambiente seguro e pessoas de extrema confiança.",
        "'Se for amargo, cuspa': LSD puro não tem gosto nem amortece a boca. Se o papel tiver gosto químico metálico forte, pode ser NBOMe (substância tóxica perigosa).",
        "Lidando com momentos difíceis: Mude de ambiente, respire fundo, coloque música calma e lembre-se de que a experiência passa com o tempo.",
        "Histórico familiar: Evite se você ou familiares diretos tiverem diagnóstico de transtornos psicóticos ou esquizofrenia."
      ]
    },
    interactions: {
      en: "AVOID: Lithium (high risk of seizures and coma). Cannabis (frequently triggers severe anxiety and paranoid loops). Tramadol (seizure risk).",
      es: "EVITAR: Litio (alto riesgo de convulsiones y coma). Cannabis (detonante frecuente de crisis de pánico y confusión). Tramadol.",
      pt: "EVITAR: Lítio (risco severo de convulsões e coma). Maconha (frequente causadora de crises de ansiedade aguda e paranoia). Tramadol."
    },
    citations: "DrugWise UK; Gasser P et al., J Nerv Ment Dis 2014; Energy Control."
  },
  {
    id: "poppers-nitrites",
    category: "inhalant",
    names: {
      en: { primary: "Poppers (Alkyl Nitrites)", street: "Poppers, Rush, Jungle Juice, Liquid Gold" },
      es: { primary: "Poppers (Nitritos de alquilo)", street: "Poppers, Rush, Oro Líquido" },
      pt: { primary: "Poppers (Nitritos de alquila)", street: "Poppers, Rush, Suco" }
    },
    dosimetry: {
      oral: { threshold: "1–2 inhalations", light: "1–2 sniffs", common: "2–3 sniffs", strong: "Frequent inhalation risks oxygen depletion" },
      formula: "Inhaled vapor ONLY. NEVER DRINK LIQUID (lethal poison!)."
    },
    timeline: {
      onset: "5–10 seconds",
      duration: "1–3 min",
      aftereffects: "5–15 min"
    },
    summary: {
      en: "Volatile alkyl nitrites acting as potent smooth muscle relaxants and peripheral vasodilators. Produces sudden warm rush, head euphoria, and sphincter relaxation.",
      es: "Nitritos volátiles que actúan como relajantes del músculo liso y vasodilatadores periféricos. Provocan oleada de calor súbito, euforia y relajación muscular.",
      pt: "Nitritos voláteis vasodilatadores e relaxantes musculares. Provocam onda de calor instantânea, leve euforia e relaxamento físico."
    },
    harmReduction: {
      en: [
        "NEVER SWALLOW THE LIQUID: Ingestion destroys red blood cells and oxygen-carrying capacity (methemoglobinemia), causing rapid organ failure or death.",
        "Skin & eye contact burns: Highly caustic. Do not spill on nose, lips, or skin. If contact occurs, wash immediately with water.",
        "Flammability: Vapors and liquid are extremely flammable. Keep away from lighters, cigarettes, and candles.",
        "Fall & syncope precautions: Sudden blood pressure drop can cause fainting. Inhale while seated or steady."
      ],
      es: [
        "NUNCA BEBER EL LÍQUIDO: Su ingestión causa metahemoglobinemia letal (impide el transporte de oxígeno en sangre), fallo multiorgánico y muerte.",
        "Quemaduras en piel y mucosas: Es cáustico. Evitar el contacto con nariz y labios. Lavar con agua abundante si salpica.",
        "Altamente inflamable: Mantener el bote alejado de mecheros, fósforos y cigarrillos en clubs.",
        "Riesgo de desmayos: La bajada brusca de presión arterial provoca mareos y caídas. Inhalar sentado o con apoyo firme."
      ],
      pt: [
        "NUNCA BEBA O LÍQUIDO: Ingerir poppers é mortal, impedindo o sangue de carregar oxigênio (meta-hemoglobinemia grave).",
        "Queimaduras na pele: O líquido queima o nariz e lábios. Se encostar na pele, lave imediatamente com água abundante.",
        "Extremamente inflamável: Mantenha longe de isqueiros, cigarros e chamas.",
        "Queda de pressão: Pode causar tontura e desmaios repentinos. Inale preferencialmente sentado ou apoiado."
      ]
    },
    interactions: {
      en: "LETHAL INTERACTION WITH ERECTILE DRUGS: Combining poppers with Viagra (Sildenafil), Cialis (Tadalafil), or Levitra causes catastrophic irreversible blood pressure drop, cardiovascular collapse, and death.",
      es: "INTERACCIÓN MORTAL CON MEDICAMENTOS PARA LA ERECCIÓN: La combinación de poppers con Viagra (Sildenafilo), Cialis (Tadalafilo) o Levitra causa una caída mortal de presión arterial y colapso cardiovascular.",
      pt: "INTERAÇÃO FATAL COM REMÉDIOS PARA EREÇÃO: Misturar poppers com Viagra (Sildenafila), Cialis (Tadalafila) ou Levitra provoca colapso de pressão e parada cardíaca fatal."
    },
    citations: "British National Formulary; DrugWise UK; Romanelli F et al., Pharmacotherapy 2004."
  }
];

const UI_TRANSLATIONS = {
  en: {
    siteTitle: "WIKIDROGAS",
    siteSubtitle: "Harm Reduction & Psychoactive Wiki",
    safetyBadge: "Objective • Non-Judgmental • Science-Based",
    emergencyFastBtn: "Emergency / SOS Guide",
    returnAeriel: "← Back to ÆRIEL.NET",
    heroTitle: "Knowledge reduces harm. Take care of yourself and your community.",
    heroLead: "Peer-reviewed, objective harm reduction information for psychoactive substances commonly found across electronic music spaces. Accurate facts, interactions, and safety protocols without stigma.",
    calloutText: "If you or someone in the venue feels unwell, seek the medical / harm reduction tent or staff immediately. Clubs and festivals have a duty of care, and reaching out early saves lives.",
    searchPlaceholder: "Search substance name, street nickname, or keyword (e.g., Molly, K-Hole, GBL)...",
    filterAll: "All Substances",
    filterEmpathogen: "Empathogens",
    filterDissociative: "Dissociatives",
    filterStimulant: "Stimulants",
    filterPsychedelic: "Psychedelics",
    filterDepressant: "Depressants",
    filterInhalant: "Inhalants",
    resultsFound: "substances displayed",
    noResults: "No substances match your query. Try searching by generic name or common slang.",
    dosimetryLabel: "Dosage Guidelines",
    timelineLabel: "Onset & Duration",
    interactionsLabel: "Crucial Interactions & Risks",
    harmReductionLabel: "Harm Reduction Protocols",
    scientificSourcesLabel: "Evidence Base & Citations",
    learnMoreBtn: "View Full Profile & Harm Reduction Guidance",
    closeDetailsBtn: "Collapse Profile",
    emergencySectionTitle: "First Aid & Dancefloor Emergency Protocol",
    emergencySectionLead: "What to do if someone becomes unresponsive, overheats, or enters a difficult psychological state.",
    protocol1Title: "1. Check Responsiveness",
    protocol1Desc: "Gently tap their shoulder and speak clearly. If unresponsive, check breathing and immediately call medical staff or 112/911.",
    protocol2Title: "2. The Recovery Position",
    protocol2Desc: "If they are breathing but unconscious (e.g., G-sleep or Ketamine sedation), place them in the stable recovery position on their side to prevent choking on vomit.",
    protocol3Title: "3. Overheating & Hyperthermia",
    protocol3Desc: "Hot skin, stopped sweating, confusion, and muscle stiffness are red flags. Move immediately to a cool area, loosen tight clothing, and fan cool air.",
    protocol4Title: "4. Compassionate Grounding",
    protocol4Desc: "For panic or overwhelming psychedelic trips: stay calm, reassure them they are safe, breathe together in four-second intervals, and never leave them alone.",
    footerMissionTitle: "About Wikidrogas",
    footerMissionText: "Wikidrogas is an independent harm reduction knowledge repository hosted on the ÆRIEL platform. It provides dancers, ravers, and community members with accessible, evidence-based safety data grounded in toxicology and frontline peer support.",
    footerSourcesTitle: "Authoritative Partners",
    footerLegalTitle: "Medical Disclaimer",
    footerLegalText: "This wiki is for educational and harm reduction purposes only. It does not promote or encourage substance use. Using unsanctioned psychoactive substances always carries inherent health risks.",
    copyrightNotice: "ÆRIEL // Wikidrogas — Safety, care, and sovereignty in electronic nightlife."
  },
  es: {
    siteTitle: "WIKIDROGAS",
    siteSubtitle: "Reducción de Daños & Sustancias Psicoactivas",
    safetyBadge: "Objetivo • Sin Juicios • Basado en Evidencia",
    emergencyFastBtn: "Guía de Emergencias / SOS",
    returnAeriel: "← Volver a ÆRIEL.NET",
    heroTitle: "El conocimiento reduce daños. Cuida de ti y de tu comunidad.",
    heroLead: "Información objetiva y contrastada de reducción de daños para sustancias psicoactivas habituales en la escena de música electrónica. Datos rigurosos, interacciones y protocolos de seguridad sin estigmas.",
    calloutText: "Si tú o alguien en la pista no se encuentra bien, acude de inmediato al punto de primeros auxilios o al personal del club. Cuidarnos mutuamente es la base de la cultura de club.",
    searchPlaceholder: "Buscar por nombre, apodo callejero o término (ej., Moly, Keta, Éxtasis Líquido)...",
    filterAll: "Todas las sustancias",
    filterEmpathogen: "Empatógenos",
    filterDissociative: "Disociativos",
    filterStimulant: "Estimulantes",
    filterPsychedelic: "Psicodélicos",
    filterDepressant: "Depresores",
    filterInhalant: "Inhalantes",
    resultsFound: "sustancias disponibles",
    noResults: "No se encontraron sustancias con ese término. Prueba con nombres comunes o apodos.",
    dosimetryLabel: "Guía de Dosificación",
    timelineLabel: "Tiempos & Duración",
    interactionsLabel: "Interacciones Críticas & Riesgos",
    harmReductionLabel: "Pautas de Reducción de Daños",
    scientificSourcesLabel: "Fuentes & Evidencia Científica",
    learnMoreBtn: "Ver Perfil Completo & Consejos de Seguridad",
    closeDetailsBtn: "Ocultar Perfil",
    emergencySectionTitle: "Protocolo de Emergencia & Primeros Auxilios en Pista",
    emergencySectionLead: "Cómo actuar ante una pérdida de consciencia, hipertermia o una crisis psicológica en la fiesta.",
    protocol1Title: "1. Evaluar Respuesta",
    protocol1Desc: "Habla con claridad y toca suavemente sus hombros. Si no responde, comprueba que respira y avisa de inmediato al equipo médico del evento.",
    protocol2Title: "2. Posición Lateral de Seguridad",
    protocol2Desc: "Si respira pero no reacciona (efecto sedante de G o Keta), colócale de lado en posición lateral de seguridad para evitar asfixia si vomita.",
    protocol3Title: "3. Golpe de Calor e Hipertermia",
    protocol3Desc: "Piel muy caliente, ausencia de sudor, confusión o rigidez muscular son signos de alarma. Llevar a lugar fresco, ventilar e hidratar poco a poco.",
    protocol4Title: "4. Acompañamiento en Crisis",
    protocol4Desc: "Ante pánico o sobreestimulación psicodélica: mantén la calma, recuerda que el efecto pasará, haz respiraciones pausadas y no le dejes solo.",
    footerMissionTitle: "Sobre Wikidrogas",
    footerMissionText: "Wikidrogas es un repositorio libre de reducción de daños albergado en la plataforma ÆRIEL. Proporciona a la comunidad de baile herramientas e información objetiva basada en toxicología y acompañamiento entre pares.",
    footerSourcesTitle: "Fuentes Científicas",
    footerLegalTitle: "Aviso Médico",
    footerLegalText: "Este wiki tiene propósitos formativos y de reducción de riesgos. No incita al consumo de sustancias ilícitas, las cuales siempre entrañan riesgos biológicos individuales.",
    copyrightNotice: "ÆRIEL // Wikidrogas — Cuidado, seguridad y soberanía en la noche electrónica."
  },
  pt: {
    siteTitle: "WIKIDROGAS",
    siteSubtitle: "Redução de Danos & Substâncias Psicoativas",
    safetyBadge: "Objetivo • Sem Julgamentos • Base Científica",
    emergencyFastBtn: "Guia de Emergência / SOS",
    returnAeriel: "← Voltar para ÆRIEL.NET",
    heroTitle: "Conhecimento reduz danos. Cuide de si e da sua comunidade.",
    heroLead: "Informação clara, acolhedora e com respaldo científico sobre substâncias psicoativas comuns na cena techno. Dados seguros, interações e medidas preventivas sem estigma.",
    calloutText: "Se você ou alguém ao seu lado não estiver bem, procure imediatamente o posto médico ou os voluntários de redução de danos da festa. Cuidar uns dos outros salva vidas.",
    searchPlaceholder: "Buscar por substância, gíria ou termo (ex: Bala, Key, Doce, GBL)...",
    filterAll: "Todas as substâncias",
    filterEmpathogen: "Empatógenos",
    filterDissociative: "Dissociativos",
    filterStimulant: "Estimulantes",
    filterPsychedelic: "Psicodélicos",
    filterDepressant: "Depressores",
    filterInhalant: "Inalantes",
    resultsFound: "substâncias exibidas",
    noResults: "Nenhuma substância encontrada. Tente buscar por nomes populares ou científicos.",
    dosimetryLabel: "Guia de Dosagem",
    timelineLabel: "Duração & Efeitos",
    interactionsLabel: "Interações Perigosas & Riscos",
    harmReductionLabel: "Medidas de Redução de Danos",
    scientificSourcesLabel: "Fontes & Evidência Científica",
    learnMoreBtn: "Ver Perfil Completo & Recomendações",
    closeDetailsBtn: "Recolher Perfil",
    emergencySectionTitle: "Protocolo de Emergência & Primeiros Socorros na Pista",
    emergencySectionLead: "Como agir caso alguém desmaie, tenha superaquecimento ou passe por uma crise na festa.",
    protocol1Title: "1. Checar Consciência",
    protocol1Desc: "Chame a pessoa pelo nome e toque no ombro. Se não responder, observe a respiração e chame imediatamente a equipe médica ou bombeiros.",
    protocol2Title: "2. Posição Lateral de Segurança",
    protocol2Desc: "Se a pessoa respira mas está apagada (efeito de G ou Key), vire-a de lado para evitar engasgo e asfixia em caso de vômito.",
    protocol3Title: "3. Superaquecimento Corporal",
    protocol3Desc: "Pele muito quente, suor ausente, tremores ou confusão exigem ação rápida. Leve para um local fresco, arejado e tire agasalhos pesados.",
    protocol4Title: "4. Acolhimento em Crises",
    protocol4Desc: "Em episódios de bad trip ou paranoia: fale calmamente, garanta que a pessoa está segura, ajude na respiração e nunca a deixe desacompanhada.",
    footerMissionTitle: "Sobre o Wikidrogas",
    footerMissionText: "Wikidrogas é um repositório comunitário de redução de danos no ecossistema ÆRIEL. Dedicado a fornecer informações transparentes sobre saúde e segurança para frequentadores da noite eletrônica.",
    footerSourcesTitle: "Parceiros & Pesquisas",
    footerLegalTitle: "Aviso Legal de Saúde",
    footerLegalText: "Esta enciclopédia possui finalidade informativa e educativa. O consumo de substâncias não regulamentadas envolve riscos à saúde e não é incentivado por este espaço.",
    copyrightNotice: "ÆRIEL // Wikidrogas — Cuidado, segurança e soberania na noite eletrônica."
  }
};

class WikidrogasApp {
  constructor() {
    this.currentLang = this.detectInitialLanguage();
    this.activeFilter = "all";
    this.searchQuery = "";
    
    this.initElements();
    this.bindEvents();
    this.render();
  }

  detectInitialLanguage() {
    const saved = localStorage.getItem("wikidrogas_lang");
    if (saved && ["en", "es", "pt"].includes(saved)) return saved;
    const browserLang = (navigator.language || navigator.userLanguage || "en").toLowerCase();
    if (browserLang.startsWith("es")) return "es";
    if (browserLang.startsWith("pt")) return "pt";
    return "en";
  }

  initElements() {
    this.searchInput = document.getElementById("substance-search");
    this.clearBtn = document.getElementById("search-clear");
    this.gridContainer = document.getElementById("substances-grid");
    this.resultsCountEl = document.getElementById("results-count");
    this.chips = document.querySelectorAll(".filter-chip");
    this.langBtns = document.querySelectorAll(".lang-btn");
  }

  bindEvents() {
    // Search input
    this.searchInput.addEventListener("input", (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.clearBtn.style.display = this.searchQuery.length > 0 ? "block" : "none";
      this.renderGrid();
    });

    // Clear search
    this.clearBtn.addEventListener("click", () => {
      this.searchInput.value = "";
      this.searchQuery = "";
      this.clearBtn.style.display = "none";
      this.searchInput.focus();
      this.renderGrid();
    });

    // Category filters
    this.chips.forEach(chip => {
      chip.addEventListener("click", () => {
        this.chips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        this.activeFilter = chip.dataset.category;
        this.renderGrid();
      });
    });

    // Language buttons
    this.langBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const lang = btn.dataset.lang;
        this.setLanguage(lang);
      });
    });
  }

  setLanguage(lang) {
    if (!["en", "es", "pt"].includes(lang)) return;
    this.currentLang = lang;
    localStorage.setItem("wikidrogas_lang", lang);
    document.documentElement.lang = lang;
    
    this.langBtns.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
      btn.setAttribute("aria-pressed", btn.dataset.lang === lang ? "true" : "false");
    });

    this.render();
  }

  render() {
    this.updateStaticTranslations();
    this.renderGrid();
  }

  updateStaticTranslations() {
    const t = UI_TRANSLATIONS[this.currentLang];
    
    // Page Title
    document.title = `${t.siteTitle} // ÆRIEL — Harm Reduction & Safety Wiki`;

    // Elements with data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      if (t[key]) {
        el.textContent = t[key];
      }
    });

    // Elements with data-i18n-placeholder
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (t[key]) {
        el.placeholder = t[key];
      }
    });
  }

  renderGrid() {
    const t = UI_TRANSLATIONS[this.currentLang];
    const filtered = WIKIDROGAS_DATA.filter(item => {
      const matchesCategory = this.activeFilter === "all" || item.category === this.activeFilter;
      if (!matchesCategory) return false;
      
      if (!this.searchQuery) return true;

      const q = this.searchQuery;
      const names = item.names[this.currentLang];
      const summary = item.summary[this.currentLang].toLowerCase();
      const primary = names.primary.toLowerCase();
      const street = names.street.toLowerCase();

      return primary.includes(q) || street.includes(q) || summary.includes(q) || item.category.includes(q);
    });

    this.resultsCountEl.textContent = `${filtered.length} ${t.resultsFound}`;

    if (filtered.length === 0) {
      this.gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 3rem 1.5rem; text-align: center; background: #FFFFFF; border: 1px dashed var(--border-light); border-radius: var(--radius-lg);">
          <p style="font-size: 1.1rem; color: var(--text-muted); font-weight: 600;">${t.noResults}</p>
        </div>
      `;
      return;
    }

    this.gridContainer.innerHTML = filtered.map(item => this.buildCardHtml(item, t)).join("");
  }

  buildCardHtml(item, t) {
    const names = item.names[this.currentLang];
    const summary = item.summary[this.currentLang];
    const harmList = item.harmReduction[this.currentLang];
    const interactionText = item.interactions[this.currentLang];

    const categoryNames = {
      empathogen: t.filterEmpathogen,
      dissociative: t.filterDissociative,
      stimulant: t.filterStimulant,
      psychedelic: t.filterPsychedelic,
      depressant: t.filterDepressant,
      inhalant: t.filterInhalant
    };

    return `
      <article class="substance-card" id="substance-${item.id}">
        <div class="card-top-bar">
          <div class="substance-name-group">
            <h3 class="substance-primary-name">${names.primary}</h3>
            <p class="substance-street-names">${names.street}</p>
          </div>
          <span class="category-badge badge-${item.category}">
            ${categoryNames[item.category] || item.category}
          </span>
        </div>

        <p class="substance-summary-text">${summary}</p>

        <div class="facts-table">
          <div class="fact-item">
            <span class="fact-label">Onset</span>
            <span class="fact-value">${item.timeline.onset}</span>
          </div>
          <div class="fact-item">
            <span class="fact-label">Duration</span>
            <span class="fact-value">${item.timeline.duration}</span>
          </div>
          <div class="fact-item">
            <span class="fact-label">Dose</span>
            <span class="fact-value">${item.dosimetry.oral.common}</span>
          </div>
        </div>

        <details class="substance-details">
          <summary>
            <span>${t.learnMoreBtn}</span>
            <svg class="summary-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </summary>
          
          <div class="substance-accordion-content">
            <div class="info-block">
              <h4 class="info-heading">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
                ${t.dosimetryLabel}
              </h4>
              <p class="info-text"><strong>Common Oral:</strong> ${item.dosimetry.oral.common} | <strong>Rule:</strong> ${item.dosimetry.formula}</p>
            </div>

            <div class="risk-warning-box">
              <div class="risk-warning-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                ${t.interactionsLabel}
              </div>
              <p>${interactionText}</p>
            </div>

            <div class="info-block">
              <h4 class="info-heading">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                ${t.harmReductionLabel}
              </h4>
              <ul style="padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.4rem; color: var(--text-muted); line-height: 1.5;">
                ${harmList.map(step => `<li>${step}</li>`).join("")}
              </ul>
            </div>

            <div class="source-citations">
              <strong>${t.scientificSourcesLabel}:</strong> ${item.citations}
            </div>
          </div>
        </details>
      </article>
    `;
  }
}

// Instantiate on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  new WikidrogasApp();
});
