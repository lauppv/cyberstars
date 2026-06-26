Un **palindrom** este un cuvânt care se citește la fel de la stânga la dreapta și invers. **racecar**, **madam**, **level** — întoarce-le și sunt la fel

Cum verificăm dacă un cuvânt este palindrom? Cea mai simplă abordare: **inversează-l și compară**

```py
cuvant = "racecar"
if cuvant == cuvant[::-1]:
    print("Palindrom!")
else:
    print("Nu e palindrom")
```

Rezultat **Palindrom!**

Asta e tot. O singură linie de logică. Inversăm șirul și verificăm dacă este la fel ca originalul. Python face asta absurd de simplu

---

Dar hai să ne gândim și cum să facem asta **fără** trucul cu slicing, pentru că logica este importantă

Un palindrom înseamnă: **primul** caracter este egal cu **ultimul**, **al doilea** este egal cu **penultimul** și așa mai departe

```py
def este_palindrom(cuvant):
    for i in range(len(cuvant) // 2):
        if cuvant[i] != cuvant[len(cuvant) - 1 - i]:
            return False
    return True

print(este_palindrom("racecar"))
print(este_palindrom("hello"))
print(este_palindrom("madam"))
```

Ieșire

```text
True
False
True
```

Trebuie să verificăm doar **jumătate** din șir. De ce? Pentru că dacă prima jumătate se potrivește cu a doua jumătate (în oglindă), am terminat. Verificarea celeilalte jumătăți ar fi redundantă

**len(cuvant) // 2** ne dă jumătate din lungime (împărțire întreagă). Pentru „racecar" (7 litere), verificăm pozițiile 0, 1, 2 (comparând cu 6, 5, 4)

---

Dar propozițiile? „A man a plan a canal Panama" este un palindrom dacă ignorăm spațiile și majusculele

```py
def este_palindrom_propozitie(text):
    curatat = ""
    for caracter in text:
        if caracter.isalpha():
            curatat += caracter.lower()
    return curatat == curatat[::-1]

print(este_palindrom_propozitie("A man a plan a canal Panama"))
print(este_palindrom_propozitie("racecar"))
print(este_palindrom_propozitie("hello world"))
```

Ieșire

```text
True
True
False
```

Mai întâi **curățăm** șirul: păstrăm doar literele și le transformăm în litere mici. Apoi verificăm dacă este palindrom. Pas cu pas, exact cum am învățat în lecția despre descompunere

---

## Misiune: Verificarea Integrității Semnalului

Un cod de semnal este de încredere doar dacă se citește la fel de la stânga la dreapta și invers — un **palindrom**. Stația a înregistrat un lot de coduri și trebuie verificate.

1. Scrie o funcție **este_palindrom(cuvant)** care returnează `True` dacă cuvântul este palindrom, `False` altfel. Folosește o **buclă** (compară prima literă cu ultima, a doua cu penultima, ...), nu `[::-1]`.
2. Pentru fiecare cod, afișează codul, apoi `: `, apoi rezultatul.
3. Numără câte coduri sunt palindroame și afișează `Semnale valide: ` urmat de acel număr.

**Ieșire**

```text
racecar: True
signal: False
level: True
orbit: False
radar: True
Semnale valide: 3
```
