Bun venit la **C**. C este **fundația** programării moderne. Aproape orice limbaj de care ai auzit (Python, Java, JavaScript, Go, Rust, chiar și sistemul tău de operare) este construit deasupra ideilor, sau chiar deasupra codului, scrise în C

C este **mai low-level** decât Python sau Java. Asta înseamnă că ne dă mai mult **control** asupra a ceea ce face calculatorul, dar ne și cere să fim mai **atenți**. Nu-ți face griji, mergem pas cu pas :)

---

Cel mai simplu program C arată așa

```c
#include <stdio.h>

int main(void) {
    printf("salut, îmi place pizza\n");
    return 0;
}
```

**Rulează**-l. Vei vedea

```text
salut, îmi place pizza
```

Există ceva boilerplate. Să trecem prin el pe scurt — deocamdată, **ai încredere** în el, vom înțelege mai multe pe parcurs

- **#include <stdio.h>** — spunem "am nevoie de instrumentele standard de input/output". Fără această linie, **printf** nu există
- **int main(void)** — orice program C începe de aici. Acesta este **punctul de intrare**
- **{ ... }** — **blocul** de cod pe care îl rulează **main**. Exact ca în Java
- **return 0;** — îi spunem sistemului de operare "programul s-a încheiat cu succes". **0** înseamnă "totul în regulă"

Linia care face treaba propriu-zisă este

```c
printf("salut, îmi place pizza\n");
```

**printf** este felul în care C afișează text pe ecran. Vine de la **print formatted**

---

Observă acel **\n** ciudat de la finalul stringului. Ce este?

**\n** înseamnă **linie nouă**. Spre deosebire de **print()** din Python și **System.out.println** din Java, **printf** din C **NU** trece automat pe o linie nouă. Dacă vrei o linie nouă, trebuie să o ceri cu **\n**

```c
#include <stdio.h>

int main(void) {
    printf("Salut");
    printf("Lume");
    return 0;
}
```

Output

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

Este un detaliu mic, dar important. Uită **\n** pe propriul risc :)

---

Câteva mici reamintiri, exact ca în Java

- Textul merge între **ghilimele duble** **""**
- Fiecare instrucțiune se termină cu un **punct și virgulă** **;**

Încearcă să elimini **;** și rulează codul. Citește eroarea de compilare :)

---

## Misiune: Prima Transmisie

Tocmai te-ai îmbarcat pe stația spațială CyberStars și consola de comunicații așteaptă prima ta transmisie.

În interiorul lui **main**, scrie un singur **printf** care transmite mesajul de mai jos către Centrul de Control.

**Exemplu**

Programul tău ar trebui să afișeze

```text
Salut, CyberStars!
```

Nu uita de **\n** la finalul stringului :)
