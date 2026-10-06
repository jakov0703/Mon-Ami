/* ════════════════════════════════════════════════════════════════════════
   MON AMI — ALL EDITABLE CONTENT LIVES IN THIS FILE.
   Change something here, then run:  node build-html.js
   ════════════════════════════════════════════════════════════════════════ */

/* ── The restaurant ──────────────────────────────────────────────────── */
const INFO = {
  name: 'Restoran Mon Ami',
  street: 'Trg kralja Tomislava 26',
  postal: '10410',
  city: 'Velika Gorica',
  region: 'Zagrebačka županija',
  telDisplay: '01 6213 333',
  telHref: '+38516213333',
  mobDisplay: '091 5444 715',
  mobHref: '+385915444715',
  email: 'monamihr@gmail.com',
  lat: 45.71137,
  lon: 16.07998,
  founded: '1997',
  facebook: 'https://www.facebook.com/monamihr/',
  instagram: 'https://www.instagram.com/monami.hr/',
  michelin: 'https://guide.michelin.com/hr/en/zagreb-region/velika-gorica/restaurant/mon-ami',
  gaultmillau: 'https://hr.gaultmillau.com/en/restaurants/mon-ami',
  order: 'https://www.monami.hr/online-narucivanje/',
  site: 'https://www.monami.hr/',
  // Date the prices below were last checked against the restaurant's own system.
  menuUpdated: '27. 9. 2026.',
  menuUpdatedEn: '27 Sep 2026',
};

/* ── Opening hours ────────────────────────────────────────────────────────
   THE ONLY PLACE TIME IS DEFINED. Drives four things at once:
     1. the live status chip in the header
     2. today's highlighted row in the hours table
     3. the time slots in the reservation form
     4. openingHoursSpecification in the search-engine data
   0 = Sunday … 6 = Saturday.  null = closed all day.
   holidays: add "YYYY-MM-DD" strings to close a specific date.
   notice: leave both empty unless a closure is actually confirmed —
           filling it wrongly tells guests you are shut when you are not.
   ────────────────────────────────────────────────────────────────────── */
const HOURS = {
  tz: 'Europe/Zagreb',
  week: [
    null,               // 0 nedjelja  — zatvoreno
    ['11:00','16:30'],  // 1 ponedjeljak
    ['11:00','23:00'],  // 2 utorak
    ['11:00','23:00'],  // 3 srijeda
    ['11:00','23:00'],  // 4 četvrtak
    ['11:00','23:00'],  // 5 petak
    ['11:00','23:00'],  // 6 subota
  ],
  holidays: [],
  notice: { hr: '', en: '' },
};

/* ── Awards ─────────────────────────────────────────────────────────────
   Type only — never a borrowed logo, star, toque or owl device.
   ────────────────────────────────────────────────────────────────────── */
const AWARDS = [
  { year: '2026',      line: 'MICHELIN Guide Hrvatska',
    hr: 'Selected · u vodiču od 2018.',            en: 'Selected · in the guide since 2018',
    href: INFO.michelin },
  { year: '2026',      line: 'Gault&Millau 13,5/20',
    hr: 'dvije kape · Chef’s Restaurant',          en: 'two toques · Chef’s Restaurant',
    href: INFO.gaultmillau },
  { year: '2024',      line: 'Restaurant Croatica',
    hr: 'među 100 vodećih hrvatskih restorana',    en: 'among Croatia’s 100 leading restaurants' },
  { year: '1999.–2025.', line: '23 puta',
    hr: 'na listi 100 najboljih u Hrvatskoj',      en: 'on Croatia’s top-100 list',
    lineEn: '23 times' },
];

/* ── Menu ───────────────────────────────────────────────────────────────
   c    = category, must match one of CATEGORIES below
   hr   = Croatian name, exactly as printed
   en   = English name
   p    = price as printed, Croatian comma decimal. '' = no published price
   unit = '' or 'kg'
   diet = space separated: gf | veg | fish | meat
          NOTE: 'gf' is only set where the kitchen itself declares it.
          Several sides and salads are very likely gluten free but the
          kitchen has not confirmed each one, so they are not tagged.
   tag  = '' | 'chef'  (chef's recommendation)
   note = optional short line rendered under the row
   ────────────────────────────────────────────────────────────────────── */
