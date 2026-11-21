Python vine cu o cutie mare de unelte gata făcute: funcții și valori pentru matematică, numere la întâmplare, date calendaristice, fișiere și multe altele. Ele sunt ținute în **module**, fișiere de cod Python cu un nume. Ca să folosim unul, îl aducem în programul nostru cu `import`

---

`import` și numele modulului aduc tot modulul. Apoi ajungem la ce e în el cu un punct, ca la o metodă

```py
import string

print(string.ascii_uppercase)
print(string.digits)
```

Rezultat

```text
ABCDEFGHIJKLMNOPQRSTUVWXYZ
0123456789
```

Modulul `string` are string-uri utile: toate literele mari, toate literele mici în `string.ascii_lowercase`, cifrele și simbolurile în `string.punctuation`. Punem import-urile la începutul programului, ca oricine îl citește să vadă imediat ce folosește

---

`from` aduce doar numele de care avem nevoie, iar apoi le folosim fără numele modulului în față

```py
from string import digits, ascii_lowercase

print("7" in digits)
print(len(ascii_lowercase))
```

Rezultat

```text
True
26
```

E mai scurt, dar cine citește nu mai vede de unde vine `digits`. Cu `import string` și `string.digits`, e mereu clar

---

`as` îi dă unui modul sau unui nume un nume mai scurt, al nostru

```py
import string as s

print(s.digits[:3])
```

Rezultat

```text
012
```

---

De ce să ținem lucrurile în module, în loc să avem totul gata? Pentru că numele s-ar ciocni. Multe module au o funcție numită `choice` sau `sqrt`, iar programul nostru poate avea o variabilă cu același nume. Numele modulului în față, ca `string.digits`, le ține separat. De aici vine o capcană: nu-ți numi niciodată fișierul ca pe un modul, de exemplu `string.py`. Atunci `import string` găsește fișierul tău în locul modulului lui Python

---

## Misiune: Verificarea parolei

Calculatorul stației lasă membrii echipajului să aleagă doar o parolă puternică. O parolă puternică are cel puțin 8 caractere și cel puțin o literă mare, o cifră și un simbol

1. Începe programul cu o variabilă **parola**, un string. De exemplu `parola = "Orbit7!x"`
2. Afișează `Majuscule: `, `Cifre: ` și `Simboluri: `, fiecare pe linia lui, urmate de `da` dacă parola are cel puțin un caracter de acel fel, sau `nu`
3. Afișează `Puternica: ` și `da` dacă parola e puternică, sau `nu`

Folosește modulul `string` pentru felurile de caractere: `ascii_uppercase`, `digits` și `punctuation`. **parola** are între 1 și 30 de caractere, fără spații

**Exemplu** pentru parola = "Orbit7!x"

```text
Majuscule: da
Cifre: da
Simboluri: da
Puternica: da
```

**Exemplu** pentru parola = "moon2"

```text
Majuscule: nu
Cifre: da
Simboluri: nu
Puternica: nu
```
