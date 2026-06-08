Python vine cu o grămadă de funcții utile deja încorporate. Am văzut deja **print()**, **len()**, **int()**, **input()**, **range()**, **min()**, **max()**. Hai să ne uităm la câteva în plus care ne vor economisi mult timp

---

**sum()** adună toate numerele dintr-o listă

```py
scoruri = [80, 95, 70, 88]
print(sum(scoruri))
```

Afișează **333**. Nu e nevoie să scriem un for cu o variabilă total, Python o face pentru noi

---

**sorted()** returnează o listă **nouă** sortată

```py
numere = [5, 2, 8, 1, 9, 3]
print(sorted(numere))
print(numere)
```

Afișează

```text
[1, 2, 3, 5, 8, 9]
[5, 2, 8, 1, 9, 3]
```

Observă că lista **originală** rămâne neschimbată. **sorted()** ne dă una nouă. Dacă vrem să sortăm în ordine **inversă** (descrescătoare)

```py
print(sorted(numere, reverse=True))
```

Afișează **[9, 8, 5, 3, 2, 1]**

Funcționează și pe șiruri de caractere

```py
nume = ["Tommy", "Lance", "Cortez", "Phil"]
print(sorted(nume))
```

Afișează **['Cortez', 'Lance', 'Phil', 'Tommy']**. Ordine alfabetică

---

**enumerate()** ne dă atât **indexul** cât și **valoarea** când parcurgem o listă

Îți amintești metoda veche?

```py
nume = ["Tommy", "Lance", "Cortez"]
for i in range(len(nume)):
    print(f"{i}: {nume[i]}")
```

Cu **enumerate()** e mult mai curat

```py
nume = ["Tommy", "Lance", "Cortez"]
for i, nume in enumerate(nume):
    print(f"{i}: {nume}")
```

Afișează

```text
0: Tommy
1: Lance
2: Cortez
```

Același rezultat, dar nu mai trebuie să scriem **range(len(...))** și **nume[i]**. Mult mai frumos :)

---

**zip()** combină două liste **element cu element**, ca un fermoar la o geacă

```py
nume = ["Tommy", "Lance", "Cortez"]
scoruri = [95, 80, 70]

for nume, scor in zip(nume, scoruri):
    print(f"{nume}: {scor}")
```

Afișează

```text
Tommy: 95
Lance: 80
Cortez: 70
```

**zip()** împerechează primul element din fiecare listă, apoi al doilea, apoi al treilea, și așa mai departe. Dacă listele au lungimi diferite, se oprește la cea mai scurtă

---

**any()** returnează **True** dacă **cel puțin un** element este adevărat. **all()** returnează **True** dacă **fiecare** element este adevărat

```py
scoruri = [80, 95, 40, 70]

are_esuat = any(s < 50 for s in scoruri)
print(are_esuat)

toate_promovate = all(s >= 50 for s in scoruri)
print(toate_promovate)
```

Afișează

```text
True
False
```

**any()**: există cel puțin un scor sub 50? Da (40), deci **True**

**all()**: sunt TOATE scorurile cel puțin 50? Nu (40 nu e), deci **False**

---

**abs()** ne dă **valoarea absolută** (elimină semnul minus)

```py
print(abs(-5))
print(abs(5))
print(abs(-100))
```

Afișează

```text
5
5
100
```

---

**round()** rotunjește un număr

```py
print(round(3.7))
print(round(3.2))
print(round(3.14159, 2))
```

Afișează

```text
4
3
3.14
```

Al doilea argument îi spune lui Python câte zecimale vrem

---

## Misiune: Clasamentul Echipajului

Ai două liste: `echipaj` (nume) și `scoruri` (deja în dreapta). Folosind **funcțiile încorporate** pe care tocmai le-ai învățat:

1. Folosește `zip` ca să afișezi fiecare membru al echipajului cu scorul său ca `nume: scor`
2. Afișează `Sortate: ` apoi scorurile sortate de la **cel mai mare la cel mai mic** (`sorted(..., reverse=True)`)
3. Afișează `Total: ` apoi **suma** tuturor scorurilor
4. Afișează `Medie: ` apoi media, **rotunjită** la 1 zecimală (`round(..., 1)`)
5. Afișează `Toți au trecut: ` apoi dacă **toate** scorurile sunt 50 sau mai mult (`all(...)`)
6. Afișează `Vreunul perfect: ` apoi dacă **vreun** scor este egal cu 100 (`any(...)`)

**Output**

```text
Tommy: 88
Boris: 100
Cara: 47
Dmitri: 73
Sortate: [100, 88, 73, 47]
Total: 308
Medie: 77.0
Toți au trecut: False
Vreunul perfect: True
```
