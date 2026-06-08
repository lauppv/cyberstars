Tehnica **two pointers** (doi pointeri) este o idee simplă, dar puternică: în loc să folosim o singură variabilă pentru a parcurge datele, folosim **două** — una care pornește de la început și una de la sfârșit (sau una lentă și una rapidă)

Am văzut-o deja fără să știm. Când verificam palindroamele, comparam primul caracter cu ultimul, apoi al doilea cu penultimul. Aceia erau doi pointeri

```py
def este_palindrom(cuvant):
    stanga = 0
    dreapta = len(cuvant) - 1

    while stanga < dreapta:
        if cuvant[stanga] != cuvant[dreapta]:
            return False
        stanga += 1
        dreapta -= 1

    return True

print(este_palindrom("racecar"))
print(este_palindrom("hello"))
```

Rezultat

```text
True
False
```

**left** pornește de la 0, **right** pornește de la ultimul index. Comparăm, apoi îi mișcăm unul către celălalt. Când se întâlnesc la mijloc, am terminat

---

Alt exemplu clasic: având o listă **sortată** și o sumă țintă, găsește două numere care se adună până la țintă

Metoda brute force (buclă imbricată, verificând fiecare pereche) funcționează, dar este lentă. Cu doi pointeri pe o listă **sortată**, este mult mai inteligent

```py
def doua_numere(numere, tinta):
    stanga = 0
    dreapta = len(numere) - 1

    while stanga < dreapta:
        suma_curenta = numere[stanga] + numere[dreapta]
        if suma_curenta == tinta:
            return (numere[stanga], numere[dreapta])
        elif suma_curenta < tinta:
            stanga += 1
        else:
            dreapta -= 1

    return None

numere = [1, 2, 4, 7, 11, 15]
rezultat = doua_numere(numere, 9)
print(rezultat)
```

Rezultat **(2, 7)**

Cum funcționează? Adunăm cel mai mic număr (left) și cel mai mare (right). Dacă suma este **prea mică**, avem nevoie de un număr mai mare → mută **left** spre dreapta. Dacă suma este **prea mare**, avem nevoie de un număr mai mic → mută **right** spre stânga. Dacă este **exact bună**, am găsit perechea

Asta funcționează pentru că lista este **sortată**. Mutarea lui left crește suma, mutarea lui right o scade. Restrângem din ambele părți până când găsim răspunsul (sau pointerii se întâlnesc, ceea ce înseamnă că nu există nicio pereche)

---

Un exemplu mai simplu: **elimină duplicatele** dintr-o listă sortată (păstrând doar elementele unice)

```py
def elimina_duplicatele(numere):
    if len(numere) == 0:
        return []

    rezultat = [numere[0]]
    for i in range(1, len(numere)):
        if numere[i] != numere[i - 1]:
            rezultat.append(numere[i])
    return rezultat

print(elimina_duplicatele([1, 1, 2, 2, 2, 3, 4, 4, 5]))
```

Rezultat **[1, 2, 3, 4, 5]**

Aici comparăm fiecare element cu cel **anterior**. Dacă sunt diferite, este o nouă valoare unică — păstreaz-o

---

## Misiune: Perechi de Andocare

Navele care așteaptă să andocheze poartă fiecare o încărcătură de combustibil (deja în dreapta, sortată de la cea mai mică la cea mai mare). Două nave pot împărți o clemă de andocare doar dacă încărcăturile lor de combustibil se adună exact până la țintă. Găsește fiecare pereche validă.

Scrie o funcție **pair_with_sum(numere, tinta)** care primește o listă **sortată** și un număr țintă și returnează o listă cu **toate** perechile care se adună până la țintă. Folosește tehnica **two pointers** (un pointer la început, unul la sfârșit, mută-i unul către celălalt).

Apoi afișează `Perechi: ` urmat de lista de perechi și `Total perechi: ` urmat de câte sunt.

```py
combustibili = [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

**Rezultat**

```text
Perechi: [(1, 9), (2, 8), (3, 7), (4, 6)]
Total perechi: 4
```
