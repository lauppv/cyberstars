```c
int stramos_comun(struct Nod *radacina, int p, int q) {
    struct Nod *nod = radacina;
    while (1) {
        if (p < nod->valoare && q < nod->valoare) {
            nod = nod->stanga;
        } else if (p > nod->valoare && q > nod->valoare) {
            nod = nod->dreapta;
        } else {
            return nod->valoare;
        }
    }
}
```
