O steluță prinde valorile date în ordine. Două steluțe, `**kwargs`, prind valorile date cu nume, oricâte ar fi, și le pun într-un **dicționar**

---

Fiecare argument cu nume devine o pereche în dicționar: numele e cheia, valoarea e valoarea

```py
def arata(**detalii):
    print(detalii)

arata(varsta=36, oras="Londra")
arata()
```

Rezultat

```text
{'varsta': 36, 'oras': 'Londra'}
{}
```

Ca la o steluță, numele de după `**` îl alegem noi. `**detalii`, `**optiuni` și `**info` merg toate

---

Fiind un dicționar, îl parcurgem cu `.items()`, ca în lecția Parcurgerea dicționarelor. Perechile vin în ordinea în care au fost date

```py
def ecuson(nume, **detalii):
    print(nume)
    for cheie, valoare in detalii.items():
        print(f"  {cheie}: {valoare}")

ecuson("Ada", rol="inginer", punte=3)
```

Rezultat

```text
Ada
  rol: inginer
  punte: 3
```

`nume` ia prima valoare, dată în ordine. Tot ce e dat cu nume ajunge în `detalii`

---

Două steluțe merg și într-un apel. Când avem un dicționar, `**` în fața lui transformă fiecare pereche într-un argument cu nume

```py
def ecuson(nume, **detalii):
    print(nume)
    for cheie, valoare in detalii.items():
        print(f"  {cheie}: {valoare}")

info = {"rol": "pilot", "punte": 1}
ecuson("Alan", **info)
ecuson("Grace", **info, tura="noapte")
```

Rezultat

```text
Alan
  rol: pilot
  punte: 1
Grace
  rol: pilot
  punte: 1
  tura: noapte
```

Al doilea apel le amestecă: perechile din `info`, apoi încă un argument cu nume scris de mână

---

O funcție le poate avea pe toate, în ordinea asta: parametri obișnuiți, `*args`, apoi `**kwargs`. Python decide unde merge fiecare valoare: în ordine la cei obișnuiți, restul în ordine la `*args`, iar toate cele cu nume la `**kwargs`

```py
def jurnal(eveniment, *numere, **etichete):
    print(eveniment, numere, etichete)

jurnal("andocare", 4, 7, nava="Speranta")
```

Rezultat

```text
andocare (4, 7) {'nava': 'Speranta'}
```

---

## Misiune: Fișele echipajului

Fiecare membru al echipajului primește o fișă. Unii oameni au multe detalii, alții niciunul, așa că fișa trebuie să meargă cu orice detalii

1. Scrie o funcție **fisa(nume, \*\*detalii)** care afișează numele cu majuscule, apoi câte o linie pentru fiecare detaliu: două spații, numele detaliului, `: ` și valoarea lui, în ordinea în care au fost date detaliile. Ultima linie e `detalii: ` și câte detalii au fost
2. Începe programul cu două variabile: **nume**, un string, și **info**, un dicționar de detalii. De exemplu `nume = "Ada"` și `info = {"rol": "inginer", "punte": 3}`
3. Apelează `fisa()` de trei ori: cu numele și toate detaliile din `info`, doar cu numele, și cu numele, toate detaliile din `info` și încă unul, `tura="zi"`

**info** are între 0 și 6 detalii. Numele lor au doar litere mici și nu sunt niciodată `tura` sau `nume`

**Exemplu** pentru valorile de mai sus

```text
ADA
  rol: inginer
  punte: 3
detalii: 2
ADA
detalii: 0
ADA
  rol: inginer
  punte: 3
  tura: zi
detalii: 3
```
