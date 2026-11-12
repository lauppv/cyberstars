`sort` simplu tratează totul ca text. Numărul `9` apare după `80`, pentru că `9`
vine după `8` alfabetic. Ca să sortezi după valoarea numerică reală, folosește `-n`:

```bash
sort -n scoruri.txt
```

```text
5
12
80
103
```

Fără `-n`, ordinea ar fi `103, 12, 5, 80` (sortare textuală).

### Sortare după o coloană anume cu `-k`

Multe fișiere de date au coloane separate prin spații. Folosește `-k` pentru a sorta după
un anumit număr de coloană:

```bash
sort -k2 registru.txt
```

Aceasta sortează după a doua coloană. Combină cu `-n` pentru a sorta numeric după
acea coloană:

```bash
sort -k2 -n registru.txt
```

### Specificarea unui delimitator cu `-t`

Dacă coloanele sunt separate prin altceva decât spațiu (de exemplu două puncte), spune-i lui sort:

```bash
sort -t: -k3 -n date.txt
```

Aici se folosește `:` ca delimitator și se sortează numeric după coloana 3.

---

## Misiune: Diagnosticul Rețelei de Putere

Ingineria a detectat fluctuații în rețeaua de putere. `citiri_putere.txt` listează fiecare sector cu nivelul lui de putere. Ca să se ocupe întâi de sectorul cel mai slab, vor, într-un folder nou `inginerie`, toate citirile ordonate de la puterea cea mai mică la cea mai mare ca `diagnostic.txt`, iar linia sectorului cel mai slab, singură, ca `cel-mai-slab.txt`.

**Rezultat așteptat**

`inginerie/diagnostic.txt` listează sectoarele după puterea crescătoare, iar `inginerie/cel-mai-slab.txt` ține doar pe cel mai slab.
