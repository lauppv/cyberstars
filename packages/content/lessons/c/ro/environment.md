Fiecare proces poartă cu el o mică listă de valori text cu nume, numite **variabile de mediu** (environment variables). Sunt ca niște setări care călătoresc cu procesul: unde e folderul lui de acasă, ce limbă vorbește, unde să caute programe. Fiecare e un nume și o valoare, de exemplu `HOME=/home/ada`

Când un proces face un copil cu fork, copilul primește o copie a listei. Când rulează alt program cu exec, programul acela păstrează și el lista. Așa că o setare dată primului proces ajunge la tot ce pornește el

---

**getenv**, din stdlib.h, citește o variabilă după nume. Îi întoarce valoarea ca șir, sau NULL dacă nu există o astfel de variabilă

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    char *cale = getenv("PATH");
    char *lipsa = getenv("NU_EXISTA_SETAREA");

    printf("%s\n", cale != NULL ? "PATH e setat" : "PATH lipseste");
    printf("%s\n", lipsa != NULL ? "gasit" : "nesetat");
    return 0;
}
```

Ieșire

```text
PATH e setat
nesetat
```

**PATH** e cea pe care am întâlnit-o deja fără să știm: o listă de foldere despărțite prin `:`. Când execvp primește un nume ca "echo", îl caută în fiecare dintre acele foldere, în ordine

---

**setenv** adaugă o variabilă sau o schimbă, iar **unsetenv** o șterge. Al treilea argument al lui setenv spune ce să facă dacă numele există deja: 1 înseamnă „înlocuiește-o”, 0 înseamnă „păstrează valoarea veche”

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    setenv("TURA", "zi", 1);
    setenv("TURA", "noapte", 0);
    printf("%s\n", getenv("TURA"));

    setenv("TURA", "noapte", 1);
    printf("%s\n", getenv("TURA"));

    unsetenv("TURA");
    printf("%s\n", getenv("TURA") == NULL ? "disparuta" : "inca aici");
    return 0;
}
```

Ieșire

```text
zi
noapte
disparuta
```

---

Schimbările merg doar în jos, niciodată în sus. Un copil vede ce avea părintele lui când a fost făcut. Dar dacă un copil schimbă o variabilă, părintele nu vede niciodată schimbarea: copilul și-a schimbat propria copie

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    setenv("SALA", "B12", 1);
    fflush(stdout);
    if (fork() == 0) {
        printf("copilul vede %s\n", getenv("SALA"));
        setenv("SALA", "C7", 1);
        fflush(stdout);
        _exit(0);
    }
    wait(NULL);
    printf("parintele are tot %s\n", getenv("SALA"));
    return 0;
}
```

Ieșire

```text
copilul vede B12
parintele are tot B12
```

De aceea un program nu poate schimba niciodată mediul shell-ului care l-a pornit

---

## Misiune: Setările turei

Șeful de tură ține setările de noapte în variabile de mediu și vrea să verifice că programele pornite pentru tură chiar le primesc

1. Citește comenzi, câte una pe linie, până se termină datele
   - `set nume valoare`: setează variabila, înlocuind o valoare veche
   - `unset nume`: șterge variabila
   - `get nume`: afișează `nume=valoare` sau `nume nu e setata`
   - `child nume`: pornește programul printenv cu numele ca argument, cu fork și exec, și așteaptă-l. printenv afișează valoarea și iese cu 0, sau nu afișează nimic și iese cu 1 când variabila nu e setată. Când iese cu 1, afișează `nume nu e setata in copil`
2. Apelează fflush(stdout) înainte de fiecare fork

Numele sunt cu majuscule, de cel mult 20 de caractere. Valorile sunt un cuvânt de cel mult 30 de caractere

**Exemplu**

Intrare

```text
set SHIFT night
get SHIFT
child SHIFT
unset SHIFT
get SHIFT
child SHIFT
```

Ieșire

```text
SHIFT=night
night
SHIFT nu e setata
SHIFT nu e setata in copil
```
