```c
int adancime_maxima(struct Nod *radacina) {
    if (radacina == NULL) {
        return 0;
    }
    int stanga = adancime_maxima(radacina->stanga);
    int dreapta = adancime_maxima(radacina->dreapta);
    if (stanga > dreapta) {
        return 1 + stanga;
    }
    return 1 + dreapta;
}
```
