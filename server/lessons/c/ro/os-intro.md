Intrăm pe un teritoriu nou. Până acum am scris cod care **face lucruri**: afișează, calculează, sortează. Acum vom înțelege **cum rulează computerul codul nostru**. Bun venit la **sisteme de operare**

Un **sistem de operare** (OS) este software-ul care gestionează tot: RAM-ul, hard disk-ul, ecranul, tastatura. Windows, Linux, macOS — toate sunt sisteme de operare. Fără unul, computerul tău este doar un presa-papier scump

---

Când rulezi un program C, sistemul de operare creează un **proces**. Un proces este o **instanță a unui program în execuție**. Are propriile sale:

- **Cod** — instrucțiunile (codul tău C compilat)
- **Memorie** — stiva, heap-ul, variabilele globale
- **Stare** — rulează? așteaptă? a terminat?

Chiar acum, sute de procese rulează pe computerul tău: browser-ul, player-ul de muzică, sistemul de operare însuși. Fiecare crede că are computerul doar pentru el, dar sistemul de operare le jonglează pe toate

```c
#include <stdio.h>
#include <unistd.h>

int main(void) {
    printf("ID-ul procesului meu este: %d\n", getpid());
    printf("ID-ul procesului parinte este: %d\n", getppid());
    return 0;
}
```

Fiecare proces are un **PID** unic (Process ID). **getpid()** îl returnează pe al nostru. **getppid()** returnează PID-ul părintelui — procesul care ne-a lansat (de obicei terminalul/shell-ul)

---

**Aranjamentul memoriei** unui proces arată așa:

```text
Adrese mari
+--------------+
|    Stiva     |  <- variabile locale, apeluri de functii (creste in JOS)
|      v       |
|              |
|      ^       |
|    Heap      |  <- malloc, memorie dinamica (creste in SUS)
+--------------+
|    Date      |  <- variabile globale/statice
+--------------+
|    Cod       |  <- instructiunile tale compilate
+--------------+
Adrese mici
```

Îți amintești de **malloc**? Acum știi de unde vine acea memorie — din **heap**. Iar variabilele tale locale? Trăiesc pe **stivă**. Când primești o eroare "stack overflow", înseamnă că stiva a crescut prea mult (de obicei dintr-o recursivitate infinită)

---

Procesele pot fi în diferite **stări**:

- **Running** — rulează în prezent pe CPU
- **Ready** — așteaptă rândul pe CPU
- **Waiting** — blocat, așteaptă ceva (input de la tastatură, citire de fișier, rețea)
- **Terminated** — a terminat execuția

Sistemul de operare comută între procese de mii de ori pe secundă. Asta se numește **context switching**. Așa poți asculta muzică ȘI naviga pe web "în același timp" — sistemul de operare alternează de fapt rapid între ele

---

Un alt concept important: **codurile de ieșire**. Când **main** returnează un număr, acela este **codul de ieșire** al procesului

```c
#include <stdio.h>

int main(void) {
    return 0;   // 0 inseamna succes
}
```

**return 0** înseamnă "totul a mers bine". Orice valoare diferită de zero înseamnă o eroare. Într-un terminal, poți verifica codul de ieșire al ultimei comenzi cu **echo $?**. De asta am tot scris **return 0** în main de la început — acum știi motivul real.

---

## Misiune: Jurnalul de tură

E ora opt dimineața la centrul de calcul Bell Labs. Înainte să înceapă lucrul, fiecare terminal conectat la mainframe trebuie să-și înregistreze procesul în jurnalul de tură al operatorului.

1. Afișează ID-ul procesului curent folosind **getpid()**
2. Afișează un mesaj care confirmă codul de ieșire

**Exemplu**

Programul tău ar trebui să afișeze (PID-ul tău va fi diferit — asta este de așteptat)

```text
PID: 12345
Iesire cu codul 0
```

Folosește **getpid()** din **unistd.h**
