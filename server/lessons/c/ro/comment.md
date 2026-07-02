**Comentariile** sunt bucăți de text din codul nostru pe care compilatorul le **ignoră**. Le folosim ca să **explicăm** codul sau ca să **dezactivăm** linii fără să le ștergem

În C, un comentariu pe o singură linie începe cu **//**

```c
#include <stdio.h>

int main(void) {
    // acesta este un comentariu
    int a = 1 + 2 + 3;
    printf("%d\n", a);   // afiseaza variabila a
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

## Misiune: Jurnalul de sistem

Sistemul afișează un jurnal de pornire pe teleimprimator, dar una dintre linii conține un cod de acces intern care nu are voie să ajungă în jurnalul public.

- Scrie patru apeluri **printf**, în ordine, care afișează: `PDP-11`, `Bell Labs Computing Center`, `ACCES-7734-SECRET` și numărul `1972`
- Comentează al treilea apel **printf** (cel cu codul de acces), astfel încât linia lui să nu mai apară în output

**Exemplu**

Programul tău ar trebui să afișeze

```text
PDP-11
Bell Labs Computing Center
1972
```

Nu șterge nimic — doar **comentează** linia pe care nu vrei să o rulezi.
