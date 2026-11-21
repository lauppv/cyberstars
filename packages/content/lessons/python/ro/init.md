Să setăm de mână fiecare atribut după ce facem un obiect e lung și ușor de uitat. O clasă poate face asta singură, cu o funcție specială numită `__init__`. Python o rulează de fiecare dată când e făcut un obiect nou

---

`__init__` stă în clasă, mutată mai la dreapta. Primul ei parametru e `self`: obiectul nou care se face. Ceilalți parametri sunt valorile pe care le dăm când facem obiectul

```py
class Nava:
    def __init__(self, nume, viteza):
        self.nume = nume
        self.viteza = viteza

speranta = Nava("Speranta", 12)
fulger = Nava("Fulger", 30)
print(speranta.nume, speranta.viteza)
print(fulger.nume, fulger.viteza)
```

Rezultat

```text
Speranta 12
Fulger 30
```

`Nava("Speranta", 12)` face un obiect gol, apoi apelează `__init__` cu acel obiect drept `self`, `"Speranta"` drept `nume` și `12` drept `viteza`. `self.nume = nume` pune valoarea pe obiect. Numele au câte două liniuțe jos de fiecare parte; Python folosește astfel de nume pentru funcțiile lui speciale

---

Nu dăm niciodată noi `self`: îl dă Python. Dăm celelalte valori, în ordine sau cu nume, ca la orice funcție. Dacă uităm una, e eroare

```py
class Nava:
    def __init__(self, nume, viteza):
        self.nume = nume
        self.viteza = viteza

bob = Nava(viteza=5, nume="Bob")
print(bob.nume)
try:
    Nava("Pierduta")
except TypeError:
    print("o nava are nevoie de nume si viteza")
```

Rezultat

```text
Bob
o nava are nevoie de nume si viteza
```

---

`__init__` poate face mai mult decât să copieze valori. Poate da valori implicite, poate calcula atribute noi sau poate porni o listă goală

```py
class Nava:
    def __init__(self, nume, viteza=10):
        self.nume = nume.upper()
        self.viteza = viteza
        self.rapida = viteza > 20
        self.marfa = []

speranta = Nava("speranta")
speranta.marfa.append("apa")
print(speranta.nume, speranta.viteza, speranta.rapida, speranta.marfa)
```

Rezultat

```text
SPERANTA 10 False ['apa']
```

Acum fiecare obiect are aceleași atribute de la început, așa că niciunul nu poate lipsi

---

## Misiune: Ecusoanele echipajului

Fiecare membru nou al echipajului primește un ecuson. Ecusonul are numele persoanei, rolul ei și un cod făcut din ele

1. Scrie o clasă **Membru** cu un `__init__` care primește un `nume` și un `rol` și setează trei atribute: `nume`, `rol` și `cod`. Codul e format din primele 3 litere ale numelui cu majuscule, un `-` și lungimea rolului, ca `ADA-5` pentru Ada, pilotul
2. Începe programul cu două variabile: **nume** și **roluri**, două liste de string-uri în aceeași ordine. De exemplu `nume = ["Ada", "Alan", "Grace"]` și `roluri = ["pilot", "medic", "inginer"]`
3. Fă câte un `Membru` pentru fiecare nume și rol și afișează câte o linie pentru fiecare: codul, ` `, numele și ` (` rolul `)`

Listele au între 1 și 10 oameni. Fiecare nume are cel puțin 3 litere

**Exemplu** pentru valorile de mai sus

```text
ADA-5 Ada (pilot)
ALA-5 Alan (medic)
GRA-7 Grace (inginer)
```
