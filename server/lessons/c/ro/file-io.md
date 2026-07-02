Programele trebuie să citească și să scrie în **fișiere** — configurări, jurnale de tură, date salvate. C ne oferă **fopen**, **fclose**, **fprintf**, **fscanf** și **fgets** pentru asta

```c
#include <stdio.h>

int main(void) {
    FILE *f = fopen("salut.txt", "w");
    if (f == NULL) {
        printf("Nu s-a putut deschide fisierul\n");
        return 1;
    }

    fprintf(f, "Salut de la terminal\n");
    fprintf(f, "Aceasta este linia 2\n");
    fclose(f);

    printf("Fisier scris!\n");
    return 0;
}
```

**fopen** deschide un fișier și returnează un **pointer FILE**. Al doilea argument este **modul**:

- **"w"** — scriere (creează fișierul sau îl **suprascrie** dacă există)
- **"r"** — citire (fișierul trebuie să existe)
- **"a"** — adăugare (adaugă la sfârșit, nu șterge)

**fprintf** funcționează exact ca **printf**, dar scrie într-un fișier în loc de pe ecran. **fclose** închide fișierul — fă mereu asta, altfel datele s-ar putea să nu fie salvate

---

Citirea dintr-un fișier

```c
#include <stdio.h>

int main(void) {
    FILE *f = fopen("salut.txt", "r");
    if (f == NULL) {
        printf("Fisier inexistent\n");
        return 1;
    }

    char linie[100];
    while (fgets(linie, 100, f) != NULL) {
        printf("%s", linie);
    }

    fclose(f);
    return 0;
}
```

**fgets(linie, 100, f)** citește o linie (până la 99 de caractere + '\0') din fișier în array-ul **linie**. Returnează **NULL** când nu mai sunt linii. Bucla while citește întregul fișier, linie cu linie

---

Putem folosi și **fscanf** pentru date structurate

```c
#include <stdio.h>

int main(void) {
    FILE *f = fopen("jurnal.txt", "r");
    char nume[50];
    int cod;

    while (fscanf(f, "%s %d", nume, &cod) == 2) {
        printf("%s a raportat codul %d\n", nume, cod);
    }
    fclose(f);
    return 0;
}
```

**fscanf** returnează numărul de elemente pe care le-a citit cu succes. Când așteptăm 2 elemente (nume și cod), verificăm **== 2**

---

Tiparul pentru operații sigure pe fișiere este mereu același:

1. **fopen** — deschide fișierul
2. **Verifică pentru NULL** — tratează eroarea
3. **Citește sau scrie** — fă-ți treaba
4. **fclose** — închide fișierul

A uita de **fclose** este ca și cum ai lăsa robinetul deschis. Programul ar putea funcționa o vreme, dar în cele din urmă vei rămâne fără descriptori de fișiere (o resursă limitată a sistemului de operare)

---

## Misiune: Registrul de tură al centrului de calcul

Centrul de calcul ține un registru al fiecărei ture: numele tehnicianului de serviciu și numărul de incidente pe care le-a rezolvat. La finalul turei, registrul trebuie scris pe disc, apoi citit înapoi pentru raportul de dimineață.

1. Deschide un fișier **"tura.txt"** pentru **scriere**
2. Scrie aceste 3 linii cu **fprintf**: `Enescu 95`, `Vlad 82`, `Dobre 98` (nume și număr de incidente, separate prin spațiu)
3. Închide fișierul
4. Deschide **"tura.txt"** pentru **citire**
5. Citește fiecare nume și număr folosind **fscanf** și afișează-le ca: **"Tehnician: Enescu, Incidente: 95"**
6. Închide fișierul

**Exemplu**

Programul tău ar trebui să afișeze

```text
Tehnician: Enescu, Incidente: 95
Tehnician: Vlad, Incidente: 82
Tehnician: Dobre, Incidente: 98
```
