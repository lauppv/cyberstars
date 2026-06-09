Capitolul 4 te-a transformat într-un detectiv al stației. Trei unelte de căutare,
trei întrebări diferite:

| Comandă | Întrebare                                  |
| ------- | ------------------------------------------ |
| `grep`  | „Care **linii** conțin acest cuvânt?”      |
| `find`  | „Unde se află acest **fișier**?”           |
| `which` | „Unde este instalat acest **program**?”    |

Reține opțiunile puternice: `grep -r` caută în arbori întregi, `grep -i` ignoră
majusculele/minusculele, `grep -v` inversează; `find -name` potrivește după nume,
`find -type` filtrează între fișiere și foldere.

---

## Misiune: Urmărirea semnalului de salvare

Un semnal de SOS slab vine de undeva din structura de directoare `station`.
Centrul de comandă are nevoie de tine ca să identifici sursa și să extragi fiecare
transmisiune SOS.

1. Folosește `find station -name "distress.log"` pentru a localiza fișierul cu
   semnalul de pericol.
2. Folosește `grep -r "SOS" station` pentru a găsi fiecare linie care menționează
   `SOS` oriunde în `station`.
3. Folosește `which grep` pentru a confirma unde este instalat programul `grep`.

**Rezultat așteptat**

`find` dezvăluie `station/comms/distress.log`. `grep -r` arată două linii cu SOS
distribuite în două fișiere din `station/comms/`. `which` afișează calea către
binarul `grep`. Coordonatele de salvare confirmate.
