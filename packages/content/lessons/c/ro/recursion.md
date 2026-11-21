O funcție poate apela alte funcții. Poate să se apeleze și pe ea însăși. Asta se numește **recursivitate** și e un fel de a rezolva o problemă mare rezolvând o copie mai mică a aceleiași probleme

```c
#include <stdio.h>

void numaratoare(int n) {
    if (n == 0) {
        printf("Lansare\n");
        return;
    }
    printf("%d\n", n);
    numaratoare(n - 1);
}

int main(void) {
    numaratoare(3);
    return 0;
}
```

Ieșire

```text
3
2
1
Lansare
```

numaratoare(3) afișează 3, apoi îi cere lui numaratoare(2) să facă restul. Aceea afișează 2 și o cheamă pe numaratoare(1), și tot așa, până când numaratoare(0) afișează Lansare și se oprește

---

Orice funcție recursivă are nevoie de două părți

1. Un **caz de bază**: o problemă mică, la care avem răspunsul pe loc, fără alte apeluri. Aici, n == 0
2. Un **pas recursiv**: un apel către ea însăși, pe o problemă puțin mai mică. Aici, n - 1

Fiecare apel trebuie să se apropie de cazul de bază. Dacă nu se apropie, apelurile nu se mai termină

---

Un clasic: factorialul. 5! e 5 × 4 × 3 × 2 × 1. Dacă te uiți mai atent, 5! e doar 5 × 4!

```c
#include <stdio.h>

int factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

int main(void) {
    printf("%d\n", factorial(5));
    return 0;
}
```

Ieșire

```text
120
```

factorial(5) o așteaptă pe factorial(4), care o așteaptă pe factorial(3), până jos la factorial(1), care întoarce 1. Apoi răspunsurile urcă înapoi: 1, 2, 6, 24, 120

---

Unde stau toate apelurile care așteaptă? Pe stivă. Fiecare apel primește acolo o cutiuță a lui, un cadru de stivă (stack frame), cu propria copie a lui n. factorial(5) și factorial(4) au fiecare n-ul lor și nu se amestecă

Când un apel se termină, cadrul lui e aruncat. Dacă lipsește cazul de bază, cadrele se adună până se umple stiva și programul se oprește cu un stack overflow. Pe Linux îl vedem ca „Segmentation fault”

---

Ordinea liniilor contează. Codul dinaintea apelului recursiv rulează la coborâre. Codul de după el rulează la urcare

```c
#include <stdio.h>

void cifre(int n) {
    if (n < 10) {
        printf("%d\n", n);
        return;
    }
    cifre(n / 10);
    printf("%d\n", n % 10);
}

int main(void) {
    cifre(472);
    return 0;
}
```

Ieșire

```text
4
7
2
```

n % 10 e ultima cifră, iar n / 10 e tot ce e înaintea ei. Pentru că afișăm după apel, primele cifre ies primele. Mută printf-ul deasupra apelului și cifrele ies invers

---

## Misiune: Panoul cu becuri

Pe fața mainframe-ului vechi e un rând de becuri. Un bec aprins înseamnă 1, un bec stins înseamnă 0, deci panoul arată numerele în binar. Tehnicienii vor un program care să le spună ce becuri aprinde un număr

Ca să obții cifrele binare ale lui n, împarte-l la 2 iar și iar. n % 2 e ultima cifră binară, iar n / 2 ține toate cifrele dinaintea ei. E aceeași idee ca în exemplul cu cifrele, cu 2 în loc de 10

1. Scrie o funcție recursivă **void afiseaza_binar(int n)** care afișează n în binar, fără spații și fără linie nouă
2. Scrie o funcție recursivă **int numara_unu(int n)** care întoarce câți de 1 are n în binar
3. Citește un număr întreg n de la input și afișează cele două rezultate, ca în exemplu
4. Folosește recursivitatea, nu bucle: în acest program nu există bucle for, while sau do-while

n e între 0 și 1000000. Numărul 0 e pur și simplu „0” în binar

**Exemplu**

Intrare

```text
13
```

Ieșire

```text
Binar: 1101
Unu: 3
```

**Exemplu**

Intrare

```text
0
```

Ieșire

```text
Binar: 0
Unu: 0
```
