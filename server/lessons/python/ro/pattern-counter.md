Unul dintre cele mai des întâlnite lucruri pe care le vei face în programare este să **numeri** lucruri. Câte numere pare? Câte cuvinte mai lungi de 5 litere? Câți jucători sunt online? Acesta este **tiparul contor**

Ideea este simplă: pornește cu o variabilă la **0**, parcurge datele cu o buclă și **crește cu 1** de fiecare dată când găsim ceea ce căutăm

```py
numere = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
numar_pare = 0

for n in numere:
    if n % 2 == 0:
        numar_pare = numar_pare + 1

print(f"Numere pare: {numar_pare}")
```

Rezultat **Numere pare: 5**

Structura este mereu aceeași:

1. **Inițializează** contorul la 0
2. **Parcurge** datele cu o buclă
3. **Verifică** o condiție
4. Dacă condiția este adevărată, **crește** contorul

---

Hai să numărăm câte caractere dintr-un nume sunt majuscule

```py
nume = "Tommy Vercetti"
numar_majuscule = 0

for caracter in nume:
    if caracter.isupper():
        numar_majuscule = numar_majuscule + 1

print(f"Litere majuscule: {numar_majuscule}")
```

Rezultat **Litere majuscule: 2** (T și V)

**.isupper()** este o metodă pentru șiruri care returnează **True** dacă caracterul este majusculă. Există și **.islower()**, **.isdigit()**, **.isalpha()** și altele

---

Putem număra mai multe lucruri deodată

```py
text = "Hello World 123"
litere = 0
cifre = 0
spatii = 0

for caracter in text:
    if caracter.isalpha():
        litere = litere + 1
    elif caracter.isdigit():
        cifre = cifre + 1
    elif caracter == " ":
        spatii = spatii + 1

print(f"Litere: {litere}, Cifre: {cifre}, Spatii: {spatii}")
```

Rezultat **Litere: 10, Cifre: 3, Spații: 2**

---

Apropo, Python are o scurtătură pentru **x = x + 1**. Putem scrie **x += 1** în loc. Același lucru, mai puțin de scris

```py
contor = 0
contor += 1
contor += 1
contor += 1
print(contor)
```

Rezultat **3**. Funcționează și cu alți operatori: **x -= 1**, **x \*= 2**, **x /= 3**

---

## Misiune: Benzi de Citiri

Ai o listă de citiri ale reactorului (deja în dreapta). Folosind **tiparul contor**, numără câte se încadrează în fiecare bandă și afișează totalurile:

- `Mici: ` apoi câte citiri sunt **sub 50**
- `Medii: ` apoi câte sunt **de la 50 la 99** (inclusiv)
- `Mari: ` apoi câte sunt **100 sau peste**

**Ieșire**

```text
Mici: 2
Medii: 4
Mari: 2
```
