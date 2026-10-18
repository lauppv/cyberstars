```c
// jos si sus sunt nodurile ale caror valori marginesc subarborele; NULL inseamna fara margine.
bool incape(struct Nod *nod, struct Nod *jos, struct Nod *sus) {
    if (nod == NULL) {
        return true;
    }
    if (jos != NULL && nod->valoare <= jos->valoare) {
        return false;
    }
    if (sus != NULL && nod->valoare >= sus->valoare) {
        return false;
    }
    return incape(nod->stanga, jos, nod) && incape(nod->dreapta, nod, sus);
}

bool este_arbore_de_cautare(struct Nod *radacina) {
    return incape(radacina, NULL, NULL);
}
```
