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
bestKey = ""
bestCount = 0
for key, contor in freq.items():
    if contor > bestCount:
        bestCount = contor
        bestKey = key
print(f"Cel mai comun: {bestKey} ({bestCount} de ori)")
```

**Ce elemente apar o singură dată?**

```py
unique = []
for key, contor in freq.items():
    if contor == 1:
        unique.append(key)
print(f"Unice: {unique}")
```

**Sortăm după frecvență?**

```py
sortedItems = sorted(freq.items(), key=lambda x: x[1], reverse=True)
for item, contor in sortedItems:
    print(f"{item}: {contor}")
```

Nu-ți face griji cu **lambda** deocamdată, doar reține că îi spune lui **sorted()** după ce valoare să sorteze (în acest caz, numărătoarea)

---

Un caz de utilizare din viața reală: construiești un sistem de analiză pentru **CyberStars** și vrei să știi care curs este cel mai popular

```py
enrollments = ["python", "java", "python", "c", "python", "java", "c", "python", "java", "python"]
freq = {}
for course in enrollments:
    if course in freq:
        freq[course] += 1
    else:
        freq[course] = 1

for course, contor in freq.items():
    print(f"{course}: {contor} studenți")
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
