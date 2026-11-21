Until now we gave a function its values in order: the first value goes to the first parameter, the second to the second. Python also lets us name the parameter we give a value to. This is a **keyword argument**

---

Here is a function with three parameters

```py
def describe(planet, moons, rings):
    print(f"{planet}: {moons} moons, rings: {rings}")

describe("Saturn", 146, True)
describe(planet="Saturn", moons=146, rings=True)
describe(rings=True, planet="Saturn", moons=146)
```

Output

```text
Saturn: 146 moons, rings: True
Saturn: 146 moons, rings: True
Saturn: 146 moons, rings: True
```

All three calls do the same thing. With names, the order doesn't matter anymore: Python puts each value in the parameter with that name

---

Why name them? Look at this call: `describe("Saturn", 146, True)`. What is 146? What is True? We have to go back to the function to find out. `describe(planet="Saturn", moons=146, rings=True)` tells us right there. Names make a call easier to read, most of all when a function has many parameters or takes `True` and `False`

---

We can mix the two ways. The values in order come first, then the ones with names

```py
def describe(planet, moons, rings):
    print(f"{planet}: {moons} moons, rings: {rings}")

describe("Mars", rings=False, moons=2)
```

Output

```text
Mars: 2 moons, rings: False
```

The other way round is not allowed. `describe(planet="Mars", 2, False)` stops with a SyntaxError, because after a name Python can't tell where a value without a name should go

---

Keyword arguments work best with default values, which we met in Default Parameters. We can skip any parameter that has a default, and name only the ones we want to change

```py
def order(item, count=1, express=False):
    speed = "express" if express else "normal"
    print(f"{count} x {item}, {speed}")

order("battery")
order("battery", express=True)
order("cable", count=3)
```

Output

```text
1 x battery, normal
1 x battery, express
3 x cable, normal
```

In the second call we skip `count` and still change `express`. Without names that's not possible: the second value in order would go to `count`

---

## Mission: Booking Desk

The station's shuttle has a booking desk. A booking has a passenger, a destination, a number of seats and a window seat or not

1. Write a function **book(name, destination, seats=1, window=False)** that returns a line like `Ada -> Mars, seats 2, window`. Leave out `, window` when `window` is False
2. Start your program with four variables: **name** and **destination**, two strings, **seats**, a whole number, and **window**, True or False. For example `name = "Ada"`, `destination = "Mars"`, `seats = 2` and `window = True`
3. Print the booking for these four values. Call `book()` with keyword arguments, in any order you like
4. Print a second booking for the same person to `Moon`, with the default seats and window. Give only the values that change

`seats` is from 1 to 9

**Example** for the values above

```text
Ada -> Mars, seats 2, window
Ada -> Moon, seats 1
```
