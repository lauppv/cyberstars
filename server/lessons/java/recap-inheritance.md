Combine **inheritance**, **overriding methods**, **polymorphism**, and **abstract classes**

---

## Mission: Shuttle Fleet Management

The station's docking bay manages a mixed fleet of vehicles for surface missions. Each vehicle type burns fuel at a different rate. Build an abstract Vehicle system so the fleet can be managed polymorphically.

Create an **abstract** class **`Vehicle`** with:

- Fields: `name` (String), `fuelLevel` (int, starts at 100)
- Constructor takes name
- **`abstract String type()`** — each subclass returns its type
- **`void drive(int km)`** — reduces fuel by `km * fuelCost()`. If not enough fuel, print `"Not enough fuel!"`
- **`abstract int fuelCost()`** — fuel used per km (different for each vehicle)
- **`toString()`** — returns `"name (type) - Fuel: X%"`

Create three subclasses:

- **Car** — fuelCost = 2, type = `"Car"`
- **Truck** — fuelCost = 5, type = `"Truck"`
- **Motorcycle** — fuelCost = 1, type = `"Motorcycle"`

The fleet array and drive calls in main are already on the right. Volvo: 100 - 15*5 = 25, then tries 20*5 = 100 > 25, so it prints "Not enough fuel!"

**Output**

```text
Not enough fuel!
BMW (Car) - Fuel: 70%
Volvo (Truck) - Fuel: 25%
Harley (Motorcycle) - Fuel: 85%
```
