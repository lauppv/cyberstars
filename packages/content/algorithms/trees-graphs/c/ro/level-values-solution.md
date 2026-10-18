```c
void afiseaza_nivelurile(struct Nod *radacina) {
    static struct Nod *coada[1024];
    if (radacina == NULL) {
        return;
    }
    int inceput = 0;
    int sfarsit = 0;
    coada[sfarsit++] = radacina;
    while (inceput < sfarsit) {
        int sfarsit_nivel = sfarsit;
        while (inceput < sfarsit_nivel) {
            struct Nod *nod = coada[inceput++];
            printf("%d%s", nod->valoare, inceput < sfarsit_nivel ? " " : "\n");
            if (nod->stanga != NULL) {
                coada[sfarsit++] = nod->stanga;
            }
            if (nod->dreapta != NULL) {
                coada[sfarsit++] = nod->dreapta;
            }
        }
    }
}
```
