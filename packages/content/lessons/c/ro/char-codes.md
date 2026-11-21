În calculator, un char e un număr mic. Fiecare literă, cifră și semn are codul său, dintr-un tabel numit **ASCII**. Când scriem `'A'`, C îl citește ca numărul 65

```c
#include <stdio.h>

int main(void) {
    char c = 'A';
    printf("%c\n", c);
    printf("%d\n", c);
    return 0;
}
```

Ieșire

```text
A
65
```

Aceeași valoare, afișată în două feluri. **%c** arată caracterul, **%d** arată codul lui

---

Câteva coduri bune de știut

```text
'0' .. '9'   48 .. 57
'A' .. 'Z'   65 .. 90
'a' .. 'z'   97 .. 122
' '          32
```

Literele vin în ordine, la fel și cifrele. De asta merg trucurile de mai jos. Nu trebuie să învățăm numerele pe de rost: C face calculul pentru noi când scriem chiar caracterele

---

Fiindcă un char e un număr, putem aduna la el. Litera de după `'A'` e `'A' + 1`

```c
#include <stdio.h>

int main(void) {
    for (char c = 'A'; c <= 'E'; c++) {
        printf("%c", c);
    }
    printf("\n");
    return 0;
}
```

Ieșire

```text
ABCDE
```

---

Literele mici și cele mari sunt mereu la aceeași distanță: `'a' - 'A'` e 32. Ca să facem dintr-o literă mică una mare, scădem distanța

```c
#include <stdio.h>

int main(void) {
    char c = 'g';
    char mare = c - ('a' - 'A');
    printf("%c\n", mare);
    return 0;
}
```

Ieșire

```text
G
```

Dar doar pentru litere mici. Un spațiu sau o cifră s-ar face altceva, ciudat. Așa că întâi verificăm că c e între `'a'` și `'z'`

```c
#include <stdio.h>

int main(void) {
    char c = '7';
    if (c >= 'a' && c <= 'z') {
        c = c - ('a' - 'A');
    }
    printf("%c\n", c);
    return 0;
}
```

Ieșire

```text
7
```

---

Un caracter-cifră nu e numărul pe care îl arată. `'7'` e codul 55, nu 7. Ca să obținem numărul, scădem codul lui `'0'`

```c
#include <stdio.h>

int main(void) {
    char d = '7';
    int valoare = d - '0';
    printf("%d\n", valoare * 2);
    return 0;
}
```

Ieșire

```text
14
```

`'7' - '0'` e 55 - 48, adică 7. Merge pentru orice cifră, pentru că cifrele stau una lângă alta în tabel

---

Dacă le punem cap la cap, putem parcurge un șir caracter cu caracter, până la `'\0'` de la final

```c
#include <stdio.h>

int main(void) {
    char cuvant[] = "Unix 1969";
    int cifre = 0;
    for (int i = 0; cuvant[i] != '\0'; i++) {
        if (cuvant[i] >= '0' && cuvant[i] <= '9') {
            cifre++;
        }
    }
    printf("%d cifre\n", cifre);
    return 0;
}
```

Ieșire

```text
4 cifre
```

---

## Misiune: Teleimprimanta care strigă

Teleimprimanta veche din colț poate tipări doar litere mari. Înainte ca un mesaj să ajungă la ea, un program trebuie să facă din fiecare literă mică una mare. Operatorul vrea și o verificare rapidă a numerelor din mesaj: suma tuturor cifrelor lui

1. Citește o linie de text cu fgets. Poate avea spații, cifre și semne
2. Afișează linia din nou, cu fiecare literă mică de la a la z făcută literă mare. Restul rămâne la fel
3. Afișează suma tuturor cifrelor din linie, ca în exemplu. O linie fără cifre are suma 0
4. Fă calculul singur, cu codurile caracterelor, fără toupper sau alte funcții din ctype.h

Linia are cel mult 100 de caractere

**Exemplu**

Intrare

```text
tape 42 on drive 7
```

Ieșire

```text
TAPE 42 ON DRIVE 7
Suma cifrelor: 13
```

**Exemplu**

Intrare

```text
Hello, Bell Labs!
```

Ieșire

```text
HELLO, BELL LABS!
Suma cifrelor: 0
```
