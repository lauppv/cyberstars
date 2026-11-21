Programele noastre afișează, citesc date, deschid fișiere. Dar un program nu are voie să atingă singur ecranul sau discul. Doar miezul sistemului de operare, **kernelul**, poate face asta. Dacă orice program ar putea scrie oriunde pe disc, un singur program cu bug-uri ar putea șterge fișierele tuturor

Așa că, atunci când un program are nevoie de ceva de la hardware, îl roagă pe kernel. Cererea aceasta e un **apel de sistem** (system call). Programul se oprește, kernelul face treaba cu toate puterile, apoi îi dă înapoi rezultatul

---

printf și scanf sunt funcții de bibliotecă prietenoase. Dedesubt, și ele ajung să facă apeluri de sistem. Cele mai de bază două sunt **write** și **read**, din unistd.h

```c
#include <unistd.h>

int main(void) {
    write(1, "Salut de la kernel\n", 19);
    return 0;
}
```

Ieșire

```text
Salut de la kernel
```

write primește trei lucruri: unde să scrie, ce să scrie și câți bytes. Nu se oprește la un `'\0'` și nu înțelege %d. Copiază pur și simplu exact atâția bytes

---

Primul număr, 1, e un **descriptor de fișier** (file descriptor): un număr mic pe care kernelul i-l dă unui proces pentru fiecare lucru din care poate citi sau în care poate scrie. Fiecare proces pornește cu trei astfel de numere deja deschise

```text
0   intrarea standard   (stdin, tastatura sau caseta de input)
1   ieșirea standard    (stdout, ecranul)
2   eroarea standard    (stderr, pentru mesaje de eroare)
```

Când deschidem un fișier, primește următorul număr liber, de obicei 3. Pentru kernel, ecranul, un fișier și un pipe arată la fel: un număr din care putem citi sau în care putem scrie

---

read e cealaltă parte. Citește cel mult câți bytes îi cerem, într-un buffer, și **întoarce câți a citit de fapt**. Pot fi mai puțini decât am cerut, iar la sfârșitul datelor întoarce **0**

```c
#include <unistd.h>

int main(void) {
    char buf[8];
    ssize_t n;
    while ((n = read(0, buf, sizeof(buf))) > 0) {
        write(1, buf, n);
    }
    return 0;
}
```

Intrare

```text
copiaza-ma te rog
```

Ieșire

```text
copiaza-ma te rog
```

Programul acesta își copiază intrarea în ieșire, câte 8 bytes o dată, până când read întoarce 0. Observă că scriem n bytes, nu 8: ultima bucată e de multe ori mai scurtă. read nu adaugă un `'\0'`, deci buf nu e un șir și nu-l putem afișa cu %s

ssize_t e un tip pentru mărimi care poate fi și -1. read întoarce -1 când ceva merge prost. Vom vedea într-o lecție următoare cum aflăm ce a mers prost

---

O capcană. printf nu apelează write pe loc: strânge textul într-un **buffer** și îl scrie în bucăți mari, ca să facă mai puține apeluri de sistem. write pleacă imediat. Așa că, dacă le amestecăm, textul poate ieși în altă ordine decât în cod. Când le amestecăm, apelăm **fflush(stdout)** înainte de fiecare write, ca să trimitem ce a strâns printf

---

## Misiune: Numărătorul de bytes

Linia de teleimprimantă se plătește la byte, așa că stația vrea un program care lasă textul să treacă și îl numără pe drum

1. Copiază tot ce vine la intrare în ieșire, exact cum e, folosind doar read și write. Citește în bucăți de cel mult 16 bytes
2. În timp ce copiezi, numără bytes-ii și liniile. O linie se termină cu un `'\n'`
3. După copiere, afișează încă o linie cu cele două numere, ca în exemplu. Pentru această ultimă linie poți folosi printf

Nu folosi scanf, fgets, getchar sau alte funcții stdio ca să citești. Intrarea are cel mult 5000 de bytes

**Exemplu**

Intrare

```text
load tape 7
run
```

Ieșire

```text
load tape 7
run
Bytes: 16, linii: 2
```
