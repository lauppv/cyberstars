```py
def adancime_maxima(radacina):
    if radacina is None:
        return 0
    return 1 + max(adancime_maxima(radacina.stanga), adancime_maxima(radacina.dreapta))
```
