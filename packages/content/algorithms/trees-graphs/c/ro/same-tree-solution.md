```c
bool acelasi_arbore(struct Nod *primul, struct Nod *al_doilea) {
    if (primul == NULL || al_doilea == NULL) {
        return primul == NULL && al_doilea == NULL;
    }
    return primul->valoare == al_doilea->valoare && acelasi_arbore(primul->stanga, al_doilea->stanga) &&
           acelasi_arbore(primul->dreapta, al_doilea->dreapta);
}
```
