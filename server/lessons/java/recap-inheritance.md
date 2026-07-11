Combine **inheritance**, **overriding methods**, **polymorphism**, and **abstract classes**

---

## Mission: Tommy's Fleet

Tommy has a mixed fleet in his Vice City garages — sports cars, trucks, motorcycles. Each type burns fuel at a different rate. Build an abstract `Vehicle` system so the whole fleet can be managed the same way, no matter the type.

Create an **abstract** class `Vehicle` with:

- Fields: `name` (String), `fuel` (int, starts at `100`)
- Constructor takes the name
- **`abstract String type()`** — each subclass returns its type
- **`abstract int fuelPerKm()`** — fuel burned per km (different for each vehicle)
- **`void drive(int km)`** — reduces fuel by `km * fuelPerKm()`. If there isn't enough fuel, print `"Not enough fuel!"` and change nothing
- **`toString()`** — returns `"name (type) - Fuel: X%"`

Then create three concrete subclasses:

- `SportsCar` — `fuelPerKm()` returns `2`, `type()` returns `"SportsCar"`
- `Truck` — `fuelPerKm()` returns `5`, `type()` returns `"Truck"`
- `Motorcycle` — `fuelPerKm()` returns `1`, `type()` returns `"Motorcycle"`

In `main`, store the three vehicle names in `name1`, `name2`, `name3` and the four driving distances in `km1`, `km2`, `km3`, `km4`. Put a `SportsCar` (from `name1`), a `Truck` (from `name2`), and a `Motorcycle` (from `name3`) in a `Vehicle[]` array, then drive: the first vehicle `km1`, the second `km2`, the second again `km3`, and the third `km4`. Finally print each one. The distances are chosen so the second vehicle's second drive can force a `"Not enough fuel!"`.

**Example**

With a `SportsCar` "Infernus" driven 15 km, a `Truck` "Linerunner" driven 15 km and then another 20 km (not enough left: `20*5 = 100 > 25`), and a `Motorcycle` "Angel" driven 15 km, you'd get:

```text
Not enough fuel!
Infernus (SportsCar) - Fuel: 70%
Linerunner (Truck) - Fuel: 25%
Angel (Motorcycle) - Fuel: 85%
```
