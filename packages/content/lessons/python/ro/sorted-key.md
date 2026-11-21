`sorted()` pune numerele de la mic la mare și cuvintele de la A la Z. Dar de multe ori vrem altă ordine: cuvintele după lungime, oamenii după vârstă, navele după viteză. Argumentul `key` îi spune lui `sorted()` la ce să se uite când compară

---

`key` primește o funcție. `sorted()` o apelează pe fiecare element și sortează după ce primește înapoi. Elementele în sine nu se schimbă

```py
cuvinte = ["cometa", "soare", "asteroid", "luna"]
print(sorted(cuvinte))
print(sorted(cuvinte, key=len))
```

Rezultat

```text
['asteroid', 'cometa', 'luna', 'soare']
['luna', 'soare', 'cometa', 'asteroid']
```

Cu `key=len`, `sorted()` compară 6, 5, 8 și 4 în loc de cuvinte. Scriem `len` fără paranteze: dăm funcția însăși, iar `sorted()` o apelează

---

Literele mari vin înaintea celor mici în codurile pe care le-am văzut în lecția Caracterele și codurile lor, așa că `"Zara"` vine înaintea lui `"ada"`. Ca să sortăm fără să ținem cont de majuscule, comparăm varianta cu litere mici

```py
nume = ["ada", "Zara", "Ben"]
print(sorted(nume))
print(sorted(nume, key=lambda n: n.lower()))
```

Rezultat

```text
['Ben', 'Zara', 'ada']
['ada', 'Ben', 'Zara']
```

---

O lambda drept key ne lasă să sortăm dicționare după oricare dintre valorile lor. `reverse=True` întoarce ordinea

```py
nave = [
    {"nume": "Speranta", "viteza": 12},
    {"nume": "Fulger", "viteza": 30},
    {"nume": "Batrana", "viteza": 5},
]
for nava in sorted(nave, key=lambda n: n["viteza"], reverse=True):
    print(nava["nume"], nava["viteza"])
```

Rezultat

```text
Fulger 30
Speranta 12
Batrana 5
```

---

Ce facem dacă două elemente au aceeași valoare? Un key poate întoarce un tuple. Python compară primele valori și, doar când sunt egale, se uită la a doua

```py
piloti = [("Kai", 50), ("Ada", 42), ("Ben", 50)]
print(sorted(piloti, key=lambda p: (p[1], p[0])))
```

Rezultat

```text
[('Ada', 42), ('Ben', 50), ('Kai', 50)]
```

Kai și Ben au amândoi 50, așa că decid numele: Ben vine înaintea lui Kai

---

Listele au și o metodă `.sort()`. Primește aceleași `key` și `reverse`, dar schimbă lista însăși și nu întoarce nimic. `sorted()` lasă lista veche cum era și face una nouă

```py
punctaje = [7, 2, 9]
noua = sorted(punctaje)
print(punctaje, noua)
punctaje.sort(reverse=True)
print(punctaje)
```

Rezultat

```text
[7, 2, 9] [2, 7, 9]
[9, 7, 2]
```

---

## Misiune: Rezultatele cursei

Stația a ținut o cursă în tunelul ei lung. Fiecare pilot are un nume și un timp în secunde, iar un timp mai mic e mai bun

1. Începe programul cu o variabilă **piloti**, o listă de dicționare, fiecare cu un `"nume"` (un string) și un `"timp"` (un număr întreg). De exemplu `piloti = [{"nume": "kai", "timp": 50}, {"nume": "Ada", "timp": 42}, {"nume": "ben", "timp": 50}]`
2. Afișează rezultatele de la cel mai rapid la cel mai lent, câte o linie: locul numărat de la 1, `. `, numele, ` `, timpul și `s`. Piloții cu același timp merg în ordinea numelor, fără să ții cont de majuscule
3. Afișează `Dupa nume: ` și toate numele în ordinea alfabetului, fără să ții cont de majuscule, unite cu `, `

Folosește `sorted()` sau `.sort()` cu un `key`. **piloti** are între 1 și 15 piloți, iar două nume nu sunt niciodată la fel odată scrise cu litere mici

**Exemplu** pentru piloții de mai sus

```text
1. Ada 42s
2. ben 50s
3. kai 50s
Dupa nume: Ada, ben, kai
```