const CATEGORIES = [
  'Preporuka kuće',
  'Hladna predjela',
  'Topla predjela i rižota',
  'Jela od mesa',
  'Jela od riba',
  'Prilozi',
  'Salate',
  'Slastice',
  'Bez glutena',
  'Vegetarijanski',
  'Kruh i umaci',
];

const CATEGORIES_EN = {
  'Preporuka kuće':           'House recommendations',
  'Hladna predjela':          'Cold starters',
  'Topla predjela i rižota':  'Warm starters & risotto',
  'Jela od mesa':             'Meat',
  'Jela od riba':             'Fish & shellfish',
  'Prilozi':                  'Sides',
  'Salate':                   'Salads',
  'Slastice':                 'Desserts',
  'Bez glutena':              'Gluten free',
  'Vegetarijanski':           'Vegetarian',
  'Kruh i umaci':             'Bread & sauces',
};

/* Short honest note at the end of a category, for dishes that are on the
   menu but have no price published anywhere. Better than inventing one. */
const CATEGORY_NOTES = {
  'Jela od riba': {
    hr: 'Uz dnevni ulov pripremamo i jastoga te jadransku lignju i hobotnicu na salatu — pitajte za dnevnu ponudu i cijenu.',
    en: 'Alongside the daily catch we also prepare lobster, and Adriatic squid and octopus salad — ask for today’s offer and price.',
  },
  'Slastice': {
    hr: 'Pripremamo i rožatu, semifreddo od lješnjaka i bijele čokolade sa slanom karamelom te primorski kolač s maslinovim uljem — pitajte za dnevni odabir.',
    en: 'We also make rožata, hazelnut and white chocolate semifreddo with salted caramel, and a coastal olive oil cake — ask for today’s selection.',
  },
};

