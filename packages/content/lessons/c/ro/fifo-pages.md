RAM-ul are un număr limitat de cadre. Când apare o eroare de pagină și toate cadrele sunt pline, kernelul trebuie să dea afară o pagină ca să facă loc: e scrisă înapoi pe disc dacă s-a schimbat, iar cadrul ei primește pagina nouă. Ce pagină să plece? Regula e un **algoritm de înlocuire a paginilor**, iar unul bun produce puține erori de pagină

Le studiem cu un **șir de referințe**: lista paginilor pe care le atinge un program, în ordine. Și numărăm erorile pentru un număr dat de cadre

---

Cea mai simplă regulă e **FIFO**: dă afară pagina care a intrat prima, pe cea mai veche. Ținem cadrele ca locuri și un indicator spre locul paginii celei mai vechi. O pagină nouă intră mereu în acel loc, iar indicatorul trece la locul următor, în cerc

Cu 3 cadre și paginile 7 0 1 2 0 3

```text
7: 7 - - eroare
0: 7 0 - eroare
1: 7 0 1 eroare
2: 2 0 1 eroare
0: 2 0 1 gasit
3: 2 3 1 eroare
```

Un `-` e un cadru gol. Când vine 2, toate cadrele sunt pline, iar 7 e cea mai veche, deci 2 îi ia locul. 0 e deja în memorie: e **găsită** (hit), nu se schimbă nimic. Apoi 3 îl înlocuiește pe 0, cea mai veche dintre cele rămase

---

E simplu, dar nu-i pasă dacă o pagină mai e folosită. O pagină veche ar putea fi cea mai căutată. FIFO are chiar și o ciudățenie celebră, **anomalia lui Belady**: dacă îi dai mai multe cadre, poate produce **mai multe** erori

```c
#include <stdio.h>

int erori_fifo(int ref[], int n, int cadre) {
    int loc[8];
    int folosite = 0;
    int cel_mai_vechi = 0;
    int erori = 0;
    for (int i = 0; i < n; i++) {
        int gasit = 0;
        for (int s = 0; s < folosite; s++) {
            if (loc[s] == ref[i]) {
                gasit = 1;
            }
        }
        if (gasit) {
            continue;
        }
        erori++;
        if (folosite < cadre) {
            loc[folosite] = ref[i];
            folosite++;
        } else {
            loc[cel_mai_vechi] = ref[i];
            cel_mai_vechi = (cel_mai_vechi + 1) % cadre;
        }
    }
    return erori;
}

int main(void) {
    int ref[] = { 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5 };
    printf("3 cadre: %d erori\n", erori_fifo(ref, 12, 3));
    printf("4 cadre: %d erori\n", erori_fifo(ref, 12, 4));
    return 0;
}
```

Ieșire

```text
3 cadre: 9 erori
4 cadre: 10 erori
```

Un cadru în plus, o eroare în plus. Algoritmii care se uită la cum sunt folosite paginile, ca cel din lecția următoare, nu fac niciodată asta

---

## Misiune: Înlocuirea FIFO

Simulează înlocuirea paginilor cu FIFO și arată ce e în memorie după fiecare acces

1. Citește numărul de cadre F, apoi numere de pagini până se termină datele
2. Pentru fiecare pagină, afișează pagina, conținutul cadrelor în ordinea locurilor, cu `-` pentru unul gol, și `eroare` sau `gasit`, ca în exemplu
3. Cât timp sunt cadre goale, o pagină nouă îl ia pe primul gol. După aceea, ia locul paginii celei mai vechi
4. La final, afișează numărul de erori și de găsiri

F e între 1 și 7. Paginile sunt între 0 și 99, și sunt între 1 și 200

**Exemplu**

Intrare

```text
3
7 0 1 2 0 3 0 4
```

Ieșire

```text
7: 7 - - eroare
0: 7 0 - eroare
1: 7 0 1 eroare
2: 2 0 1 eroare
0: 2 0 1 gasit
3: 2 3 1 eroare
0: 2 3 0 eroare
4: 4 3 0 eroare
Erori: 7, gasite: 1
```
