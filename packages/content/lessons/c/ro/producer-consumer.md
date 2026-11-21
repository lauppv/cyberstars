Una dintre cele mai obișnuite forme de programe concurente: un thread **produce** obiecte, altul le **consumă**, iar între ele e un mic buffer comun, cu loc pentru câteva obiecte. Gândește-te la o bandă rulantă între doi muncitori. Un server web care citește cereri și un lucrător care le răspunde, un program care citește un fișier și altul care îl comprimă: toate arată așa

Două reguli îl țin în funcțiune

1. Producătorul trebuie să aștepte când bufferul e **plin**
2. Consumatorul trebuie să aștepte când bufferul e **gol**

---

Bufferul e un array folosit în cerc: un **buffer circular** (ring buffer). Ținem minte unde intră următorul obiect, de unde iese următorul obiect și câte obiecte sunt înăuntru. Când un indice ajunge la capătul array-ului, se întoarce la 0, cu %

```c
#include <stdio.h>

#define MARIME 4
int buffer[MARIME];
int intra = 0, iese = 0, numar = 0;

void pune(int obiect) {
    buffer[intra] = obiect;
    intra = (intra + 1) % MARIME;
    numar++;
}

int ia(void) {
    int obiect = buffer[iese];
    iese = (iese + 1) % MARIME;
    numar--;
    return obiect;
}

int main(void) {
    for (int i = 1; i <= 3; i++) {
        pune(i);
    }
    printf("%d\n", ia());
    printf("%d\n", ia());

    // 4, 5 și 6 trec de capătul array-ului, înapoi la 0
    for (int i = 4; i <= 6; i++) {
        pune(i);
    }
    while (numar > 0) {
        printf("%d\n", ia());
    }
    return 0;
}
```

Ieșire

```text
1
2
3
4
5
6
```

---

Toate astea sunt comune, deci un mutex le apără. Iar cele două feluri de așteptare au nevoie de două variabile de condiție: una pentru „acum e loc”, una pentru „acum e un obiect”

```text
pthread_mutex_lock(&lacat);
while (numar == MARIME) {
    pthread_cond_wait(&nu_e_plin, &lacat);
}
// punem obiectul
pthread_cond_signal(&nu_e_gol);
pthread_mutex_unlock(&lacat);
```

Consumatorul e imaginea în oglindă: așteaptă cât timp numar e 0, ia un obiect și semnalează nu_e_plin

---

Cum știe consumatorul când să se oprească? O cale simplă e un obiect special care înseamnă „asta e tot”, numit de obicei **santinelă** (sentinel). Producătorul îl pune ultimul. Când consumatorul îl ia, se oprește, fără să-l trateze ca pe un obiect adevărat

---

Ieșirea unui astfel de program e tot previzibilă, chiar cu două thread-uri: bufferul e „primul intrat, primul ieșit”, deci consumatorul primește obiectele în ordinea în care au fost produse. De la o rulare la alta se schimbă doar cât de plin e bufferul în fiecare moment, iar asta nu se vede niciodată în ce afișează consumatorul

---

## Misiune: Banda rulantă

Piesele ies din presă și merg pe o bandă rulantă scurtă spre stația de ambalare. Banda ține doar câteva piese deodată. Presa e un thread, ambalatorul e altul

1. Citește B, locul de pe bandă, apoi numere întregi până se termină datele: greutățile pieselor. Fiecare greutate e mai mare decât 0
2. Fă un buffer circular cu B locuri, cu un mutex și două variabile de condiție
3. Pornește un thread producător care pune fiecare greutate pe bandă, în ordine, așteptând cât timp banda e plină. La final pune pe bandă un 0, santinela
4. Pornește un thread consumator care ia piese de pe bandă, așteptând cât timp e goală. Pentru fiecare piesă adevărată afișează `ambalat` și greutatea. Când ia 0-ul, se oprește
5. main așteaptă ambele thread-uri, apoi afișează greutatea totală ambalată

B e între 1 și 5, iar piesele sunt între 1 și 1000

**Exemplu**

Intrare

```text
2
5 3 8 1
```

Ieșire

```text
ambalat 5
ambalat 3
ambalat 8
ambalat 1
Total: 17
```