const MENU = [
  /* ── Preporuka kuće ───────────────────────────────────────────────── */
  { c:'Preporuka kuće', hr:'File brancina uz ražnjić od škampa s blitvom i krumpirom', en:'Sea bass fillet with a scampi skewer, Swiss chard and potatoes', p:'26,50', diet:'fish', tag:'chef' },
  { c:'Preporuka kuće', hr:'Riblja plata Mon Ami (za dvoje)', en:'Mon Ami seafood platter for two', p:'42,00', diet:'fish', tag:'chef',
    note_hr:'Jadranska riba sa žara, lignje, kozice, blitva s krumpirom.', note_en:'Grilled Adriatic fish, squid, shrimp, Swiss chard with potatoes.' },
  { c:'Preporuka kuće', hr:'Losos sa žara glaziran teriyaki umakom, s pireom od celera i povrćem na pari', en:'Grilled salmon glazed with teriyaki, celery purée and steamed vegetables', p:'23,00', diet:'fish', tag:'chef',
    note_hr:'Jelo koje je inspektor MICHELIN vodiča izdvojio u svojoj recenziji.', note_en:'The dish singled out by the MICHELIN Guide inspector in their review.' },
  { c:'Preporuka kuće', hr:'Lignje sa žara — paket', en:'Grilled squid — set', p:'16,60', diet:'fish',
    note_hr:'S blitvom, krumpirom i domaćim kruhom.', note_en:'With Swiss chard, potatoes and homemade bread.' },
  { c:'Preporuka kuće', hr:'Pržene lignje — paket', en:'Fried squid — set', p:'14,90', diet:'fish',
    note_hr:'S pomfritom, tartar umakom i domaćim kruhom.', note_en:'With fries, tartar sauce and homemade bread.' },
  { c:'Preporuka kuće', hr:'Istarski fuži s beefsteakom i crnim tartufom', en:'Istrian fuži with beefsteak and black truffle', p:'27,50', diet:'meat' },
  { c:'Preporuka kuće', hr:'Pačji batak i zabatak s pireom od češnjaka, na redukciji od naranče i crnog vina', en:'Duck leg and thigh with garlic purée, orange and red wine reduction', p:'26,00', diet:'meat' },
  { c:'Preporuka kuće', hr:'Ramsteak sa žara', en:'Grilled rump steak', p:'23,50', diet:'meat' },

  /* ── Hladna predjela ──────────────────────────────────────────────── */
  { c:'Hladna predjela', hr:'Carpaccio od tune s crnim tartufom', en:'Tuna carpaccio with black truffle', p:'18,50', diet:'fish', tag:'chef',
    note_hr:'Turopoljski tartuf ribamo pred vama, za stolom.', note_en:'The Turopolje truffle is grated at your table.' },
  { c:'Hladna predjela', hr:'Dimljene dagnje na rikoli', en:'Smoked mussels on rocket', p:'14,50', diet:'fish' },
  { c:'Hladna predjela', hr:'Pašteta od kozica', en:'Shrimp pâté', p:'9,50', diet:'fish' },
  { c:'Hladna predjela', hr:'Paški sir Gligora, 50 g', en:'Gligora Pag sheep’s cheese, 50 g', p:'7,25', diet:'veg' },
  { c:'Hladna predjela', hr:'Pršut, 50 g', en:'Dry-cured prosciutto, 50 g', p:'5,20', diet:'meat' },
  { c:'Hladna predjela', hr:'Istarska kobasica s ružmarinom, 50 g', en:'Istrian sausage with rosemary, 50 g', p:'3,75', diet:'meat' },
  { c:'Hladna predjela', hr:'Težački sir Gligora, 50 g', en:'Gligora ‘Težački’ cheese, 50 g', p:'3,40', diet:'veg' },
  { c:'Hladna predjela', hr:'File inćuna (slani)', en:'Salted anchovy fillet', p:'1,50', diet:'fish' },

  /* ── Topla predjela i rižota ──────────────────────────────────────── */
  { c:'Topla predjela i rižota', hr:'Crni rižoto od sipe', en:'Black cuttlefish risotto', p:'14,80', diet:'fish', tag:'chef',
    note_hr:'Naše najpoznatije jelo.', note_en:'Our best known dish.' },
  { c:'Topla predjela i rižota', hr:'Pljukanci od špinata sa škampima, pestom od sušenih rajčica i tostiranim pistacijom', en:'Spinach pljukanci with scampi, sun-dried tomato pesto and toasted pistachio', p:'22,80', diet:'fish' },
  { c:'Topla predjela i rižota', hr:'Fuži s tartufatom, tartufima i pršutom', en:'Fuži with truffle cream, truffle and prosciutto', p:'17,80', diet:'meat', tag:'chef' },
  { c:'Topla predjela i rižota', hr:'Pohane kozice s tartar umakom', en:'Breaded shrimp with tartar sauce', p:'17,50', diet:'fish' },
  { c:'Topla predjela i rižota', hr:'Pljukanci s kozicama', en:'Pljukanci — hand-rolled pasta — with shrimp', p:'15,00', diet:'fish' },
  { c:'Topla predjela i rižota', hr:'Zeleni rezanci s kozicama na temeljcu od škampa', en:'Green tagliatelle with shrimp in scampi bisque', p:'14,00', diet:'fish' },
  { c:'Topla predjela i rižota', hr:'Bijeli rižoto s kozicama', en:'White risotto with shrimp', p:'13,80', diet:'fish' },
  { c:'Topla predjela i rižota', hr:'Prženi gavuni', en:'Fried sand smelt', p:'12,00', diet:'fish',
    note_hr:'Prženi na našem maslinovom ulju iz Skradina.', note_en:'Fried in our own Skradin olive oil.' },

  /* ── Jela od mesa ─────────────────────────────────────────────────── */
  { c:'Jela od mesa', hr:'Beefsteak u umaku od tartufa', en:'Beefsteak in truffle sauce', p:'42,00', diet:'meat', tag:'chef' },
  { c:'Jela od mesa', hr:'Beefsteak u umaku od zelenog papra', en:'Beefsteak in green peppercorn sauce', p:'42,00', diet:'meat' },
  { c:'Jela od mesa', hr:'Beefsteak sa žara', en:'Grilled beefsteak', p:'39,00', diet:'meat' },
  { c:'Jela od mesa', hr:'Mesna plata Mon Ami (za dvoje)', en:'Mon Ami meat platter for two', p:'39,00', diet:'meat',
    note_hr:'Beefsteak, otkošteni pileći zabatak, lungić sa žara i puretina punjena sirom.', note_en:'Beefsteak, deboned chicken thigh, grilled pork loin and turkey stuffed with cheese.' },
  { c:'Jela od mesa', hr:'Pureći odrezak zagrebački', en:'Turkey escalope Zagreb style', p:'14,50', diet:'meat' },
  { c:'Jela od mesa', hr:'Pureći odrezak Mon Ami', en:'Turkey escalope Mon Ami style', p:'14,00', diet:'meat', tag:'chef' },
  { c:'Jela od mesa', hr:'Lungić sa žara s krumpirovim ploškama', en:'Grilled pork loin with homemade potato slices', p:'14,00', diet:'meat' },
  { c:'Jela od mesa', hr:'Lungić sa žara i pečeni krumpir s ružmarinom', en:'Grilled pork loin with rosemary roast potatoes', p:'14,00', diet:'meat' },
  { c:'Jela od mesa', hr:'Punjeni lungić', en:'Stuffed pork loin', p:'13,50', diet:'meat' },

  /* ── Jela od riba ─────────────────────────────────────────────────── */
  { c:'Jela od riba', hr:'Škampi sa žara (8–12 kom/kg)', en:'Grilled scampi (8–12 per kg)', p:'96,00', unit:'kg', diet:'fish', tag:'chef' },
  { c:'Jela od riba', hr:'Škampi na buzaru', en:'Scampi buzara', p:'96,00', unit:'kg', diet:'fish' },
  { c:'Jela od riba', hr:'Školjke na buzaru', en:'Shellfish buzara', p:'63,00', unit:'kg', diet:'fish' },
  { c:'Jela od riba', hr:'Jadranske lignje sa žara', en:'Grilled Adriatic squid', p:'62,00', unit:'kg', diet:'fish' },

  /* ── Prilozi ──────────────────────────────────────────────────────── */
  { c:'Prilozi', hr:'Blitva', en:'Swiss chard', p:'7,00', diet:'veg' },
  { c:'Prilozi', hr:'Blitva s krumpirom', en:'Swiss chard with potatoes', p:'6,50', diet:'veg' },
  { c:'Prilozi', hr:'Domaći kroketi', en:'Homemade potato croquettes', p:'6,00', diet:'veg' },
  { c:'Prilozi', hr:'Domaće pržene šnite krumpira', en:'Homemade fried potato slices', p:'5,80', diet:'veg' },
  { c:'Prilozi', hr:'Povrće sa žara', en:'Grilled vegetables', p:'5,80', diet:'veg' },
  { c:'Prilozi', hr:'Domaći njoki', en:'Homemade gnocchi', p:'5,50', diet:'veg' },
  { c:'Prilozi', hr:'Pečeni krumpir s ružmarinom', en:'Rosemary roast potatoes', p:'4,50', diet:'veg' },
  { c:'Prilozi', hr:'Pomfrit', en:'French fries', p:'4,20', diet:'veg' },

  /* ── Salate ───────────────────────────────────────────────────────── */
  { c:'Salate', hr:'Šopska salata', en:'Šopska salad', p:'6,00', diet:'veg',
    note_hr:'Rajčica, krastavac, paprika i naribani sir.', note_en:'Tomato, cucumber, pepper and grated cheese.' },
  { c:'Salate', hr:'Pečena paprika', en:'Roasted peppers', p:'5,00', diet:'veg' },
  { c:'Salate', hr:'Salata od matovilca', en:'Lamb’s lettuce salad', p:'4,40', diet:'veg' },
  { c:'Salate', hr:'Salata od rikole', en:'Rocket salad', p:'4,40', diet:'veg' },
  { c:'Salate', hr:'Miješana salata', en:'Mixed salad', p:'3,80', diet:'veg' },
  { c:'Salate', hr:'Zelena salata', en:'Green salad', p:'3,60', diet:'veg' },
  { c:'Salate', hr:'Salata od zelja', en:'Cabbage salad', p:'3,60', diet:'veg' },

  /* ── Slastice ─────────────────────────────────────────────────────── */
  { c:'Slastice', hr:'Čokoladni soufflé', en:'Chocolate soufflé', p:'5,00', diet:'veg' },
  { c:'Slastice', hr:'Skradinska torta', en:'Skradin cake', p:'4,00', diet:'veg', tag:'chef',
    note_hr:'Po kraju iz kojeg dolazi naša obitelj.', note_en:'From the region our family comes from.' },

  /* ── Bez glutena ──────────────────────────────────────────────────── */
  { c:'Bez glutena', hr:'Riba sa žara s blitvom i krumpirom', en:'Grilled Adriatic fish with Swiss chard and potatoes', p:'21,50', diet:'gf fish' },
  { c:'Bez glutena', hr:'Lignje Mon Ami s prosom', en:'Mon Ami squid with millet', p:'16,50', diet:'gf fish' },

  /* ── Vegetarijanski ───────────────────────────────────────────────── */
  { c:'Vegetarijanski', hr:'Zelene tagliatelle u umaku od šumskih gljiva', en:'Green tagliatelle in wild mushroom sauce', p:'12,50', diet:'veg' },
  { c:'Vegetarijanski', hr:'Rižoto od povrća', en:'Vegetable risotto', p:'11,00', diet:'veg' },

  /* ── Kruh i umaci ─────────────────────────────────────────────────── */
  { c:'Kruh i umaci', hr:'Umak od vrganja', en:'Porcini sauce', p:'6,50', diet:'veg' },
  { c:'Kruh i umaci', hr:'Umak od šampinjona', en:'Button mushroom sauce', p:'5,00', diet:'veg' },
  { c:'Kruh i umaci', hr:'Tartar umak', en:'Tartar sauce', p:'2,20', diet:'veg' },
  { c:'Kruh i umaci', hr:'Domaći kruh, 3 kriške', en:'Homemade bread, 3 slices', p:'1,50', diet:'veg' },
];

