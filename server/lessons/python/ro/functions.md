Așa cum am menționat într-o lecție anterioară, nu este o idee bună să **repetăm** cod. Dacă trebuie să scriem același lucru de două ori, șansele sunt că va trebui să-l scriem de trei ori sau **mai mult**. Aici intervine noțiunea de **funcție**. O **funcție** este o bucată de cod pe care o scriem **o dată** și o putem refolosi de **mai multe** ori

```py
nume = "Cortez"
varsta = 60

i = 0
for i in range(0, 11):
    print(f"Ma numesc {nume} si am varsta {varsta}")
```

Ieșire:

```text
Ma numesc Cortez si am varsta 60
Ma numesc Cortez si am varsta 60
Ma numesc Cortez si am varsta 60
Ma numesc Cortez si am varsta 60
Ma numesc Cortez si am varsta 60
Ma numesc Cortez si am varsta 60
Ma numesc Cortez si am varsta 60
Ma numesc Cortez si am varsta 60
Ma numesc Cortez si am varsta 60
Ma numesc Cortez si am varsta 60
```

Ce se întâmplă dacă vrem să afișăm același lucru, dar cu _Tommy Vercetti_ și vârsta _42_? Bineînțeles, putem schimba valorile variabilelor

```py
nume = "Tommy Vercetti"
varsta = 42

i = 0
for i in range(0, 11):
    print(f"Ma numesc {nume} si am varsta {varsta}")
```

Ieșire:

```text
Ma numesc Tommy Vercetti si am varsta 42
Ma numesc Tommy Vercetti si am varsta 42
Ma numesc Tommy Vercetti si am varsta 42
Ma numesc Tommy Vercetti si am varsta 42
Ma numesc Tommy Vercetti si am varsta 42
Ma numesc Tommy Vercetti si am varsta 42
Ma numesc Tommy Vercetti si am varsta 42
Ma numesc Tommy Vercetti si am varsta 42
Ma numesc Tommy Vercetti si am varsta 42
Ma numesc Tommy Vercetti si am varsta 42
```

și asta e în regulă

Totuși, dacă vrem să folosim această bucată de cod **mai târziu** în program cu **valori diferite pentru nume și varsta**, ar trebui mereu să **copiem și să lipim** această buclă **for**

Se dovedește că cel mai bun mod, și cel care face codul cel mai **lizibil**, este să folosim o **funcție**

```py
def functia_mea(nume, varsta):
    i = 0
    for i in range(0, 11):
        print(f"Ma numesc {nume} si am varsta {varsta}")

functia_mea("Cortez", 60)
functia_mea("Tommy Vercetti", 42)
functia_mea("Lance Vance Dance", 35)
```

Putem vedea cum codul nostru este mult mai **curat** și mai **ușor** de citit. Ce am făcut a fost să **refolosim** **funcția** numită **my_function** și să o apelăm cu valori diferite. Am scris funcția **o dată** și o putem rula de câte ori vrem cu valori diferite

Cuvântul **def** definește o **funcție** în Python

**my_function** este **numele** funcției, adică numele pe care îl folosim pentru a **apela** această funcție

La fel ca **print()**, folosim paranteze **()**

În interiorul parantezelor, scriem cum vrem să numim parametrii. În acest caz, **nume** și **varsta**

Ține minte că **numele parametrilor pot fi orice**. Codul de mai jos funcționează la fel de bine

```py
def functia_mea(n, a):
    i = 0
    for i in range(0, 11):
        print(f"Ma numesc {n} si am varsta {a}")

functia_mea("Cortez", 60)
functia_mea("Tommy Vercetti", 42)
functia_mea("Lance Vance Dance", 35)
```

După ce numim o funcție, trebuie să punem un **:**

Un alt exemplu de funcție ar putea fi

```py
def f(nume, stare):
    if(stare == True):
        print(f"{nume} este online")
    else:
        print(f"{nume} este offline")

nume = "Admin"
este_online = True
f(nume, este_online) # afiseaza Admin este online

este_online = False
f(nume, este_online) # afiseaza admin este offline
```

---

## Misiune: Calculatorul de la Bord

Stația are nevoie de un calculator de bord. Scrie o funcție care primește două numere și un operator (`+`, `-`, `*`, `/`) și afișează operația cu rezultatul ei. Dacă operatorul nu este unul dintre cele patru, afișează `Operator invalid`.

**Exemple de intrare și ieșire**

- `calculator(14, 12, "+")` afișează `14 + 12 = 26`
- `calculator(20, 8, "-")` afișează `20 - 8 = 12`
- `calculator(6, 7, "*")` afișează `6 * 7 = 42`
- `calculator(20, 4, "/")` afișează `20 / 4 = 5.0`
- `calculator(5, 2, "%")` afișează `Operator invalid`
