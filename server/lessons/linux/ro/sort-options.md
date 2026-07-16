`sort` simplu tratează totul ca text. Numărul `9` apare **după** `80`, pentru că `9`
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

Aceasta sortează după a **doua** coloană. Combină cu `-n` pentru a sorta numeric după
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

## Misiune: Diagnostic la rețeaua de alimentare

Ingineria a detectat fluctuații în rețeaua de alimentare a stației. Fișierul `citiri_putere.txt` listează fiecare sector și nivelul său actual de putere. Ca să intervii primul asupra sectorului cel mai slab, trebuie să ordonezi citirile și să le arhivezi.

1. Sortează `citiri_putere.txt` **numeric, după a doua coloană**, astfel încât valoarea cea mai mică să apară în vârf, și afișează.
2. Salvează acel diagnostic sortat într-un fișier nou numit `diagnostic.txt`.
3. Creează un folder numit `inginerie` și mută `diagnostic.txt` în el.
4. Afișează doar prima linie — sectorul cel mai slab, de care se ocupă echipa prima dată.

**Rezultat așteptat**

`inginerie/diagnostic.txt` listează sectoarele în ordine crescătoare a puterii, de la `epsilon 5` până la `delta 800`.
