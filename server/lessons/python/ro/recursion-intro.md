**Recursivitatea** este atunci când o funcție **se cheamă pe ea însăși**. Da, ai citit bine. O funcție se poate chema pe ea însăși. Sună de parcă ar trebui să strice totul, dar când e făcută corect, este unul dintre cele mai elegante instrumente din programare

Hai să începem cu o analogie din viața reală. Imaginează-ți că ești într-un rând de oameni și vrei să știi câți oameni sunt în fața ta. Nu poți vedea începutul, așa că îl întrebi pe cel din fața ta: „câți oameni sunt în fața **ta**?" Nici el nu știe, așa că îl întreabă pe cel din fața **lui**. Asta continuă până când cineva chiar din față spune „**zero** — nu e nimeni în fața mea". Apoi răspunsul vine înapoi: 0, 1, 2, 3, ...

Asta e recursivitatea. **Fiecare persoană pune aceeași întrebare următoarei**, până când cineva știe răspunsul direct

---

În cod, cel mai simplu exemplu: **numărătoarea inversă**

```py
def numaratoare_inversa(n):
    if n == 0:
        print("Start!")
        return
    print(n)
    numaratoare_inversa(n - 1)

numaratoare_inversa(5)
```

Ieșire

```text
5
4
3
2
1
Start!
```

**numaratoare_inversa(5)** afișează 5, apoi cheamă **numaratoare_inversa(4)**. Care afișează 4, apoi cheamă **numaratoare_inversa(3)**. Și așa mai departe. Când **n == 0**, afișăm "Start!" și **ne oprim** (return). Fără acea condiție de oprire, funcția s-ar chema pe ea însăși la nesfârșit — o **recursivitate infinită**, exact ca o buclă infinită

Condiția de oprire se numește **cazul de bază**. Fiecare funcție recursivă are nevoie de unul

---

Un clasic: **factorialul**. 5! = 5 × 4 × 3 × 2 × 1 = 120

Gândește-te recursiv: **5! = 5 × 4!**. Și **4! = 4 × 3!**. Și așa mai departe. Până când **1! = 1** (cazul de bază)

```py
def factorial(n):
    if n == 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))
print(factorial(3))
```

Ieșire

```text
120
6
```

Hai să urmărim **factorial(5)**:

- factorial(5) = 5 × factorial(4)
- factorial(4) = 4 × factorial(3)
- factorial(3) = 3 × factorial(2)
- factorial(2) = 2 × factorial(1)
- factorial(1) = 1 ← cazul de bază!
- Acum se desfășoară înapoi: 2×1=2, 3×2=6, 4×6=24, 5×24=120

---

Alt clasic: **suma unei liste**

```py
def suma_lista(numere):
    if len(numere) == 0:
        return 0
    return numere[0] + suma_lista(numere[1:])

print(suma_lista([1, 2, 3, 4, 5]))
```

Rezultat **15**

Ideea: suma unei liste este **primul element** plus **suma restului**. Restul devine din ce în ce mai mic până e gol (cazul de bază: return 0)

---

**Când să folosești recursivitatea?** Recursivitatea strălucește când o problemă poate fi împărțită în mod natural în **versiuni mai mici ale ei înseși**. Arborii, structurile imbricate, secvențele matematice, algoritmii de tip divide-et-impera — toate acestea adoră recursivitatea

Pentru lucruri simple precum numărarea sau însumarea, o **buclă** este de obicei mai clară și mai eficientă. Dar înțelegerea recursivității deschide ușa către rezolvarea unor probleme pe care buclele nu le pot trata elegant

---

## Misiune: Amplificatorul de Semnal

Amplificatorul de semnal al stației își dublează puterea la fiecare etapă. Ca să prezici rezultatul, trebuie să calculezi puteri ale lui 2 — și o vei face cu **recursivitate**.

1. Scrie o funcție recursivă **putere(baza, exponent)** care întoarce `baza` ridicată la puterea `exponent`. Regula: `baza^exponent = baza * baza^(exponent - 1)`. Cazul de bază: `baza^0 = 1` (fără bucle, fără `**`).
2. Cu `baza = 2`, folosește o **buclă for** peste `range(5)` ca să afișezi tabelul amplificatorului: pentru fiecare `exponent` de la 0 la 4, afișează linia `2^exponent = rezultat` (folosind numerele reale).

**Ieșire**

```text
2^0 = 1
2^1 = 2
2^2 = 4
2^3 = 8
2^4 = 16
```
