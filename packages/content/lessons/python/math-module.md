The `+`, `-`, `*`, `/` and `**` operators cover a lot, but not everything. Square roots, pi, or rounding always up need the module `math`

---

`math` gives us constants like pi and functions like the square root

```py
import math

print(math.pi)
print(math.sqrt(81))
print(math.sqrt(2))
```

Output

```text
3.141592653589793
9.0
1.4142135623730951
```

`math.sqrt()` always gives back a number with a dot, even for 81. To show fewer decimals, use a format spec, like `f"{math.sqrt(2):.3f}"`

---

`round()` goes to the nearest whole number. Sometimes we need to always go down, or always go up. `math.floor()` goes down, `math.ceil()` goes up

```py
import math

print(math.floor(7.9))
print(math.ceil(7.1))
print(math.ceil(8.0))
```

Output

```text
7
8
8
```

`ceil()` is perfect for "how many do we need" questions. For 41 people and buses with 20 seats each, we need `math.ceil(41 / 20)`, which is 3 buses, not 2.05

---

`math.hypot(x, y)` gives the straight distance from the point (0, 0) to the point (x, y). It's the square root of `x * x + y * y`, the rule of Pythagoras

```py
import math

print(math.hypot(3, 4))
print(math.sqrt(3 * 3 + 4 * 4))
```

Output

```text
5.0
5.0
```

---

Numbers with a dot are not always exact in a computer, as we saw with 0.1. So we shouldn't compare them with `==`. `math.isclose()` tells us if two numbers are equal or almost equal

```py
import math

print(0.1 + 0.2 == 0.3)
print(math.isclose(0.1 + 0.2, 0.3))
```

Output

```text
False
True
```

---

## Mission: Orbit Planner

A ship sits at a point of the map, with the station at (0, 0). From there it will fly once around the station, on a circle

1. Start your program with three variables: **x** and **y**, the ship's position, and **radius**, the radius of the circle. All three are whole numbers of kilometers. For example `x = 300`, `y = 400` and `radius = 1000`
2. Print `Distance: ` and the straight distance from the ship to the station, with 2 decimals, then ` km`
3. Print `Orbit: ` and the length of the circle, which is 2 times pi times the radius, with 2 decimals, then ` km`
4. Print `Fuel cells: ` and how many fuel cells the ship needs for one orbit. One cell lasts for 500 km, and the ship can't take part of a cell

Use the module `math`. **x** and **y** are from -10,000 to 10,000, and **radius** from 1 to 50,000

**Example** for x = 300, y = 400 and radius = 1000

```text
Distance: 500.00 km
Orbit: 6283.19 km
Fuel cells: 13
```
