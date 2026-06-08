Am învățat **for** și **while**. Buclele își fac treaba de la început până la sfârșit. Dar dacă, în mijlocul unei bucle, vrem să spunem „ok, e suficient, oprește-te"? Sau „sari peste asta, treci la următoarea"?

Exact pentru aceste două situații, **Python** ne oferă **break** și **continue**

---

**break** **oprește** bucla complet. Odată ce dăm de el, programul iese din buclă, indiferent câte iterații mai rămăseseră

```py
i = 0
for i in range(0, 100):
    if i == 5:
        break
    print(i)
```

Rezultat

```text
0
1
2
3
4
```

I-am spus lui **for** să meargă de la **0** la **99**, dar de îndată ce **i** a devenit **5**, am dat de **break** și bucla s-a oprit. Numerele **5, 6, 7, ..., 99** nu au fost niciodată afișate

Un exemplu real: imaginează-ți că căutăm un nume într-o listă. Odată ce l-am găsit, de ce să continuăm să căutăm?

```py
nume = ["Tommy", "Lance", "Cortez", "Phil", "Sonny"]
tinta = "Cortez"

for n in nume:
    if n == tinta:
        print(f"L-am găsit pe {tinta}!")
        break
    print(f"Verific {n}...")
```

Rezultat

```text
Verific Tommy...
Verific Lance...
L-am găsit pe Cortez!
```

Bucla nu a verificat **Phil** și **Sonny**, pentru că am găsit deja ce voiam. **break** ne-a economisit timp

---

**continue** este diferit. Nu oprește bucla. Doar **sare peste** restul iterației curente și **trece la următoarea**

```py
i = 0
for i in range(0, 10):
    if i == 5:
        continue
    print(i)
```

Rezultat

```text
0
1
2
3
4
6
7
8
9
```

Observă că **5** **lipsește**. Când **i** a fost **5**, **continue** a intrat în acțiune, a sărit peste **print(i)**, iar bucla a continuat de la **i = 6**

Un exemplu real: afișează doar numerele **pare** de la 0 la 10

```py
for i in range(0, 11):
    if i % 2 != 0:
        continue
    print(i)
```

Rezultat

```text
0
2
4
6
8
10
```

Pentru numerele impare, **continue** a sărit peste **print**. Pentru cele pare, **if**-ul a fost **False**, așa că **continue** nu s-a declanșat și **print** a rulat normal

---

O mică avertizare: **break** și **continue** pot face codul mai greu de citit dacă abuzezi de ele. Folosește-le când fac logica mai clară, nu doar ca să fii deștept :)

Ambele cuvinte cheie funcționează la fel în buclele **while**, nu doar în **for**

```py
i = 0
while True:
    if i >= 5:
        break
    print(i)
    i = i + 1
```

**while True** ar fi în mod normal o buclă infinită, dar **break** ne lasă să ieșim din ea când vrem

---

## Misiune: Scanner de Semnale

Stația scanează o listă de semnale primite (deja în dreapta). Regulile scanării:

- un număr **negativ** este doar zgomot — **sari peste el** (folosește **continue**)
- un **0** înseamnă „sfârșitul transmisiei" — **oprește** scanarea imediat (folosește **break**)
- orice alt semnal (pozitiv) este valid — **afișează-l** și **numără-l**

La final, afișează `Total semnale: ` apoi câte semnale valide ai găsit.

**Output**

```text
12
7
5
Total semnale: 3
```

`-3` și `-8` sunt sărite, scanarea se oprește la `0`, iar `99` și `4` de după el nu sunt niciodată atinse — așa că doar `12`, `7` și `5` contează.
