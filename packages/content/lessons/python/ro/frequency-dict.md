Am văzut pe scurt în lecția despre dicționare cum să numărăm literele dintr-un cuvânt. Acest tipar este atât de important încât merită propria lui lecție. Se numește **dicționar de frecvențe** (sau **histogramă**) și este unealta de bază atunci când întrebarea este „de câte ori apare fiecare X?"

```py
cuvant = "mississippi"
frecventa = {}

for litera in cuvant:
    if litera in frecventa:
        frecventa[litera] += 1
    else:
        frecventa[litera] = 1

print(frecventa)
```

Rezultat **{'m': 1, 'i': 4, 's': 4, 'p': 2}**

Hai să înțelegem asta linie cu linie. Pornim cu un dicționar gol. Pentru fiecare literă, verificăm: este deja în dicționar? Dacă da, adăugăm 1 la numărătoarea ei. Dacă nu, creăm o intrare nouă cu numărătoarea 1

---

Asta funcționează pentru **orice**, nu doar pentru litere. Numărarea cuvintelor dintr-o propoziție

```py
propozitie = "imi place pizza si imi place supa si imi place tortul"
cuvinte = propozitie.split(" ")
frecventa = {}

for cuvant in cuvinte:
    if cuvant in frecventa:
        frecventa[cuvant] += 1
    else:
        frecventa[cuvant] = 1

print(frecventa)
```

Rezultat **{'imi': 3, 'place': 3, 'pizza': 1, 'si': 2, 'supa': 1, 'tortul': 1}**

---

Odată ce avem un dicționar de frecvențe, putem răspunde la întrebări interesante

**Care este cel mai comun element?**

```py
cea_mai_buna_cheie = ""
cel_mai_bun_numar = 0
for cheie, contor in frecventa.items():
    if contor > cel_mai_bun_numar:
        cel_mai_bun_numar = contor
        cea_mai_buna_cheie = cheie
print(f"Cel mai comun: {cea_mai_buna_cheie} ({cel_mai_bun_numar} de ori)")
```

**Ce elemente apar o singură dată?**

```py
unice = []
for cheie, contor in frecventa.items():
    if contor == 1:
        unice.append(cheie)
print(f"Unice: {unice}")
```

**Sortăm după frecvență?**

```py
elemente_sortate = sorted(frecventa.items(), key=lambda x: x[1], reverse=True)
for element, contor in elemente_sortate:
    print(f"{element}: {contor}")
```

Nu-ți face griji cu **lambda** deocamdată, doar reține că îi spune lui **sorted()** după ce valoare să sorteze (în acest caz, numărătoarea)

---

Un caz de utilizare din viața reală: construiești un sistem de analiză pentru **CyberStars** și vrei să știi care curs este cel mai popular

```py
inscrieri = ["python", "java", "python", "c", "python", "java", "c", "python", "java", "python"]
frecventa = {}
for curs in inscrieri:
    if curs in frecventa:
        frecventa[curs] += 1
    else:
        frecventa[curs] = 1

for curs, contor in frecventa.items():
    print(f"{curs}: {contor} studenti")
```

Ieșire

```text
python: 5 studenti
java: 3 studenti
c: 2 studenti
```

---

## Misiune: Frecvențele Semnalelor

Antena stației înregistrează fiecare semnal pe care îl primește după litera canalului într-o listă numită semnale. Controlul Misiunii vrea să știe cât de ocupat este fiecare canal și care este cel mai aglomerat.

1. Construiește un **dicționar de frecvențe** care numără de câte ori apare fiecare canal.
2. Afișează fiecare canal și numărătoarea lui ca `canal: contor`, **sortate alfabetic** (parcurge `sorted(frecventa)`).
3. Găsește canalul **cel mai comun** și afișează `Cel mai comun: ` urmat de litera lui.

**Ieșire**

```text
A: 3
B: 4
C: 1
D: 1
Cel mai comun: B
```
