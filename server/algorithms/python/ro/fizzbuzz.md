# Ușor · FizzBuzz

Afișează numerele de la 1 la N, dar cu o răsturnare de situație: pentru multiplii de 3 afișează `Fizz`, pentru multiplii de 5 afișează `Buzz`, iar pentru multiplii atât de 3 cât și de 5 afișează `FizzBuzz`.

### Date de intrare

- Un singur număr întreg `n` (1 <= n <= 100).

### Rezultat

Afișează o valoare pe linie: numărul însuși, `Fizz`, `Buzz` sau `FizzBuzz`.

### Exemple

```
Intrare:
5

Ieșire:
1
2
Fizz
4
Buzz
```

```
Intrare:
15

Ieșire:
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
```

### Indicii

- Verifică divizibilitatea cu **ambele** 3 și 5 mai întâi — dacă verifici doar pentru 3 prima dată, nu vei ajunge niciodată la `FizzBuzz`.
- Folosește operatorul modulo `%`: `n % 3 == 0` înseamnă că `n` este divizibil cu 3.
- Un număr este divizibil atât cu 3 cât și cu 5 dacă și numai dacă este divizibil cu 15.
- Afișează fiecare rezultat pe propria sa linie.
