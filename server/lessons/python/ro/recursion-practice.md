Hai să exersăm recursivitatea cu mai multe exemple. Cheia ca să te simți confortabil cu recursivitatea este să te întrebi mereu două lucruri: **care e cazul de bază?** și **cum devine problema mai mică?**

---

**Șirul lui Fibonacci**: fiecare număr este suma celor două dinaintea lui. 0, 1, 1, 2, 3, 5, 8, 13, 21, ...

Regula: **fib(n) = fib(n-1) + fib(n-2)**. Cazuri de bază: **fib(0) = 0** și **fib(1) = 1**

```py
def fib(n):
    if n == 0:
        return 0
    if n == 1:
        return 1
    return fib(n - 1) + fib(n - 2)

for i in range(10):
    print(fib(i), end=" ")
```

Output **0 1 1 2 3 5 8 13 21 34**

Frumos? Da. Eficient? Nu prea. **fib(5)** apelează **fib(4)** și **fib(3)**. Dar **fib(4)** apelează și el **fib(3)** — deci calculăm același lucru de două ori. Pentru **fib(30)**, asta se repetă de milioane de ori. Deocamdată, nu-ți face griji — important e să înțelegi logica

---

**Inversează un șir de caractere** recursiv

```py
def inverseaza_sir(s):
    if len(s) <= 1:
        return s
    return inverseaza_sir(s[1:]) + s[0]

print(inverseaza_sir("Tommy"))
```

Output **ymmoT**

Ideea: inversul lui "Tommy" este inversul lui "ommy" urmat de "T". Inversul lui "ommy" este inversul lui "mmy" urmat de "o". Și tot așa până rămânem cu un singur caracter (cazul de bază)

---

**Numără aparițiile** unui caracter într-un șir

```py
def numara_caractere(text, tinta):
    if len(text) == 0:
        return 0
    primul = 1 if text[0] == tinta else 0
    return primul + numara_caractere(text[1:], tinta)

print(numara_caractere("banana", "a"))
print(numara_caractere("mississippi", "s"))
```

Ieșire

```text
3
4
```

Verifică primul caracter. Dacă se potrivește, numără 1. Apoi numără recursiv în restul șirului. Cazul de bază: șir gol → 0

---

**Aplatizează o listă imbricată**. Aici strălucește cu adevărat recursivitatea — când datele sunt **imbricate** și nu știm cât de adânc

```py
def aplatizeaza(lst):
    rezultat = []
    for element in lst:
        if type(element) == list:
            rezultat = rezultat + aplatizeaza(element)
        else:
            rezultat.append(element)
    return rezultat

print(aplatizeaza([1, [2, 3], [4, [5, 6]], 7]))
```

Output **[1, 2, 3, 4, 5, 6, 7]**

Pentru fiecare element: dacă e o listă, aplatizeaz-o recursiv și adaugă rezultatele. Dacă nu e o listă, doar adaug-o. O simplă buclă nu poate gestiona o adâncime de imbricare arbitrară — recursivitatea poate

---

## Misiune: Sume de Control ale Transmisiunilor

Fiecare transmisiune poartă un cod numeric, iar stația îl verifică cu o **sumă de control** (checksum) — suma cifrelor codului. Vei calcula aceste sume de control cu **recursivitate**.

1. Scrie o funcție recursivă **sum_digits(n)** care returnează suma cifrelor unui număr întreg pozitiv. Trucul: `n % 10` este **ultima cifră**, `n // 10` este **restul numărului**. Cazul de bază: dacă `n < 10` (o singură cifră), returnează `n` însuși.
2. Pentru fiecare cod din listă, afișează codul, apoi `: `, apoi suma lui de control.
3. Reține și afișează **cea mai mare** sumă de control sub forma `Cea mai mare sumă de control: ` urmat de valoare.

**Ieșire**

```text
1234: 10
999: 27
5: 5
4070: 11
88: 16
Cea mai mare suma de control: 27
```
