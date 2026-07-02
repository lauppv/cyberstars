Bun venit la **C**.

C s-a născut în **1972**, la **Bell Labs**, unde Dennis Ritchie l-a creat ca să scrie sistemul de operare **UNIX**. Pe atunci nu existau monitoare colorate și mouse: programatorii lucrau la **teletype** — o mașinărie care arăta ca o mașină de scris și tipărea răspunsul calculatorului direct pe hârtie. Peste 50 de ani mai târziu, C e în continuare peste tot: în sistemele de operare, în routere, în sateliți și în motoarele altor limbaje de programare.

În acest curs vei lucra ca un programator de la începuturile UNIX-ului: aproape de mașină, cu control total asupra a ceea ce se întâmplă. Mergem pas cu pas.

---

Cel mai simplu program C arată așa

```c
#include <stdio.h>

int main(void) {
    printf("hello, world\n");
    return 0;
}
```

**Rulează**-l. Vei vedea

```text
hello, world
```

Apropo, `hello, world` nu e un mesaj oarecare: este **primul exemplu** din cartea clasică de C scrisă chiar de creatorii limbajului. Orice programator C a început exact cu acest program.

Există ceva boilerplate. Să trecem prin el pe scurt — deocamdată, **ai încredere** în el, vom înțelege mai multe pe parcurs

- **#include <stdio.h>** — spunem "am nevoie de instrumentele standard de input/output". Fără această linie, **printf** nu există
- **int main(void)** — orice program C începe de aici. Acesta este **punctul de intrare**
- **{ ... }** — **blocul** de cod pe care îl rulează **main**
- **return 0;** — îi spunem sistemului de operare "programul s-a încheiat cu succes". **0** înseamnă "totul în regulă"

Linia care face treaba propriu-zisă este

```c
printf("hello, world\n");
```

**printf** este felul în care C afișează text pe ecran. Vine de la **print formatted**

---

Observă acel **\n** ciudat de la finalul stringului. Ce este?

**\n** înseamnă **linie nouă**. **printf** nu trece automat pe o linie nouă după ce afișează: tipărește exact ce i-ai dat, caracter cu caracter, ca un teletype. Dacă vrei o linie nouă, trebuie să o ceri cu **\n**

```c
#include <stdio.h>

int main(void) {
    printf("Salut");
    printf("Lume");
    return 0;
}
```

Hai să urmărim ce se întâmplă:

1. primul **printf** tipărește `Salut` și cursorul rămâne imediat după litera `t`
2. al doilea **printf** tipărește `Lume` exact de acolo

```text
SalutLume
```

Lipite. Cu **\n**

```c
#include <stdio.h>

int main(void) {
    printf("Salut\n");
    printf("Lume\n");
    return 0;
}
```

Output

```text
Salut
Lume
```

Este un detaliu mic, dar important.

---

Două reguli de ținut minte

- Textul merge între **ghilimele duble** **""**
- Fiecare instrucțiune se termină cu un **punct și virgulă** **;**

Încearcă să elimini **;** și rulează codul. Citește eroarea de compilare — compilatorul de C îți spune mereu exact pe ce linie s-a supărat.

---

## Misiune: Prima ta zi la laborator

E prima ta zi la laboratorul de calcul. Teletype-ul zumzăie, rola de hârtie e pusă, iar colegii așteaptă să vadă dacă noul programator știe tradiția.

În interiorul lui **main**, scrie un singur **printf** care tipărește mesajul de mai jos.

**Exemplu**

Programul tău ar trebui să afișeze

```text
hello, world
```

Nu uita de **\n** la finalul stringului.
