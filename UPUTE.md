# Mon Ami — upute za održavanje stranice

Ova stranica namjerno nema administratorsko sučelje. Sve što se mijenja
nalazi se na jednom mjestu, u datoteci **`src/data.js`**.

Postupak je uvijek isti:

1. otvorite `src/data.js` u bilo kojem uređivaču teksta,
2. promijenite ono što treba,
3. pokrenite naredbu `node build-html.js`,
4. pošaljite novi `index.html` i mapu `img/` na poslužitelj.

---

## 1. Promjena cijene

U `src/data.js` pronađite jelo i promijenite vrijednost `p`.
Cijena se piše s **zarezom**, točno kako se ispisuje na stranici.

```js
{ c:'Jela od mesa', hr:'Beefsteak sa žara', en:'Grilled beefsteak', p:'39,00', diet:'meat' },
```

Nakon izmjene pokrenite `node build-html.js`. Cijena se automatski
ažurira i na stranici i u podacima koje čita Google.

Kad promijenite cijene, promijenite i datum na vrhu datoteke:

```js
menuUpdated: '27. 9. 2026.',
menuUpdatedEn: '27 Sep 2026',
```

---

## 2. Promjena radnog vremena

Sve o vremenu nalazi se u jednom objektu `HOURS`. Taj objekt istovremeno
pokreće **četiri stvari**: oznaku „Otvoreno / Zatvoreno” u zaglavlju,
označeni redak u tablici radnog vremena, termine u obrascu za rezervaciju
i podatke za Google. Nigdje drugdje vrijeme ne treba dirati.

```js
week: [
  null,               // 0 nedjelja — zatvoreno
  ['11:00','16:30'],  // 1 ponedjeljak
  ['11:00','23:00'],  // 2 utorak
  ...
]
```

`null` znači da se tog dana ne radi.

**Zatvaranje na određeni datum** (blagdan, godišnji):

```js
holidays: ['2026-12-25', '2026-12-26'],
```

**Obavijest na stranici** (npr. godišnji odmor) — ostavite prazno ako
ne vrijedi, inače stranica gostima poručuje da ste zatvoreni:

```js
notice: { hr: 'Godišnji odmor od 1. do 21. kolovoza.',
          en: 'Closed for annual holidays from 1 to 21 August.' },
```

---

## 3. Promjena teksta ispod fotografije u galeriji

U `src/data.js`, u popisu `GALLERY`, promijenite `cap_hr` i `cap_en`.
`alt_hr` i `alt_en` su opisi za osobe koje ne vide fotografiju — njih
također valja prilagoditi ako mijenjate sliku.

---

## 4. Dodavanje ili uklanjanje jela

Dodajte ili obrišite redak u popisu `MENU`. Polja:

| polje | značenje |
|---|---|
| `c` | kategorija — mora biti jedna iz popisa `CATEGORIES` |
| `hr` | naziv na hrvatskom |
| `en` | naziv na engleskom |
| `p` | cijena sa zarezom, npr. `'14,80'`. Prazno ako se ne objavljuje |
| `unit` | `'kg'` ako je cijena po kilogramu, inače izostavite |
| `diet` | `gf` bez glutena, `veg` vegetarijansko, `fish` riba, `meat` meso |
| `tag` | `'chef'` za preporuku kuće |
| `note_hr` / `note_en` | kratka napomena ispod jela |

> **Napomena o oznaci `gf`.** Oznaka „bez glutena” stavljena je samo na
> jela koja kuhinja sama tako navodi. Ne dodajte je bez potvrde kuhinje.

---

## 5. Zamjena fotografije

Fotografije su unaprijed pripremljene u tri veličine i tri formata
(AVIF, WebP, JPEG) kako bi se stranica brzo učitavala.

1. stavite novu fotografiju u mapu `raw/`,
2. u `build-img.js` upišite njezino ime za odgovarajuće mjesto,
3. pokrenite `node build-img.js`, pa `node build-html.js`.

---

## Što je preostalo prije objave

| Stavka | Status |
|---|---|
| **Pravo korištenja fotografija** | Fotografije potpisuju Josip Škof, Mario Žilec i Jakob Goldstein. Potrebna je njihova pisemna suglasnost prije objave. |
| **Provjera svih 62 cijene** | Cijene su preuzete 27. 9. 2026. iz vašeg sustava za online narudžbe. Provjerite ih neposredno prije objave. |
| **Fotografija pročelja i terase** | Ne postoji nijedna. Preporuka: jedno jutro s fotografom — pročelje, terasa i tartuf na tanjuru. |
| **Fotografija Brune Ceronje** | Nedostaje; mjesto je zasad označeno inicijalom. |
| **Godina osnutka** | Svi izvori navode 1997., ali jedan članak iz 2020. spominje 1994. Potvrdite. |
| **Ime chefa** | Vaša stranica piše „Goran Marko Beus”, Gault&Millau „Marko Beus”. Odaberite jedno. |
| **E-adresa** | `monamihr@gmail.com` — preporučujemo `info@monami.hr`. |
| **Obrazac za rezervacije** | Trenutno otvara korisnikov program za e-poštu s ispunjenim podacima. Za pravo slanje s poslužitelja potrebna je jedna manja doradnja. |
