În lecția despre fork, părintele apela wait(NULL): „așteaptă până termină copilul meu”. Dar de multe ori un părinte vrea să știe **cum** s-a terminat copilul. Și-a terminat treaba? A dat greș? S-a prăbușit? Copilul i-o poate spune, printr-un număr mic: **codul lui de ieșire** (exit status)

---

Copilul pune acest număr când se termină, cu **\_exit(cod)** din unistd.h. Din obișnuință, 0 înseamnă „totul e bine”, iar orice altceva înseamnă că ceva a mers prost. Părintele îl strânge cu **waitpid**

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    if (pid == 0) {
        _exit(7);
    }

    int stare;
    waitpid(pid, &stare, 0);
    if (WIFEXITED(stare)) {
        printf("copilul a iesit cu %d\n", WEXITSTATUS(stare));
    }
    return 0;
}
```

Ieșire

```text
copilul a iesit cu 7
```

De ce \_exit și nu exit, din stdlib.h? După fork, copilul are o copie a tot ce avea părintele: inputul pe care scanf l-a citit deja în avans și textul pe care printf îl ține înainte să-l afișeze. exit ar trata copiile astea ca fiind ale copilului, așa că inputul părintelui ar putea fi citit de două ori și textul lui afișat de două ori. \_exit oprește copilul pe loc și le lasă în pace. Dacă și copilul a afișat ceva, apelează fflush(stdout) chiar înainte de \_exit

`waitpid(pid, &stare, 0)` așteaptă acel copil, pe cel cu acest pid, și scrie în stare cum s-a terminat. wait(NULL) așteaptă orice copil și aruncă informația asta

stare strânge mai multe lucruri într-un singur int, așa că nu-l citim direct. Îl întrebăm prin macro-uri din sys/wait.h

- `WIFEXITED(stare)`: adevărat dacă copilul s-a terminat normal, cu \_exit, exit sau return
- `WEXITSTATUS(stare)`: atunci, numărul pe care i l-a dat lui \_exit

---

Codul de ieșire are doar un byte: de la 0 la 255. \_exit(300) ajunge ca 300 % 256, adică 44. E făcut pentru răspunsuri scurte, de genul „0 pentru ok, 1 pentru problema asta, 2 pentru cealaltă”, nu pentru rezultate mari

---

Un copil se poate termina și fără să apeleze \_exit: se poate prăbuși. Atunci l-a oprit un **semnal**, un mesaj de la kernel. Vom învăța mai multe despre semnale în curând. Deocamdată, două macro-uri ne spun care a fost

- `WIFSIGNALED(stare)`: adevărat dacă un semnal a oprit copilul
- `WTERMSIG(stare)`: numărul acelui semnal

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    if (pid == 0) {
        abort();
    }

    int stare;
    waitpid(pid, &stare, 0);
    if (WIFSIGNALED(stare)) {
        printf("copilul a fost oprit de semnalul %d\n", WTERMSIG(stare));
    }
    return 0;
}
```

Ieșire

```text
copilul a fost oprit de semnalul 6
```

abort() oprește un program intenționat, cu semnalul 6, SIGABRT. Un pointer greșit dă semnalul 11, SIGSEGV, adică „Segmentation fault”. Părintele supraviețuiește în ambele cazuri: prăbușirea unui copil nu-l doboară niciodată pe părinte

---

Acum o capcană în care cade oricine folosește printf împreună cu fork. Ține minte că printf strânge textul într-un buffer înainte să-l scrie. fork copiază tot procesul, **inclusiv bufferul**. Așa că textul pe care părintele l-a afișat, dar care încă aștepta în buffer, apare de două ori: o dată de la părinte, o dată de la copil

Într-un terminal s-ar putea să nu observi, pentru că acolo printf scrie fiecare linie imediat. Dar când ieșirea merge într-un pipe sau într-un fișier, ca atunci când testele îți verifică programul, bufferul o ține. Reparația e o singură linie: apelează **fflush(stdout)** chiar înainte de fiecare fork, ca bufferul să fie gol când e copiat

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    printf("pornesc lucrarea\n");
    fflush(stdout);
    pid_t pid = fork();
    if (pid == 0) {
        _exit(0);
    }

    waitpid(pid, NULL, 0);
    printf("lucrarea s-a terminat\n");
    return 0;
}
```

Ieșire

```text
pornesc lucrarea
lucrarea s-a terminat
```

---

## Misiune: Verificatorul de lucrări

Planificatorul împarte lucrări mici, câte una pentru fiecare proces copil. Fiecare copil verifică un număr și raportează doar prin codul lui de ieșire. Părintele strânge răspunsurile și scrie raportul

1. Citește numere întregi până se termină datele
2. Pentru fiecare număr x, fă un copil cu fork. Copilul numără câți divizori are x și iese cu acel număr. Dar dacă x e negativ, lucrarea e stricată: copilul apelează abort()
3. Părintele așteaptă acel copil cu waitpid, apoi afișează o linie, înainte să pornească următorul copil
   - pentru o ieșire normală: `x: iesire N`, unde N e codul de ieșire
   - pentru un copil oprit de un semnal: `x: oprit de semnalul S`
4. Apelează fflush(stdout) înainte de fiecare fork, ca nicio linie să nu apară de două ori

Numerele sunt între -100 și 200 și nu sunt niciodată 0. Sunt cel mult 20

**Exemplu**

Intrare

```text
12 7 -3 1
```

Ieșire

```text
12: iesire 6
7: iesire 2
-3: oprit de semnalul 6
1: iesire 1
```