/* ── Gallery ────────────────────────────────────────────────────────────
   slot  = base filename in img/, without -WIDTH.ext
   w/h   = intrinsic size of the largest generated file (stops layout shift)
   span  = grid column span at desktop
   alt   = describes the photo for someone who cannot see it
   cap   = short caption printed under the frame
   ────────────────────────────────────────────────────────────────────── */
const GALLERY = [
  { slot:'gal-grill', w:1200, h:800, span:7, sizes:'(min-width:64rem) 55vw, 100vw',
    cap_hr:'Riba na žaru na drveni ugljen', cap_en:'Fish on the charcoal grill',
    alt_hr:'Odresci ribe na rešetki roštilja, plamen i dim ispod njih.',
    alt_en:'Fish steaks on a grill rack with flames and smoke beneath them.' },
  { slot:'gal-hobotnica', w:1000, h:1250, span:5, sizes:'(min-width:64rem) 40vw, 100vw',
    cap_hr:'Hobotnica se raspoređuje na tanjur', cap_en:'Octopus being plated',
    alt_hr:'Kuharica u crnoj jakni i kapi viljuškom slaže hobotnicu s roštilja na bijeli tanjur.',
    alt_en:'A cook in a black jacket and cap arranging grilled octopus onto a white plate with a fork.' },
  { slot:'gal-skrpina', w:1920, h:823, span:12, sizes:'100vw',
    cap_hr:'Škrpina ide u lonac', cap_en:'Scorpionfish into the pot',
    alt_hr:'Dvodijelna slika: ruka spušta cijelu škrpinu u lonac, a zatim ista riba krčka u ulju i začinskom bilju nad otvorenim plamenom.',
    alt_en:'A two-part image: a hand lowering a whole scorpionfish into a pot, then the same fish simmering in oil and herbs over an open flame.' },
  { slot:'gal-jastog', w:1000, h:1000, span:4, sizes:'(min-width:64rem) 32vw, 50vw',
    cap_hr:'Živi jastog iz vitrine', cap_en:'A live lobster from the display',
    alt_hr:'Krupni plan živog jastoga tamnoplave ljuske s krem i narančastim šarama.',
    alt_en:'A close-up of a live lobster with a deep blue shell marked in cream and orange.' },
  { slot:'gal-teletina', w:1000, h:1000, span:4, sizes:'(min-width:64rem) 32vw, 50vw',
    cap_hr:'Punjeni odrezak s limunom', cap_en:'Stuffed escalope with lemon',
    alt_hr:'Dva pohana punjena odreska na bijelom tanjuru, rastopljeni sir se razvlači između njih, uz krišku limuna.',
    alt_en:'Two breaded stuffed escalopes on a white plate, melted cheese stretching between them, with a lemon wedge.' },
  { slot:'gal-ulje', w:1000, h:1000, span:4, sizes:'(min-width:64rem) 32vw, 50vw',
    cap_hr:'Naše maslinovo ulje iz Skradina', cap_en:'Our olive oil from Skradin',
    alt_hr:'Dvije boce ekstra djevičanskog maslinovog ulja s etiketom Mon Ami, ispred zida od opeke.',
    alt_en:'Two bottles of extra virgin olive oil with Mon Ami labels, in front of a brick wall.' },
  { slot:'gal-torta', w:1000, h:1250, span:6, sizes:'(min-width:64rem) 48vw, 100vw',
    cap_hr:'Torta s orasima i sladoledom', cap_en:'Walnut torte with ice cream',
    alt_hr:'Kriška čokoladom glazirane torte s orasima, kriškama naranče i kuglicom sladoleda, na tamnom sjajnom tanjuru.',
    alt_en:'A slice of chocolate-glazed walnut torte with orange segments and a scoop of ice cream, on a dark glossy plate.' },
  { slot:'gal-lignje', w:1200, h:800, span:6, sizes:'(min-width:64rem) 48vw, 100vw',
    cap_hr:'Lignje s blitvom, u bijelim rukavicama', cap_en:'Squid with Swiss chard, served in white gloves',
    alt_hr:'Veliki bijeli ovalni tanjur s lignjama sa žara i blitvom s krumpirom, u rukama konobara u bijelim rukavicama.',
    alt_en:'A large white oval platter of grilled squid and Swiss chard with potatoes, held in a waiter’s white-gloved hands.' },
];

