Programele trebuie să citească și să scrie în **fișiere** — configurări, log-uri, date salvate. C ne oferă **fopen**, **fclose**, **fprintf**, **fscanf** și **fgets** pentru asta

```c
#include <stdio.h>

int main(void) {
    FILE *f = fopen("salut.txt", "w");
    if (f == NULL) {
        printf("Nu s-a putut deschide fisierul\n");
        return 1;
    }

    fprintf(f, "Salut, CyberStars!\n");
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
    FILE *f = fopen("scoruri.txt", "r");
    char nume[50];
    int scor;

    while (fscanf(f, "%s %d", nume, &scor) == 2) {
        printf("%s a obtinut %d puncte\n", nume, scor);
    }
    fclose(f);
    return 0;
}
```

**fscanf** returnează numărul de elemente pe care le-a citit cu succes. Când așteptăm 2 elemente (nume și scor), verificăm **== 2**

---

Tiparul pentru operații sigure pe fișiere este mereu același:

1. **fopen** — deschide fișierul
2. **Verifică pentru NULL** — tratează eroarea
3. **Citește sau scrie** — fă-ți treaba
4. **fclose** — închide fișierul

A uita de **fclose** este ca și cum ai lăsa robinetul deschis. Programul ar putea funcționa o vreme, dar în cele din urmă vei rămâne fără descriptori de fișiere (o resursă limitată a sistemului de operare)

---

## Misiune: Arhiva Jurnalului Echipajului

Stația are nevoie de un jurnal permanent al echipajului. Scrie numele și scorurile membrilor echipajului într-un fișier, apoi citește înapoi fișierul și afișează un raport formatat pentru căpitan.

1. Deschide un fișier **"grades.txt"** pentru **scriere**
2. Scrie aceste 3 linii (folosește **fprintf**):

```text
Tommy 95
Lance 82
Cortez 98
```

3. Închide fișierul
4. Deschide **"grades.txt"** pentru **citire**
5. Citește fiecare nume și notă folosind **fscanf** și afișează-le ca: **"Name: Tommy, Grade: 95"**
6. Închide fișierul

**Exemplu**

Programul tău ar trebui să afișeze

```text
Name: Tommy, Grade: 95
Name: Lance, Grade: 82
Name: Cortez, Grade: 98
```
