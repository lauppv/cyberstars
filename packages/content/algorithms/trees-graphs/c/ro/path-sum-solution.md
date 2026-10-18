```c
bool are_drum_cu_suma(struct Nod *radacina, int suma) {
    if (radacina == NULL) {
        return false;
    }
    int rest = suma - radacina->valoare;
    if (radacina->stanga == NULL && radacina->dreapta == NULL) {
        return rest == 0;
    }
    return are_drum_cu_suma(radacina->stanga, rest) || are_drum_cu_suma(radacina->dreapta, rest);
}
```
