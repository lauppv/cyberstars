Combine **interfaces**, **enums**, and **instanceof / casting**

---

## Mission: Tommy's Empire

Tommy wants an inventory of his Vice City empire. He has two types of assets — businesses and vehicles. Each asset has a name, a dollar value, and a status from a fixed set of options. Vehicles also have a top speed

Build the system: a common interface `Asset` (method `display()`) that both types implement, an enum `Status` for statuses, and the classes `Business` (name, value, status) and `Vehicle` (name, value, status, topSpeed).

In `main`, store each asset's data in variables — `name1`/`value1` for the first business, `name2`/`value2`/`speed2` for the first vehicle, `name3`/`value3` for the second business, `name4`/`value4`/`speed4` for the second vehicle. Put them in an `Asset[]` array (a `Business` from `name1`/`value1`, a `Vehicle` from `name2`/`value2`/`speed2`, and so on — the statuses are `ACTIVE`, `ACTIVE`, `RENOVATION`, `CLOSED`), iterate through it, and print the information. For vehicles, use `instanceof` to also show the top speed.

For example, Malibu Club is an active business worth $120000, Infernus is an active vehicle worth $150000 with a top speed of 240 km/h, Print Works is under renovation ($70000), and Cheetah is a closed vehicle worth $110000 with 230 km/h

**Example**

```text
Malibu Club - $120000 - active
Infernus - $150000 - active
Top speed: 240 km/h
Print Works - $70000 - renovation
Cheetah - $110000 - closed
Top speed: 230 km/h
```
