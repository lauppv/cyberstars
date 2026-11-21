Des, un if/else doar alege una din două valori

```c
#include <stdio.h>

int main(void) {
    int temp = 35;
    int ventilator;
    if (temp > 30) {
        ventilator = 1;
    } else {
        ventilator = 0;
    }
    printf("Ventilator: %d\n", ventilator);
    return 0;
}
```

Șapte linii ca să alegem între 1 și 0. C are o cale mai scurtă: **operatorul ternar**

---

```c
#include <stdio.h>

int main(void) {
    int temp = 35;
    int ventilator = temp > 30 ? 1 : 0;
    printf("Ventilator: %d\n", ventilator);
    return 0;
}
```

Ieșire

```text
Ventilator: 1
```

Citește `temp > 30 ? 1 : 0` ca pe o întrebare: „e temp peste 30? Dacă da, 1. Dacă nu, 0”. Are trei părți, condiția, valoarea pentru da și valoarea pentru nu, de aceea se numește ternar, de la cuvântul latinesc pentru „trei”

```text
conditie ? valoare_daca_da : valoare_daca_nu
```

---

Operatorul ternar dă înapoi o valoare, deci îl putem folosi oriunde încape o valoare. Chiar și în printf, și chiar cu șiruri de caractere

```c
#include <stdio.h>

int main(void) {
    int erori = 1;
    printf("%d %s\n", erori, erori == 1 ? "eroare gasita" : "erori gasite");

    erori = 4;
    printf("%d %s\n", erori, erori == 1 ? "eroare gasita" : "erori gasite");
    return 0;
}
```

Ieșire

```text
1 eroare gasita
4 erori gasite
```

Cuvintele potrivite, alese chiar acolo unde afișăm. Cu if/else, ne-ar trebui două linii printf întregi

---

Cel mai mare din două numere încape tot pe o linie

```c
#include <stdio.h>

int main(void) {
    int a = 12;
    int b = 40;
    int maxim = a > b ? a : b;
    printf("%d\n", maxim);
    return 0;
}
```

Ieșire

```text
40
```

---

Folosește operatorul ternar pentru o alegere scurtă între două valori. Când fiecare parte are mai multe de făcut, sau când sunt trei cazuri sau mai multe, un if/else se citește mai ușor. Putem pune un ternar în alt ternar, dar după două niveluri nu mai înțelege nimeni, nici măcar noi peste o săptămână

---

## Misiune: Raportul sălii de benzi

În fiecare oră, sala de benzi trimite un raport scurt șefului de tură. Spune câte role de bandă sunt încărcate și dacă în sală e prea cald pentru mașini

1. Citește două numere întregi de la input: numărul de role, apoi temperatura în grade
2. Afișează prima linie cu numărul de role. Scrie „rola incarcata” pentru exact 1 rolă și „role incarcate” pentru orice alt număr, inclusiv 0
3. Afișează a doua linie: „Sala: cald” când temperatura trece de 30, altfel „Sala: OK”
4. Alege ambele texte cu operatorul ternar. Nu folosi if sau switch în acest program

**Exemplu**

Intrare

```text
3 34
```

Ieșire

```text
3 role incarcate
Sala: cald
```

**Exemplu**

Intrare

```text
1 30
```

Ieșire

```text
1 rola incarcata
Sala: OK
```