/* ── Local suppliers, named by the chef ───────────────────────────────── */
const SUPPLIERS = [
  { n:'01', name:'OPG Balić', hr:'med, Žumberačko gorje',                   en:'honey, Žumberak Highlands' },
  { n:'02', name:'OPG Haha',  hr:'lješnjaci i pasta od lješnjaka, Turopolje', en:'hazelnuts and hazelnut paste, Turopolje' },
  { n:'03', name:'OPG Goga',  hr:'kruške, Turopolje',                        en:'pears, Turopolje' },
];

/* ── The daily catch ──────────────────────────────────────────────────── */
const SPECIES = [
  { hr:'škrpina',           en:'scorpionfish' },
  { hr:'brancin',           en:'sea bass' },
  { hr:'kovač',             en:'John Dory' },
  { hr:'zubatac',           en:'dentex' },
  { hr:'crna orada',        en:'black sea bream' },
  { hr:'sabljarka',         en:'swordfish' },
  { hr:'kvarnerski škampi', en:'Kvarner langoustines' },
  { hr:'jastog',            en:'lobster' },
];

/* ── Story timeline ───────────────────────────────────────────────────── */
const TIMELINE = [
  { y:'1997.', hr:'Božo i Barica Ceronja otvaraju Mon Ami na glavnom trgu.', en:'Božo and Barica Ceronja open Mon Ami on the main square.' },
  { y:'2008.', hr:'Goran Marko Beus preuzima kuhinju.',                      en:'Goran Marko Beus takes over the kitchen.' },
  { y:'2018.', hr:'Prva preporuka MICHELIN vodiča.',                          en:'The first MICHELIN Guide recommendation.' },
  { y:'2026.', hr:'MICHELIN Selected i Gault&Millau 13,5/20.',               en:'MICHELIN Selected and Gault&Millau 13.5/20.' },
];

/* ── Days ─────────────────────────────────────────────────────────────── */
const DAYS = [
  { hr:'Nedjelja',    en:'Sunday',    acc:'u nedjelju',    schema:'Sunday' },
  { hr:'Ponedjeljak', en:'Monday',    acc:'u ponedjeljak', schema:'Monday' },
  { hr:'Utorak',      en:'Tuesday',   acc:'u utorak',      schema:'Tuesday' },
  { hr:'Srijeda',     en:'Wednesday', acc:'u srijedu',     schema:'Wednesday' },
  { hr:'Četvrtak',    en:'Thursday',  acc:'u četvrtak',    schema:'Thursday' },
  { hr:'Petak',       en:'Friday',    acc:'u petak',       schema:'Friday' },
  { hr:'Subota',      en:'Saturday',  acc:'u subotu',      schema:'Saturday' },
];

module.exports = {
  INFO, HOURS, AWARDS, MENU, CATEGORIES, CATEGORIES_EN, CATEGORY_NOTES,
  GALLERY, SUPPLIERS, SPECIES, TIMELINE, DAYS,
};
