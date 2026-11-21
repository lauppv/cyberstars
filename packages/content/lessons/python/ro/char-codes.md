Un calculator păstrează doar numere. Așa că fiecare caracter, o literă, o cifră sau un spațiu, are numărul lui, numit **cod**. Python ne dă două funcții ca să trecem de la un caracter la codul lui și înapoi: `ord()` și `chr()`

---

`ord()` primește un caracter și ne dă înapoi codul lui

```py
print(ord("A"))
print(ord("B"))
print(ord("a"))
print(ord(" "))
```

Rezultat

```text
65
66
97
32
```

Literele mari au codurile de la 65 la 90, în ordinea alfabetului. Literele mici au codurile de la 97 la 122. De asta `"A"` și `"a"` sunt diferite pentru Python: sunt numere diferite

---

`chr()` face invers: primește un cod și ne dă înapoi caracterul

```py
print(chr(72) + chr(105))
```

Rezultat

```text
Hi
```

---

Pentru că literele sunt în ordine, putem face calcule cu ele. Ca să aflăm litera de după `"c"`, luăm codul ei, adunăm 1 și îl transformăm înapoi în caracter

```py
litera = "c"
print(chr(ord(litera) + 1))
```

Rezultat

```text
d
```

Cât de departe e o literă de începutul alfabetului? Scădem codul lui `"a"`

```py
for litera in "cab":
    print(litera, ord(litera) - ord("a"))
```

Rezultat

```text
c 2
a 0
b 1
```

`"a"` e la 0, `"b"` la 1, iar `"z"` la 25. Trucul merge pentru orice literă mică, și nu trebuie să ținem minte niciun cod

---

Putem să verificăm și ce fel de caracter avem, uitându-ne la codul lui

```py
for caracter in "R2d2":
    cod = ord(caracter)
    if cod >= ord("0") and cod <= ord("9"):
        print(caracter, "e o cifra")
    else:
        print(caracter, "nu e o cifra")
```

Rezultat

```text
R nu e o cifra
2 e o cifra
d nu e o cifra
2 e o cifra
```

---

## Misiune: Codul oglindă

Echipajul trimite cuvinte secrete în codul oglindă: fiecare literă e schimbată cu litera aflată pe același loc, numărat de la celălalt capăt al alfabetului. `a` devine `z`, `b` devine `y`, `c` devine `x` și tot așa, până la `z`, care devine `a`

1. Începe programul cu o variabilă **cuvant**, un string. De exemplu `cuvant = "moon"`
2. Afișează `Coduri: ` și codul fiecărei litere din cuvânt, cu un spațiu între coduri
3. Afișează `Oglinda: ` și cuvântul în codul oglindă

Rezolvă cu `ord()` și `chr()`, nu cu un string cu tot alfabetul. **cuvant** are între 1 și 20 de litere, toate litere mici de la `a` la `z`

**Exemplu** pentru cuvant = "moon"

```text
Coduri: 109 111 111 110
Oglinda: nllm
```

**Exemplu** pentru cuvant = "abz"

```text
Coduri: 97 98 122
Oglinda: zya
```
