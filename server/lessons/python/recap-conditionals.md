Combine **if/else**, **if/elif/else**, and **comments**

---

## Mission: Ticket Booth

Build a **ticket price calculator** for the station's cinema. The customer's `age` and whether it's a `is_3d` movie are set at the top of your code.

Base price by age:

- under **6** → **0 EUR** (free)
- **6 to 12** → **5 EUR**
- **13 to 17** → **8 EUR**
- **18 to 64** → **12 EUR**
- **65 and over** → **6 EUR** (senior discount)

Print the base price like `Base price: 8 EUR`. If `is_3d` is True, add **3 EUR** to the total and also print `3D surcharge: 3 EUR`. Finally print the total like `Total: 11 EUR` (if it's not 3D, the total is just the base price).

**Input** (already set at the top of your code — change the values to test):

- `age` — the customer's age
- `is_3d` — `True` for a 3D movie

**Example**

With `age = 15` and `is_3d = True`, your program should print

```text
Base price: 8 EUR
3D surcharge: 3 EUR
Total: 11 EUR
```

Now set `age = 70` and `is_3d = False` and run again

```text
Base price: 6 EUR
Total: 6 EUR
```
