```py
class EroareStatie(Exception):
    pass


class NavaNecunoscuta(EroareStatie):
    pass


class CombustibilInsuficient(EroareStatie):
    def __init__(self, lipsa):
        super().__init__(f"lipsesc {lipsa}")
        self.lipsa = lipsa


def alimenteaza(nume, cantitate, stoc, cunoscute):
    if nume not in cunoscute:
        raise NavaNecunoscuta("nava necunoscuta")
    if cantitate > stoc:
        raise CombustibilInsuficient(cantitate - stoc)
    return stoc - cantitate


stoc = 100
cunoscute = ["Speranta", "Fulger"]
cereri = ["Speranta 40", "Bob 10", "Fulger 80", "Fulger 50"]

lipsa = 0
for cerere in cereri:
    nume, cantitate = cerere.split()
    try:
        stoc = alimenteaza(nume, int(cantitate), stoc, cunoscute)
        print(f"{nume}: a primit {cantitate}")
    except CombustibilInsuficient as e:
        lipsa += e.lipsa
        print(f"{nume}: {e}")
    except EroareStatie as e:
        print(f"{nume}: refuzat, {e}")
print(f"Ramas: {stoc}")
print(f"Lipsa in total: {lipsa}")
```
