```py
class Planeta:
    def __init__(self, nume, luni, inele):
        self.nume = nume
        self.luni = luni
        self.inele = inele

    def __str__(self):
        if self.luni == 0:
            text = f"{self.nume}, fara luni"
        else:
            text = f"{self.nume}, luni: {self.luni}"
        if self.inele:
            text += ", inele"
        return text


nume = ["Saturn", "Marte", "Venus"]
luni = [146, 2, 0]
inele = [True, False, False]

planete = [Planeta(n, l, i) for n, l, i in zip(nume, luni, inele)]
for planeta in planete:
    print(planeta)

cu_inele = [str(p) for p in planete if p.inele]
if len(cu_inele) == 0:
    print("Cu inele: niciuna")
else:
    print(f"Cu inele: {' / '.join(cu_inele)}")
```
