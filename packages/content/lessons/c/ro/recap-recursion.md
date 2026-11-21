Pune la lucru împreună recursivitatea și variabilele static

---

## Misiune: Numărătorul de apeluri

Cineva a lăsat pe mainframe o lucrare care calculează numerele Fibonacci. E foarte lentă, iar șeful de tură vrea să afle de ce. Treaba ta e să numeri de câte ori e apelată funcția recursivă

Numerele Fibonacci încep cu 0 și 1, iar fiecare număr următor e suma celor două dinaintea lui: 0, 1, 1, 2, 3, 5, 8, 13...

1. Scrie o funcție **int contor(int pas)** care ține un total într-o variabilă static. Adună pas la total și întoarce noul total. Deci contor(1) mai numără unul, iar contor(0) doar îți spune totalul de până acum
2. Scrie o funcție recursivă **int fib(int n)**: fib(0) e 0, fib(1) e 1, iar fib(n) e fib(n - 1) + fib(n - 2). De fiecare dată când pornește, fib apelează contor(1)
3. Citește un număr întreg k de la input, apoi k valori pentru n. Pentru fiecare n, afișează numărul lui Fibonacci și de câte apeluri ale lui fib a fost nevoie, ca în exemplu
4. Contorul nu se mai întoarce niciodată la 0, așa că pentru fiecare n uită-te la total înainte și după

Fiecare n e între 0 și 25, iar k e între 1 și 10

**Exemplu**

Intrare

```text
3
10 0 2
```

Ieșire

```text
fib(10) = 55, apeluri: 177
fib(0) = 0, apeluri: 1
fib(2) = 1, apeluri: 3
```

Uite cât de repede cresc apelurile. fib(10) le cere pe fib(9) și fib(8), dar fib(9) o cere din nou pe fib(8), iar fiecare valoare e calculată de multe ori
