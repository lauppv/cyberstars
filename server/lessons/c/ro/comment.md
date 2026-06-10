**Comentariile** sunt bucăți de text din codul nostru pe care compilatorul le **ignoră**. Le folosim ca să **explicăm** codul sau ca să **dezactivăm** linii fără să le ștergem

În C, un comentariu pe o singură linie începe cu **//**

```c
#include <stdio.h>

int main(void) {
    // acesta este un comentariu
    int a = 1 + 2 + 3;
    printf("%d\n", a);   // afișează variabila a
    return 0;
}
```

Tot ce vine după **//** pe o linie este ignorat. Programul rulează ca și cum acele bucăți nici n-ar exista

---

Comentariile sunt grozave pentru a **dezactiva temporar** cod

```c
#include <stdio.h>

int main(void) {
    int a = 1 + 2 + 3;
    // printf("%d\n", a);
    return 0;
}
```

Acum nu se mai afișează nimic, pentru că **printf**-ul este **comentat**. Foarte util când depanezi — în loc să ștergi codul și să-l rescrii mai târziu, doar îl comentezi

---

Pentru comentarii mai lungi care se întind pe mai multe linii, C are și **/\* ... \*/**

```c
#include <stdio.h>

int main(void) {
    /*
    Acesta este un
    comentariu pe
    mai multe linii
    */
    printf("Salut\n");
    return 0;
}
```

În codul C vechi (înainte de C99), exista doar **/\* \*/**. **//** a fost adăugat mai târziu, copiat din C++. Astăzi ambele funcționează. Majoritatea codului modern folosește **//**

---

## Misiune: Marfă Clasificată

Manifestul de marfă al stației este afișat pe ecran, dar o linie conține **informații clasificate** care nu au voie să apară în jurnalul public.

Comentează linia care afișează codul secret, astfel încât doar înregistrările aprobate să fie transmise.

**Exemplu**

Programul tău ar trebui să afișeze

```text
Voyager
Deep Space Exploration
9001
```

Nu șterge nimic — doar **comentează** linia pe care nu vrei să o rulezi :)
