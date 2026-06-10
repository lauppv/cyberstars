`cat` afișează un fișier întreg dintr-odată; `head` și `tail` arată capetele. Dar ce
faci dacă vrei să **derulezi** printr-un fișier lung în ritmul tău, în sus și în jos?

Aceasta este treaba lui **less**.

```bash
less bigfile.log
```

`less` deschide fișierul într-un **vizualizator**. Nu aruncă totul — afișează un
ecran și te așteaptă. În interiorul vizualizatorului poți:

| Tastă           | Acțiune                      |
| --------------- | ---------------------------- |
| `Space` sau `f` | pagina următoare             |
| `b`             | pagina anterioară            |
| săgețile        | sus / jos o linie            |
| `/cuvânt`       | caută înainte _cuvânt_       |
| `q`             | **ieși** și revino la prompt |

Cea mai importantă tastă este **`q`** — așa ieși din `less` și îți recapeți
shell-ul.

### De ce „less”?

A existat o unealtă mai veche numită `more` care putea parcurge doar **înainte**.
`less` face tot ce face `more` _și_ îți permite să derulezi **înapoi** — de aici
numele glumeț: „less is more” („mai puțin înseamnă mai mult”).

`less` nu modifică niciodată fișierul. Este un vizualizator pur.

> În acest sandbox de antrenament vizualizatorul cu derulare este limitat, așa că
> exersează _ideea_ cu `cat` — dar pe un sistem Linux real, apelează la `less` de
> fiecare dată când un fișier este prea lung pentru un singur ecran.

---

## Misiune: Revizuiește manualul de operațiuni

Manualul de operațiuni al stației a fost actualizat și salvat în `manual.txt`.
Trebuie să îi revizuiești conținutul. În acest sandbox, folosește `cat` pentru a
afișa fișierul (pe un sistem real ai folosi `less` pentru a derula prin el pagină
cu pagină).

Afișează conținutul fișierului `manual.txt`.

**Rezultat așteptat**

Textul complet al manualului de operațiuni apare în terminalul tău.
