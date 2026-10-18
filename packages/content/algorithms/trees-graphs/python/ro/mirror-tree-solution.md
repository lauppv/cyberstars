```py
def oglindeste(radacina):
    if radacina is not None:
        radacina.stanga, radacina.dreapta = oglindeste(radacina.dreapta), oglindeste(radacina.stanga)
    return radacina
```
