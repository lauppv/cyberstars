Capitolul 4 te-a transformat într-un detectiv al stației. Trei unelte de căutare,
trei întrebări diferite:

| Comandă | Întrebare                               |
| ------- | --------------------------------------- |
| `grep`  | „Care **linii** conțin acest cuvânt?”   |
| `find`  | „Unde se află acest **fișier**?”        |
| `which` | „Unde este instalat acest **program**?” |

Reține opțiunile puternice: `grep -r` caută în arbori întregi, `grep -i` ignoră
majusculele/minusculele, `grep -v` inversează; `find -name` potrivește după nume,
`find -type` filtrează între fișiere și foldere.

---

## Misiune: Urmărirea semnalului de salvare

Un semnal de SOS slab vine de undeva din structura de directoare `statie`.
Centrul de comandă are nevoie de tine ca să identifici sursa și să extragi fiecare
transmisiune SOS.

1. Localizează fișierul numit `pericol.log` undeva în arborele de directoare `statie`.
2. Caută în fiecare fișier din `statie`, în tot arborele, liniile care menționează
   `SOS`.
3. Confirmă unde este instalat programul `grep` pe sistem.

**Rezultat așteptat**

Fișierul de pericol se dovedește a fi `statie/comunicatii/pericol.log`. Căutarea
recursivă arată două linii cu SOS distribuite în două fișiere din
`statie/comunicatii/`, iar tu vezi calea către binarul `grep`. Coordonatele de
salvare confirmate.
