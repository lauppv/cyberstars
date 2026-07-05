Proiectul final. Vom construi o bucată dintr-un **shell** — programul care rulează când deschizi un terminal. Acesta combină **fork**, **wait** și tot ce am învățat despre procese

Un shell real face așa: citește o comandă, face **fork**, copilul execută comanda, părintele așteaptă. Vom construi o versiune simplificată care citește comenzi dintr-o coadă de teletype și le rulează una câte una, demonstrând tiparul fork-and-wait

---

Iată ideea de bază

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>
#include <string.h>

void ruleaza_comanda(const char *comanda) {
    pid_t pid = fork();

    if (pid == 0) {
        // Copilul: executa comanda
        if (strcmp(comanda, "salut") == 0) {
            printf("Salut din laborator!\n");
        } else if (strcmp(comanda, "data") == 0) {
            printf("1974\n");
        } else {
            printf("Comanda necunoscuta: %s\n", comanda);
        }
        fflush(stdout);   // scrie bufferul inainte sa iesim
        _exit(0);         // copilul iese
    } else {
        // Parintele: asteapta copilul
        wait(NULL);
        printf("Gata\n");
        fflush(stdout);   // la fel, golim bufferul aici
    }
}

int main(void) {
    ruleaza_comanda("salut");
    ruleaza_comanda("data");
    ruleaza_comanda("necunoscuta");
    return 0;
}
```

**\_exit(0)** este ca **return 0**, dar pentru procesele copil după **fork** — iese imediat, fără curățenie suplimentară care ar putea încurca părintele. Are însă un efect secundar: nu golește bufferul lui **printf**, așa că trebuie să chemăm **fflush(stdout)** noi înșine, chiar înainte de **\_exit**, ca textul să ajungă cu adevărat pe teletype

**wait(NULL)** îl blochează pe părinte până când copilul termină. Nu ne interesează codul de ieșire exact, doar faptul că a terminat

---

Părintele creează câte un copil pentru fiecare comandă, așteaptă să termine, apoi trece la următoarea. Exact așa funcționează un shell, simplificat. Fiecare comandă rulează în **izolare** — dacă un copil crapă, părintele supraviețuiește și merge mai departe

---

## Misiune: Terminalul de comenzi al laboratorului

Ești operator de noapte la centrul de calcul. Un teletype din laborator îți trimite, pe rând, comenzi de rulat. Fiecare comandă trebuie procesată de un proces copil separat, ca laboratorul să nu cadă dacă una dintre ele eșuează. Coada de comenzi se termină mereu cu cuvântul **"iesire"**

Scrie un program care

1. Citește cuvinte din input, unul câte unul, cu **scanf("%s", ...)**, într-o buclă
2. Dacă tocmai ai citit **"iesire"**, oprește bucla imediat, fără să mai apelezi **ruleaza_comanda**
3. Altfel, apelează **ruleaza_comanda** cu cuvântul citit. Procesul copil verifică șirul și afișează
   - **"ora"** afișează **"12:04"**
   - **"spatiu"** afișează **"128K liber"**
   - orice altă comandă afișează **"Comanda necunoscuta: X"**, unde **X** este comanda primită

   Nu uita **fflush(stdout)** înainte de **\_exit(0)**, altfel textul afișat de copil se pierde

4. Părintele așteaptă copilul cu **wait(NULL)**, afișează **"Gata"**, apoi golește el însuși bufferul cu **fflush(stdout)**

**Exemplu**

Intrare

```text
ora
spatiu
necunoscuta
iesire
```

Ieșire

```text
12:04
Gata
128K liber
Gata
Comanda necunoscuta: necunoscuta
Gata
```

**Exemplu**

Intrare

```text
spatiu
iesire
```

Ieșire

```text
128K liber
Gata
```
