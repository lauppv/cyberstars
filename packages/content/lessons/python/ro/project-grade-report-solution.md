```py
from collections import Counter


class Elev:
    def __init__(self, nume):
        self.nume = nume
        self.note = {}

    def adauga(self, materie, nota):
        self.note[materie] = nota

    def media(self):
        return sum(self.note.values()) / len(self.note)

    def calificativ(self):
        media = self.media()
        if media >= 90:
            return "A"
        if media >= 80:
            return "B"
        if media >= 70:
            return "C"
        if media >= 60:
            return "D"
        return "F"


elevi = {}
while True:
    linie = input()
    if linie == "end":
        break
    nume, materie, nota = linie.split()
    if nume not in elevi:
        elevi[nume] = Elev(nume)
    elevi[nume].adauga(materie, int(nota))

clasament = sorted(elevi.values(), key=lambda e: (-e.media(), e.nume))
for elev in clasament:
    print(f"{elev.nume:<8}{elev.media():>6.1f}  {elev.calificativ()}")

calificative = Counter(elev.calificativ() for elev in clasament)
print("Calificative: " + ", ".join(f"{litera} {calificative[litera]}" for litera in "ABCDF" if calificative[litera] > 0))

materii = sorted({materie for elev in clasament for materie in elev.note})
for materie in materii:
    au_nota = [e for e in elevi.values() if materie in e.note]
    cel_mai_bun = sorted(au_nota, key=lambda e: (-e.note[materie], e.nume))[0]
    print(f"Cel mai bun la {materie}: {cel_mai_bun.nume}")
```
