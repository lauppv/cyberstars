Știm pipe-uri și știm dup2. Le punem împreună și putem construi ce construiește shell-ul când scriem `seq 5 | sort -r`: două programe, cu ieșirea primului curgând direct în intrarea celui de-al doilea

---

Planul

1. Facem un pipe. Acum avem fd[0] pentru citire și fd[1] pentru scriere
2. Pornim primul copil. Își îndreaptă stdout-ul, descriptorul 1, spre capătul de scriere al pipe-ului cu dup2, apoi rulează primul program
3. Pornim al doilea copil. Își îndreaptă stdin-ul, descriptorul 0, spre capătul de citire al pipe-ului, apoi rulează al doilea program
4. Părintele închide **ambele** capete ale pipe-ului și îi așteaptă pe amândoi copiii

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    int fd[2];
    pipe(fd);

    fflush(stdout);
    pid_t stanga = fork();
    if (stanga == 0) {
        dup2(fd[1], 1);
        close(fd[0]);
        close(fd[1]);
        execlp("seq", "seq", "5", NULL);
        _exit(127);
    }

    pid_t dreapta = fork();
    if (dreapta == 0) {
        dup2(fd[0], 0);
        close(fd[0]);
        close(fd[1]);
        execlp("sort", "sort", "-r", NULL);
        _exit(127);
    }

    close(fd[0]);
    close(fd[1]);
    waitpid(stanga, NULL, 0);
    waitpid(dreapta, NULL, 0);
    return 0;
}
```

Ieșire

```text
5
4
3
2
1
```

---

De ce atâtea închideri? Din cauza felului în care un cititor află că datele s-au terminat. sort citește până când read întoarce 0, iar read întoarce 0 doar când **niciun proces** nu mai ține deschis capătul de scriere

După fork, fiecare proces are propria copie a ambelor capete. Copia lui fd[1] din primul copil se închide când se termină seq. Dar dacă părintele sau al doilea copil își ține deschisă propria copie a lui fd[1], pipe-ul nu pare niciodată terminat. sort așteaptă la nesfârșit alte numere, iar tot programul se blochează

Așa că regula e: fiecare proces închide fiecare capăt de pipe pe care nu-l folosește. După dup2, copiii nici nu mai au nevoie de numerele originale, deci le închid pe amândouă

---

Cele două programe chiar rulează în același timp. seq nu-și produce întâi toate numerele: imediat ce scrie câteva, sort le poate citi. Dacă pipe-ul se umple, cam 64 KB, seq așteaptă până îi face sort loc. Kernelul se ocupă de toate astea

---

Ce cod de ieșire are un pipeline? În shell, `$?` după un pipeline e codul de ieșire al **ultimului** program. Pe acela îl așteptăm și îl raportăm

---

## Misiune: Montatorul de țevi

Operatorii vor să scrie la consolă pipeline-uri în două etape, exact ca într-un shell

1. Citește linii până se termină datele. Fiecare linie are două comenzi despărțite prin `|`, de exemplu `seq 5 | sort -r`. Fiecare comandă e un program și argumentele lui, despărțite prin spații
2. Pentru fiecare linie, leagă cele două comenzi cu un pipe, rulează-le pe amândouă și așteaptă-le pe amândouă
3. După asta, afișează `[iesire N]`, cu codul de ieșire al celei de-a doua comenzi
4. Dacă exec eșuează, copilul iese cu 127

Apelează fflush(stdout) înainte de fiecare fork. Liniile au cel mult 100 de caractere, iar fiecare comandă cel mult 8 cuvinte. Prima comandă nu citește niciodată date de intrare

**Exemplu**

Intrare

```text
seq 5 | sort -r
echo tape reel card | wc -w
nosuchcmd | wc -l
seq 3 | nosuchcmd
```

Ieșire

```text
5
4
3
2
1
[iesire 0]
3
[iesire 0]
0
[iesire 0]
[iesire 127]
```

Când primul program nu poate porni, pipe-ul se termină pur și simplu gol, iar wc numără 0 linii
