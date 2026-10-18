```py
def are_drum_cu_suma(radacina, suma):
    if radacina is None:
        return False
    rest = suma - radacina.valoare
    if radacina.stanga is None and radacina.dreapta is None:
        return rest == 0
    return are_drum_cu_suma(radacina.stanga, rest) or are_drum_cu_suma(radacina.dreapta, rest)
```
