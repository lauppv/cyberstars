Două fire trebuie să tipărească **alternat** "Ping" și "Pong" — mai întâi Ping, apoi Pong, apoi din nou Ping etc. Cu doar mutex-uri și `pthread_join` nu poți impune ordinea. Ai nevoie de un mecanism de **semnalare** între fire.

Folosește **două semafoare** ca să dai controlul de la un fir la celălalt. Firul "Ping" începe cu semaforul lui la 1 (are voie să tipărească). Firul "Pong" începe cu semaforul lui la 0 (așteaptă). După ce Ping tipărește, face `sem_post` pe semaforul lui Pong. Pong se deblochează, tipărește, face `sem_post` pe semaforul lui Ping. Se repetă de N ori.

### Date de intrare

- Prima linie: numărul întreg `N` (1 ≤ N ≤ 20) — de câte ori tipărește fiecare fir.

### Rezultat

- 2N linii care alternează `Ping` și `Pong`, întotdeauna începând cu `Ping`.

### Exemple

```
Intrare:
3
Ieșire:
Ping
Pong
Ping
Pong
Ping
Pong
```

```
Intrare:
1
Ieșire:
Ping
Pong
```

Chiar dacă firele rulează concurent, ordinea liniilor e **deterministă** — semafoarele forțează alternarea.

Folosește **sem_t**, **sem_init**, **sem_wait**, **sem_post**, **sem_destroy** din `<semaphore.h>` și **pthread_create**, **pthread_join** din `<pthread.h>`.
