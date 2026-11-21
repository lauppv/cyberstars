Put together inheritance, `super()`, overriding methods, comparing objects and dataclasses

---

## Mission: Fleet Registry

The station keeps a registry of every ship that docks. All ships have a speed and a name. Cargo ships also carry a number of tons, and they describe themselves with it

1. Write a dataclass **Ship** with `order=True`, the fields `speed` (a whole number) and `name` (a string), in this order, and a method **describe()** that returns `name (speed)`
2. Write a dataclass **CargoShip** that inherits from `Ship`, adds a field `tons` (a whole number), and overrides **describe()**: it returns the parent's description with `, tons` and the tons added, using `super()`
3. Start your program with a variable **ships**, a list of strings. Each string is a name and a speed, like `"Hope 12"`, or for a cargo ship a name, a speed and tons, like `"Mule 8 300"`. For example `ships = ["Hope 12", "Mule 8 300", "Swift 30", "Ox 8 500"]`
4. Make a `Ship` or a `CargoShip` from each string, and print the description of each, sorted from the slowest to the fastest. Ships with the same speed go in the order of their names. Give `sorted()` a `key`: dataclasses compare only objects of the same class, so a `Ship` and a `CargoShip` can't be compared by `<` alone
5. Print `Fastest: ` and the name of the ship sorted last
6. Print `Cargo: ` and the tons of all the cargo ships added up, found with `isinstance()`

**ships** has from 1 to 10 ships, with different names of one word and speeds from 1 to 50. Tons are from 1 to 1000

**Example** for the ships above

```text
Mule (8), tons 300
Ox (8), tons 500
Hope (12)
Swift (30)
Fastest: Swift
Cargo: 800
```
