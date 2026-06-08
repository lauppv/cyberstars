Cunoaștem deja **listele**. O listă poate crește, se poate micșora și se poate schimba — putem **adăuga** (append), **elimina** (remove) și **modifica** elemente oricând vrem. Dar uneori vrem o colecție care **nu se poate schimba**. Aceasta este un **tuple**

```py
coordinates = (10, 20)
print(coordinates)
```

Rezultat **(10, 20)**

Un tuple arată ca o listă, dar cu **paranteze rotunde ()** în loc de **paranteze pătrate []**. Marea diferență? **Nu îl putem modifica** după creare

```py
coordinates = (10, 20)
coordinates[0] = 99
```

**Rulează**-l. Python va țipa la noi cu o **TypeError**: 'tuple' object does not support item assignment. Cu alte cuvinte: „nu mă poți schimba" :)

---

De ce am vrea vreodată ceva ce nu putem schimba? Ei bine, uneori ăsta e tot rostul. Gândește-te la o dată de naștere. **Tommy Vercetti s-a născut într-o anumită zi**. Acea dată nu ar trebui să se schimbe niciodată. Dacă scriem din greșeală cod care încearcă să o modifice, **vrem** ca Python să ne oprească

```py
birthday = (1951, 7, 15)
print(birthday)
```

Alt exemplu: coordonate GPS. **Vice City se află într-o locație fixă**. Nu se mișcă

```py
viceCity = (25.7617, -80.1918)
print(viceCity)
```

---

**Putem** citi elemente dintr-un tuple, exact ca dintr-o listă, folosind un **index**

```py
player = ("Tommy Vercetti", 100, "Vice City")
print(player[0])
print(player[1])
print(player[2])
```

Rezultat

```text
Tommy Vercetti
100
Vice City
```

Și **len()** funcționează

```py
player = ("Tommy Vercetti", 100, "Vice City")
print(len(player))
```

Rezultat **3**

---

Unul dintre cele mai mișto lucruri legate de tuple-uri este **despachetarea** (unpacking). În loc să folosim indecși, putem apuca toate valorile dintr-o dată

```py
player = ("Tommy Vercetti", 100, "Vice City")

nume, health, oras = player
print(nume)
print(health)
print(oras)
```

Rezultat

```text
Tommy Vercetti
100
Vice City
```

Am creat **trei variabile** într-o singură linie. Python a luat primul element și l-a pus în **nume**, al doilea în **health**, al treilea în **oras**. Numărul de variabile din stânga **trebuie să corespundă** cu numărul de elemente din tuple

```py
a, b = (10, 20)
print(a)
print(b)
```

Rezultat

```text
10
20
```

Aceasta este aceeași **despachetare** pe care am văzut-o la **.items()** când parcurgeam dicționare. Acum știi de unde vine :)

---

Putem și **parcurge** (loop) un tuple, exact ca o listă

```py
heroes = ("Shrek", "Fiona", "Donkey")
for hero in heroes:
    print(hero)
```

Rezultat

```text
Shrek
Fiona
Donkey
```

---

## Misiune: Harta Stelară

Calculatorul de navigație al stației stochează fiecare sistem stelar ca un **tuple** de `(nume, distance, planets)`. Ai o listă cu ele (deja în dreapta).

1. Parcurge lista și **despachetează** (unpack) fiecare tuple în trei variabile: `nume`, `distance`, `planets`
2. Afișează fiecare sistem ca `nume: distance al, planets planete` — de exemplu `Sol: 0 al, 8 planete`
3. După buclă, afișează `Total planete: ` apoi suma tuturor planetelor

**Rezultat**

```text
Sol: 0 al, 8 planete
Alpha: 4 al, 3 planete
Vega: 25 al, 5 planete
Total planete: 16
```
