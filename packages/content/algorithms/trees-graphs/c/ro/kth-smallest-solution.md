```c
int a_k_a_cea_mai_mica(struct Nod *radacina, int k) {
    static struct Nod *stiva[512];
    int varf = 0;
    struct Nod *nod = radacina;
    while (1) {
        while (nod != NULL) {
            stiva[varf++] = nod;
            nod = nod->stanga;
        }
        nod = stiva[--varf];
        k--;
        if (k == 0) {
            return nod->valoare;
        }
        nod = nod->dreapta;
    }
}
```
