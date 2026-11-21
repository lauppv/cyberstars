Un pipe făcut cu pipe() nu are nume. Doar procesul care l-a făcut și copiii lui îi țin descriptorii, deci doar familia îl poate folosi. Dar dacă vor să vorbească două programe care nu sunt înrudite?

Pot folosi un **pipe cu nume** (named pipe), numit și **FIFO**: „first in, first out”, primul intrat, primul ieșit. E un pipe care stă într-un folder, cu un nume, ca un fișier. Orice proces care știe numele îl poate deschide

---

**mkfifo**, din sys/stat.h, face unul. După aceea îl folosim cu apelurile obișnuite: open, read, write, close. Merge chiar și fopen, pentru că oricărui program îi arată ca un fișier

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/stat.h>
#include <sys/wait.h>

int main(void) {
    mkfifo("teava", 0644);

    fflush(stdout);
    pid_t pid = fork();
    if (pid == 0) {
        FILE *in = fopen("teava", "r");
        char cuvant[32];
        fscanf(in, "%31s", cuvant);
        printf("copilul a primit: %s\n", cuvant);
        fclose(in);
        fflush(stdout);
        _exit(0);
    }

    FILE *out = fopen("teava", "w");
    fprintf(out, "salut\n");
    fclose(out);
    waitpid(pid, NULL, 0);

    unlink("teava");
    return 0;
}
```

Ieșire

```text
copilul a primit: salut
```

Aici am folosit fork doar ca să avem două procese într-un singur program. Cealaltă parte ar putea fi la fel de bine un program cu totul diferit, pornit în alt moment, care deschide "teava"

---

Un FIFO se poartă altfel decât un fișier în trei feluri

1. **Deschiderea așteaptă.** Deschiderea pentru citire așteaptă până când un proces îl deschide pentru scriere, și invers. Fiecare parte își așteaptă partenerul
2. **Datele trec prin el, nu sunt păstrate.** Ce citește cititorul dispare din FIFO. Pe disc nu se păstrează nimic: numele e pe disc, datele sunt doar în memoria kernelului
3. **Sfârșitul vine când se închid scriitorii.** Cititorul primește EOF, adică fgets întoarce NULL, când fiecare scriitor și-a închis partea

---

Numele rămâne în folder până îl ștergem, chiar și după ce se termină ambele programe. Așa că facem curat cu unlink când am terminat. Dacă nu, următorul mkfifo eșuează cu EEXIST. Nu strică nimic, FIFO-ul vechi merge la fel de bine, dar e frumos să ștergi ce ai făcut

---

## Misiune: Cutia poștală

Tura de zi lasă mesaje pentru tura de noapte într-o cutie poștală: un FIFO numit `mailbox`. Un proces pune mesajele, altul le citește și scrie jurnalul

1. Fă FIFO-ul `mailbox` cu mkfifo. Dacă e deja acolo, e în regulă
2. Fă un copil, cititorul. Deschide cutia pentru citire, citește mesaje până la EOF și îl afișează pe fiecare cu numărul lui. La final afișează câte mesaje au fost, ca în exemplu
3. Părintele, cel care pune mesajele, deschide cutia pentru scriere, citește linii de la intrare până se termină datele și scrie fiecare linie în cutie. Apoi o închide
4. Părintele așteaptă cititorul, șterge cutia cu unlink și afișează `Cutia a fost stearsa`

Doar copilul afișează mesaje, deci ieșirea vine mereu în aceeași ordine. Apelează fflush(stdout) înainte de fork. Sunt între 1 și 100 de mesaje, fiecare de cel mult 100 de caractere, și niciunul nu e gol

**Exemplu**

Intrare

```text
load tape 7
run payroll
```

Ieșire

```text
1: load tape 7
2: run payroll
Mesaje: 2
Cutia a fost stearsa
```
