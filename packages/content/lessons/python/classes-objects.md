So far we kept a ship's data in a dictionary: `{"name": "Hope", "speed": 12}`. A **class** is a better home for it. It's a plan for a kind of thing, and from one plan we can make many **objects**, each with its own data

---

`class`, a name, and a colon make a class. Class names start with a capital letter, by habit. `pass` means "nothing here yet"

```py
class Ship:
    pass

hope = Ship()
swift = Ship()
print(type(hope))
print(hope is swift)
```

Output

```text
<class '__main__.Ship'>
False
```

`Ship()`, with brackets, makes a new object from the class, like calling a function. `hope` and `swift` are two different objects of the same kind. `__main__` is just the name Python gives to our program

---

An object can hold values, called **attributes**. We set and read them with a dot

```py
class Ship:
    pass

hope = Ship()
hope.name = "Hope"
hope.speed = 12

swift = Ship()
swift.name = "Swift"
swift.speed = 30

print(hope.name, hope.speed)
print(swift.name, swift.speed)
```

Output

```text
Hope 12
Swift 30
```

Each object keeps its own attributes. Changing `swift.speed` leaves `hope.speed` alone

---

Objects can go anywhere a value can: in a variable, in a list, into a function

```py
class Ship:
    pass

def make_ship(name, speed):
    ship = Ship()
    ship.name = name
    ship.speed = speed
    return ship

fleet = [make_ship("Hope", 12), make_ship("Swift", 30)]
for ship in fleet:
    print(f"{ship.name} flies at {ship.speed}")
```

Output

```text
Hope flies at 12
Swift flies at 30
```

---

Reading an attribute an object doesn't have stops the program with an AttributeError

```py
class Ship:
    pass

hope = Ship()
try:
    print(hope.crew)
except AttributeError:
    print("hope has no crew yet")
```

Output

```text
hope has no crew yet
```

In the next lesson we see how to give every object its attributes right when it's made, so none is ever missing

---

## Mission: Fleet Records

The dock keeps a record of every ship that lands. The records used to be dictionaries, and now they become objects

1. Write a class **Ship**
2. Start your program with two variables: **names**, a list of strings, and **speeds**, a list of whole numbers, in the same order. For example `names = ["Hope", "Swift", "Bob"]` and `speeds = [12, 30, 5]`
3. Make one `Ship` object for each name, with the attributes `name` and `speed`, and keep them in a list
4. Using the objects, print one line for each ship: the name, `: ` and the speed
5. Print `Fastest: ` and the name of the fastest ship, the first one if several are as fast

The two lists have the same length, from 1 to 10 ships

**Example** for the values above

```text
Hope: 12
Swift: 30
Bob: 5
Fastest: Swift
```
