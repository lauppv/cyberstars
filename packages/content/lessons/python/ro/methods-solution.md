```py
class Rezervor:
    def __init__(self, capacitate):
        self.capacitate = capacitate
        self.combustibil = 0

    def umple(self, cantitate):
        adaugat = min(cantitate, self.capacitate - self.combustibil)
        self.combustibil += adaugat
        return adaugat

    def foloseste(self, cantitate):
        if cantitate > self.combustibil:
            return False
        self.combustibil -= cantitate
        return True

    def procent(self):
        return self.combustibil * 100 // self.capacitate


capacitate = 80
actiuni = ["umple 50", "foloseste 20", "umple 70", "foloseste 100"]

rezervor = Rezervor(capacitate)
for actiune in actiuni:
    nume, cantitate = actiune.split()
    if nume == "umple":
        rezultat = rezervor.umple(int(cantitate))
    else:
        rezultat = rezervor.foloseste(int(cantitate))
    print(f"{actiune}: {rezultat}")
print(f"Plin: {rezervor.procent()}%")
```
