Cunoaștem deja **listele**. O listă poate crește, se poate micșora și se poate schimba — putem **adăuga** (append), **elimina** (remove) și **modifica** elemente oricând vrem. Dar uneori vrem o colecție care **nu se poate schimba**. Aceasta este un **tuple**

```py
coordonate = (10, 20)
print(coordonate)
```

Rezultat **(10, 20)**

Un tuple arată ca o listă, dar cu **paranteze rotunde ()** în loc de **paranteze pătrate []**. Marea diferență? **Nu îl putem modifica** după creare

```py
coordonate = (10, 20)
coordonate[0] = 99
```

**Rulează**-l. Python va țipa la noi cu o **TypeError**: 'tuple' object does not support item assignment. Cu alte cuvinte: „nu mă poți schimba"

---

De ce am vrea vreodată ceva ce nu putem schimba? Ei bine, uneori ăsta e tot rostul. Gândește-te la o dată de naștere. **Tommy Vercetti s-a născut într-o anumită zi**. Acea dată nu ar trebui să se schimbe niciodată. Dacă scriem din greșeală cod care încearcă să o modifice, **vrem** ca Python să ne oprească

```py
zi_de_nastere = (1951, 7, 15)
print(zi_de_nastere)
```

Alt exemplu: coordonate GPS. **Vice City se află într-o locație fixă**. Nu se mișcă

```py
vice_city = (25.7617, -80.1918)
print(vice_city)
```

---

**Putem** citi elemente dintr-un tuple, exact ca dintr-o listă, folosind un **index**

```py
jucator = ("Tommy Vercetti", 100, "Vice City")
print(jucator[0])
print(jucator[1])
print(jucator[2])
```

Ieșire

```text
Tommy Vercetti
100
Vice City
```

Și **len()** funcționează

```py
jucator = ("Tommy Vercetti", 100, "Vice City")
print(len(jucator))
```

Rezultat **3**

---

Unul dintre cele mai mișto lucruri legate de tuple-uri este **despachetarea** (unpacking). În loc să folosim indecși, putem apuca toate valorile dintr-o dată

```py
jucator = ("Tommy Vercetti", 100, "Vice City")

nume, viata, oras = jucator
print(nume)
print(viata)
print(oras)
```

Ieșire

```text
Tommy Vercetti
100
Vice City
```

Am creat **trei variabile** într-o singură linie. Python a luat primul element și l-a pus în **nume**, al doilea în **viata**, al treilea în **oras**. Numărul de variabile din stânga **trebuie să corespundă** cu numărul de elemente din tuple

```py
a, b = (10, 20)
print(a)
print(b)
```

Ieșire

```text
10
20
```

Aceasta este aceeași **despachetare** pe care am văzut-o la **.items()** când parcurgeam dicționare. Acum știi de unde vine

---

Putem și **parcurge** (loop) un tuple, exact ca o listă

```py
eroi = ("Shrek", "Fiona", "Donkey")
for erou in eroi:
    print(erou)
```

Ieșire

```text
Shrek
Fiona
Donkey
```

---

## Misiune: Harta Stelară

Calculatorul de navigație al stației stochează fiecare sistem stelar ca un **tuple** de `(nume, distanta, planete)`

1. Parcurge lista și **despachetează** (unpack) fiecare tuple în trei variabile: `nume`, `distanta`, `planete`
2. Afișează fiecare sistem ca `nume: distanta al, planete planete` — de exemplu `Sol: 0 al, 8 planete` (`al` = ani-lumină)
3. După buclă, afișează `Total planete: ` apoi suma tuturor planetelor

**Ieșire**

```text
Sol: 0 al, 8 planete
Alpha: 4 al, 3 planete
Vega: 25 al, 5 planete
Total planete: 16
```
