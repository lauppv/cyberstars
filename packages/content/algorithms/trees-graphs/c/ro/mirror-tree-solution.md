```c
struct Nod *oglindeste(struct Nod *radacina) {
    if (radacina == NULL) {
        return NULL;
    }
    struct Nod *stanga = oglindeste(radacina->stanga);
    radacina->stanga = oglindeste(radacina->dreapta);
    radacina->dreapta = stanga;
    return radacina;
}
```
