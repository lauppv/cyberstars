Unele funcții nu știu câte valori vor primi. `print()` primește o valoare, sau două, sau zece. Putem scrie și noi funcții așa, cu o steluță în fața unui parametru: `*args`

---

Un parametru cu `*` în față prinde toate valorile date în ordine, oricâte ar fi, și le pune într-un **tuple**

```py
def arata(*valori):
    print(valori)
    print(len(valori))

arata(4, 8, 15)
arata("salut")
arata()
```

Rezultat

```text
(4, 8, 15)
3
('salut',)
1
()
0
```

Un tuple e ca o listă pe care nu o putem schimba, cum am văzut în lecția Tupluri. Fără nicio valoare, tuple-ul e gol. Numele nu trebuie să fie `args`: `*valori`, `*numere` sau `*nume` merg toate. Alege unul care spune ce e înăuntru

---

Fiind un tuple, îl putem parcurge într-o buclă, îi putem lua lungimea sau îl putem da lui `sum()`

```py
def media(*numere):
    if len(numere) == 0:
        return 0
    return sum(numere) / len(numere)

print(media(2, 4, 9))
print(media(10))
print(media())
```

Rezultat

```text
5.0
10.0
0
```

Verificând întâi dacă tuple-ul e gol, nu ajungem să împărțim la zero

---

Înaintea steluței pot veni parametri obișnuiți. Ei iau primele valori, iar steluța ia restul

```py
def echipa(capitan, *altii):
    print("Capitan:", capitan)
    for n in altii:
        print("Echipaj:", n)

echipa("Ada", "Alan", "Grace")
```

Rezultat

```text
Capitan: Ada
Echipaj: Alan
Echipaj: Grace
```

---

Steluța merge și invers. Când avem deja o listă, un `*` în fața ei într-un apel îi împrăștie elementele, ca și cum le-am fi scris pe fiecare de mână

```py
def media(*numere):
    if len(numere) == 0:
        return 0
    return sum(numere) / len(numere)

punctaje = [6, 8, 10]
print(media(*punctaje))
print(media(punctaje[0], punctaje[1]))
```

Rezultat

```text
8.0
7.0
```

Fără steluță, `media(punctaje)` ar primi o singură valoare, toată lista, iar `sum()` pe un tuple care conține o listă dă eroare

---

## Misiune: Cântarul stației

Cutiile ajung la cântarul stației una câte una, câteva deodată sau deloc. Cântarul are nevoie de o singură funcție care merge pentru oricâte cutii

1. Scrie o funcție **rezumat(\*greutati)** care returnează o linie ca `cutii 3, total 45 kg, cea mai grea 25 kg`. Fără cutii, cea mai grea e 0
2. Începe programul cu o variabilă **cutii**, o listă de numere întregi: greutățile în kilograme. De exemplu `cutii = [10, 25, 10]`
3. Afișează trei linii: rezumatul tuturor cutiilor, rezumatul pentru nicio cutie și rezumatul doar pentru prima și ultima cutie

**cutii** are între 1 și 20 de cutii, fiecare de la 1 la 500 kg

**Exemplu** pentru cutii = [10, 25, 10]

```text
cutii 3, total 45 kg, cea mai grea 25 kg
cutii 0, total 0 kg, cea mai grea 0 kg
cutii 2, total 20 kg, cea mai grea 10 kg
```

Când lista are o singură cutie, ea e și prima, și ultima, așa că a treia linie o numără de două ori
