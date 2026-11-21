Atributele pe care le setăm cu `self.nume = ...` aparțin unui singur obiect. Uneori o valoare aparține în schimb întregii clase: un numărător al obiectelor făcute sau o setare pe care o împart toate. Asta e un **atribut al clasei**

---

Un atribut al clasei e setat în clasa însăși, în afara metodelor. Orice obiect îl poate citi, și la fel clasa

```py
class Nava:
    roti = 0
    viteza_maxima = 100

    def __init__(self, nume):
        self.nume = nume

speranta = Nava("Speranta")
print(speranta.viteza_maxima)
print(Nava.viteza_maxima)
```

Rezultat

```text
100
100
```

`speranta` nu are `viteza_maxima` a ei, așa că Python caută în clasa ei și îl găsește acolo

---

Ca să schimbi un atribut al clasei pentru toți, schimbă-l prin clasă. Aici fiecare obiect nou se numără singur

```py
class Nava:
    facute = 0

    def __init__(self, nume):
        self.nume = nume
        Nava.facute += 1

Nava("Speranta")
Nava("Fulger")
print(Nava.facute)
```

Rezultat

```text
2
```

`Nava.facute += 1` schimbă singura valoare pe care o ține clasa, așa că fiecare navă nouă adaugă la același număr

---

Atenție: dacă îl setezi prin `self`, faci un atribut nou pe acel singur obiect, care ascunde valoarea clasei doar pentru el

```py
class Nava:
    viteza_maxima = 100

speranta = Nava()
fulger = Nava()
speranta.viteza_maxima = 50
print(speranta.viteza_maxima, fulger.viteza_maxima, Nava.viteza_maxima)
```

Rezultat

```text
50 100 100
```

Așa că citește atributele clasei prin `self` sau prin clasă, cum vrei, dar schimbă-le prin clasă

---

A doua capcană: o listă ca atribut al clasei e o singură listă pentru toate obiectele. Dacă adaugi în ea dintr-un obiect, adaugi pentru toate

```py
class Nava:
    marfa = []

speranta = Nava()
fulger = Nava()
speranta.marfa.append("apa")
print(fulger.marfa)
```

Rezultat

```text
['apa']
```

Când fiecare obiect are nevoie de o listă a lui, fă-o în `__init__` cu `self.marfa = []`

---

## Misiune: Numerele navelor

Fiecare navă care intră în flotă primește următorul număr liber, iar toate navele zboară sub același nume de flotă

1. Scrie o clasă **Nava** cu două atribute ale clasei: `urmatorul_numar`, care pornește de la 1, și `flota`, care pornește ca `"Flota Libera"`. `__init__`-ul ei primește un `nume`, setează atributele `nume` și `numar`, dându-i navei următorul număr al clasei, și crește cu 1 următorul număr al clasei
2. Începe programul cu două variabile: **nume**, o listă de string-uri, și **flota**, un string. De exemplu `nume = ["Speranta", "Fulger"]` și `flota = "Flota Stelara"`
3. Fă câte o `Nava` pentru fiecare nume. Apoi setează numele flotei clasei la **flota** și afișează câte o linie pentru fiecare navă: `#`, numărul ei, un spațiu, numele ei, `din` cu câte un spațiu de fiecare parte, și numele flotei, citit prin navă
4. Afișează `Urmatorul numar liber: ` și următorul număr al clasei

**nume** are între 1 și 10 nume

**Exemplu** pentru valorile de mai sus

```text
#1 Speranta din Flota Stelara
#2 Fulger din Flota Stelara
Urmatorul numar liber: 3
```
