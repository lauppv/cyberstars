# Dificil · Producător-consumator cu semafoare

Un fir "producător" citește N numere și le pune pe rând într-un **buffer partajat** cu un singur slot. Un fir "consumator" citește din buffer și tipărește fiecare număr. Pentru că buffer-ul are doar 1 slot, producătorul trebuie să aștepte până când consumatorul consumă valoarea precedentă.

Sincronizarea se face cu **două semafoare**:

- `plin` (init 0) — semnalat de producător imediat ce a scris în buffer.
- `gol` (init 1) — semnalat de consumator imediat ce a citit din buffer.

Producătorul face `sem_wait(&gol)` înainte să scrie, apoi `sem_post(&plin)` după. Consumatorul face `sem_wait(&plin)` înainte să citească, apoi `sem_post(&gol)` după. Cele două fire alternează perfect prin unicul slot.

### Date de intrare

- Prima linie: numărul întreg `N` (1 ≤ N ≤ 20)
- Următoarele `N` linii: câte un număr întreg

### Rezultat

- `N` linii cu numerele, în ordinea în care au fost citite.

### Exemple

```
Intrare:
3
10
20
30
Ieșire:
10
20
30
```

```
Intrare:
5
7
7
7
7
7
Ieșire:
7
7
7
7
7
```

Ordinea e mereu **deterministă** — consumatorul nu poate citi un număr până când producătorul nu l-a pus, iar producătorul nu poate scrie următorul până când consumatorul nu l-a luat pe precedentul.

Folosește **sem_t**, **sem_init**, **sem_wait**, **sem_post**, **sem_destroy** din `<semaphore.h>` și **pthread_create**, **pthread_join** din `<pthread.h>`.
