Am văzut pe scurt în lecția despre dicționare cum să numărăm literele dintr-un cuvânt. Acest tipar este atât de important încât merită propria lui lecție. Se numește **dicționar de frecvențe** (sau **histogramă**) și este unealta de bază atunci când întrebarea este „de câte ori apare fiecare X?"

```py
cuvant = "mississippi"
freq = {}

for litera in cuvant:
    if litera in freq:
        freq[litera] += 1
    else:
        freq[litera] = 1

print(freq)
```

Rezultat **{'m': 1, 'i': 4, 's': 4, 'p': 2}**

Hai să înțelegem asta linie cu linie. Pornim cu un dicționar gol. Pentru fiecare literă, verificăm: este deja în dicționar? Dacă da, adăugăm 1 la numărătoarea ei. Dacă nu, creăm o intrare nouă cu numărătoarea 1

---

Asta funcționează pentru **orice**, nu doar pentru litere. Numărarea cuvintelor dintr-o propoziție

```py
propozitie = "I like pizza and I like burgers and I like tacos"
cuvinte = propozitie.split(" ")
freq = {}

for cuvant in cuvinte:
    if cuvant in freq:
        freq[cuvant] += 1
    else:
        freq[cuvant] = 1

print(freq)
```

Rezultat **{'I': 3, 'like': 3, 'pizza': 1, 'and': 2, 'burgers': 1, 'tacos': 1}**

---

Odată ce avem un dicționar de frecvențe, putem răspunde la întrebări interesante

**Care este cel mai comun element?**

```py
cea_mai_buna_cheie = ""
cel_mai_bun_numar = 0
for cheie, contor in freq.items():
    if contor > cel_mai_bun_numar:
        cel_mai_bun_numar = contor
        cea_mai_buna_cheie = cheie
print(f"Cel mai comun: {cea_mai_buna_cheie} ({cel_mai_bun_numar} de ori)")
```

**Ce elemente apar o singură dată?**

```py
unice = []
for cheie, contor in freq.items():
    if contor == 1:
        unice.append(cheie)
print(f"Unice: {unice}")
```

**Sortăm după frecvență?**

```py
elemente_sortate = sorted(freq.items(), key=lambda x: x[1], reverse=True)
for element, contor in elemente_sortate:
    print(f"{element}: {contor}")
```

Nu-ți face griji cu **lambda** deocamdată, doar reține că îi spune lui **sorted()** după ce valoare să sorteze (în acest caz, numărătoarea)

---

Un caz de utilizare din viața reală: construiești un sistem de analiză pentru **CyberStars** și vrei să știi care curs este cel mai popular

```py
inscrieri = ["python", "java", "python", "c", "python", "java", "c", "python", "java", "python"]
freq = {}
for curs in inscrieri:
    if curs in freq:
        freq[curs] += 1
    else:
        freq[curs] = 1

for curs, contor in freq.items():
    print(f"{curs}: {contor} studenți")
```

Rezultat

```text
python: 5 studenți
java: 3 studenți
c: 2 studenți
```

---

## Misiune: Frecvențele Semnalelor

Antena stației înregistrează fiecare semnal pe care îl primește după litera canalului (deja în dreapta). Controlul Misiunii vrea să știe cât de ocupat este fiecare canal și care este cel mai aglomerat.

1. Construiește un **dicționar de frecvențe** care numără de câte ori apare fiecare canal.
2. Afișează fiecare canal și numărătoarea lui ca `channel: contor`, **sortate alfabetic** (parcurge `sorted(freq)`).
3. Găsește canalul **cel mai comun** și afișează `Cel mai comun: ` urmat de litera lui.

**Rezultat**

```text
A: 3
B: 4
C: 1
D: 1
Cel mai comun: B
```
