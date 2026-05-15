Combine **inheritance**, **overriding methods**, **polymorphism**, and **abstract classes**

---

Build a **vehicle fleet** system. Create an **abstract** class **Vehicle** with:

- Fields: **name** (String), **fuelLevel** (int, starts at 100)
- Constructor takes name
- **abstract String type()** — each subclass returns its type
- **void drive(int km)** — reduces fuel by km * fuelCost(). If not enough fuel, print "Not enough fuel!"
- **abstract int fuelCost()** — fuel used per km (different for each vehicle)
- **toString()** — returns "name (type) - Fuel: X%"

Create three subclasses:
- **Car** — fuelCost = 2, type = "Car"
- **Truck** — fuelCost = 5, type = "Truck"
- **Motorcycle** — fuelCost = 1, type = "Motorcycle"

In main, create one of each. Drive them using **polymorphism** (store in a Vehicle array):

```java
Vehicle[] fleet = {
    new Car("BMW"),
    new Truck("Volvo"),
    new Motorcycle("Harley")
};

for (Vehicle v : fleet) {
    v.drive(15);
}

fleet[1].drive(20);

for (Vehicle v : fleet) {
    System.out.println(v);
}
```

Expected output
```text
Not enough fuel!
BMW (Car) - Fuel: 70%
Volvo (Truck) - Fuel: 25%
Harley (Motorcycle) - Fuel: 85%
```

Volvo: 100 - 15*5 = 25, then tries 20*5 = 100 > 25 → "Not enough fuel!"
