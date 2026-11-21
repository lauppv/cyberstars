Până acum am ținut datele unei nave într-un dicționar: `{"nume": "Speranta", "viteza": 12}`. O **clasă** e o casă mai bună pentru ele. E un plan pentru un fel de lucru, iar dintr-un plan putem face multe **obiecte**, fiecare cu datele lui

---

`class`, un nume și două puncte fac o clasă. Numele claselor încep cu literă mare, din obișnuință. `pass` înseamnă „nimic aici deocamdată”

```py
class Nava:
    pass

speranta = Nava()
fulger = Nava()
print(type(speranta))
print(speranta is fulger)
```

Rezultat

```text
<class '__main__.Nava'>
False
```

`Nava()`, cu paranteze, face un obiect nou din clasă, ca un apel de funcție. `speranta` și `fulger` sunt două obiecte diferite de același fel. `__main__` e doar numele pe care Python i-l dă programului nostru

---

Un obiect poate ține valori, numite **atribute**. Le setăm și le citim cu un punct

```py
class Nava:
    pass

speranta = Nava()
speranta.nume = "Speranta"
speranta.viteza = 12

fulger = Nava()
fulger.nume = "Fulger"
fulger.viteza = 30

print(speranta.nume, speranta.viteza)
print(fulger.nume, fulger.viteza)
```

Rezultat

```text
Speranta 12
Fulger 30
```

Fiecare obiect își păstrează atributele lui. Dacă schimbăm `fulger.viteza`, `speranta.viteza` rămâne la fel

---

Obiectele pot merge oriunde merge o valoare: într-o variabilă, într-o listă, într-o funcție

```py
class Nava:
    pass

def fa_nava(nume, viteza):
    nava = Nava()
    nava.nume = nume
    nava.viteza = viteza
    return nava

flota = [fa_nava("Speranta", 12), fa_nava("Fulger", 30)]
for nava in flota:
    print(f"{nava.nume} zboara cu {nava.viteza}")
```

Rezultat

```text
Speranta zboara cu 12
Fulger zboara cu 30
```

---

Dacă citim un atribut pe care obiectul nu îl are, programul se oprește cu un AttributeError

```py
class Nava:
    pass

speranta = Nava()
try:
    print(speranta.echipaj)
except AttributeError:
    print("speranta nu are inca echipaj")
```

Rezultat

```text
speranta nu are inca echipaj
```

În lecția următoare vedem cum îi dăm fiecărui obiect atributele chiar când e făcut, ca să nu lipsească niciunul

---

## Misiune: Registrul flotei

Docul ține o evidență a fiecărei nave care aterizează. Evidențele erau dicționare, iar acum devin obiecte

1. Scrie o clasă **Nava**
2. Începe programul cu două variabile: **nume**, o listă de string-uri, și **viteze**, o listă de numere întregi, în aceeași ordine. De exemplu `nume = ["Speranta", "Fulger", "Bob"]` și `viteze = [12, 30, 5]`
3. Fă câte un obiect `Nava` pentru fiecare nume, cu atributele `nume` și `viteza`, și păstrează-le într-o listă
4. Folosind obiectele, afișează câte o linie pentru fiecare navă: numele, `: ` și viteza
5. Afișează `Cea mai rapida: ` și numele celei mai rapide nave, prima dacă mai multe sunt la fel de rapide

Cele două liste au aceeași lungime, între 1 și 10 nave

**Exemplu** pentru valorile de mai sus

```text
Speranta: 12
Fulger: 30
Bob: 5
Cea mai rapida: Fulger
```
