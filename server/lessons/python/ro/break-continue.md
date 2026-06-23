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

Un exemplu real: imaginează-ți că scanăm sectoarele stației, unul câte unul, ca să găsim un semnal. Odată ce l-am găsit, de ce să continuăm să scanăm?

```py
for sector in range(1, 100):
    if sector == 7:
        print(f"Semnal găsit în sectorul {sector}!")
        break
    print(f"Scanez sectorul {sector}...")
```

Rezultat

```text
Scanez sectorul 1...
Scanez sectorul 2...
Scanez sectorul 3...
Scanez sectorul 4...
Scanez sectorul 5...
Scanez sectorul 6...
Semnal găsit în sectorul 7!
```

Bucla nu a mai verificat sectoarele de la **8** la **99**, pentru că am găsit deja ce voiam. **break** ne-a economisit timp

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

Ambele cuvinte cheie funcționează la fel în buclele **while**, nu doar în **for**. Un tipar foarte des întâlnit este **while True** împreună cu **input()**: repetăm la nesfârșit și ieșim cu **break** atunci când utilizatorul ne spune

```py
while True:
    comanda = input("Comandă: ")
    if comanda == "stop":
        break
    print(f"Execut: {comanda}")
print("Sistem oprit")
```

**while True** ar fi în mod normal o buclă infinită. Dar la fiecare pas cerem o comandă, iar dacă utilizatorul tastează **stop**, **break** ne scoate din buclă. Orice altceva ar tasta, programul afișează **Execut: ...** și întreabă din nou

---

## Misiune: Scaner manual de sectoare

Operatorul stației introduce numere de sector **unul câte unul**. Folosește o buclă **while True** și citește la fiecare pas un număr cu `int(input(...))`. Pentru fiecare număr:

- dacă operatorul tastează `0` → este sfârșitul scanării, **oprește** bucla (folosește **break**)
- dacă numărul este **negativ** → este doar zgomot, **sari peste el** (folosește **continue**) și nu afișa nimic
- altfel → afișează `Sector ` apoi numărul, apoi ` verificat` (de exemplu `Sector 4 verificat`)

După buclă, afișează `Scanare terminată`.

**Exemplu**

Dacă operatorul tastează pe rând `4`, apoi `-2`, apoi `7`, apoi `0`, programul afișează

```text
Sector 4 verificat
Sector 7 verificat
Scanare terminată
```

`-2` este sărit, iar `0` oprește scanarea.
