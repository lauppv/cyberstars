Operatorii `+`, `-`, `*`, `/` și `**` acoperă multe, dar nu tot. Rădăcinile pătrate, pi sau rotunjirea mereu în sus au nevoie de modulul `math`

---

`math` ne dă constante ca pi și funcții ca rădăcina pătrată

```py
import math

print(math.pi)
print(math.sqrt(81))
print(math.sqrt(2))
```

Rezultat

```text
3.141592653589793
9.0
1.4142135623730951
```

`math.sqrt()` dă mereu înapoi un număr cu punct, chiar și pentru 81. Ca să arăți mai puține zecimale, folosește un format, ca `f"{math.sqrt(2):.3f}"`

---

`round()` merge la cel mai apropiat număr întreg. Uneori trebuie să mergem mereu în jos sau mereu în sus. `math.floor()` merge în jos, `math.ceil()` merge în sus

```py
import math

print(math.floor(7.9))
print(math.ceil(7.1))
print(math.ceil(8.0))
```

Rezultat

```text
7
8
8
```

`ceil()` e perfect pentru întrebări de tipul „de câte avem nevoie”. Pentru 41 de oameni și autobuze cu câte 20 de locuri, ne trebuie `math.ceil(41 / 20)`, adică 3 autobuze, nu 2.05

---

`math.hypot(x, y)` dă distanța în linie dreaptă de la punctul (0, 0) la punctul (x, y). E rădăcina pătrată din `x * x + y * y`, regula lui Pitagora

```py
import math

print(math.hypot(3, 4))
print(math.sqrt(3 * 3 + 4 * 4))
```

Rezultat

```text
5.0
5.0
```

---

Numerele cu punct nu sunt mereu exacte într-un calculator, cum am văzut la 0.1. Așa că nu ar trebui să le comparăm cu `==`. `math.isclose()` ne spune dacă două numere sunt egale sau aproape egale

```py
import math

print(0.1 + 0.2 == 0.3)
print(math.isclose(0.1 + 0.2, 0.3))
```

Rezultat

```text
False
True
```

---

## Misiune: Planificatorul de orbită

O navă stă într-un punct de pe hartă, cu stația în (0, 0). De acolo va zbura o dată în jurul stației, pe un cerc

1. Începe programul cu trei variabile: **x** și **y**, poziția navei, și **raza**, raza cercului. Toate trei sunt numere întregi de kilometri. De exemplu `x = 300`, `y = 400` și `raza = 1000`
2. Afișează `Distanta: ` și distanța în linie dreaptă de la navă la stație, cu 2 zecimale, apoi ` km`
3. Afișează `Orbita: ` și lungimea cercului, adică 2 ori pi ori raza, cu 2 zecimale, apoi ` km`
4. Afișează `Celule de combustibil: ` și de câte celule de combustibil are nevoie nava pentru o orbită. O celulă ține 500 km, iar nava nu poate lua o bucată de celulă

Folosește modulul `math`. **x** și **y** sunt de la -10000 la 10000, iar **raza** de la 1 la 50000

**Exemplu** pentru x = 300, y = 400 și raza = 1000

```text
Distanta: 500.00 km
Orbita: 6283.19 km
Celule de combustibil: 13
```
