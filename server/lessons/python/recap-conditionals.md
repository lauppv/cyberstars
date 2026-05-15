Combine **if/else**, **if/elif/else**, and **comments**

---

Build a **ticket price calculator** for a cinema. The rules:

- **Under 6** years old: **free** (0 EUR)
- **6 to 12**: **5 EUR**
- **13 to 17**: **8 EUR**
- **18 to 64**: **12 EUR**
- **65 and over**: **6 EUR** (senior discount)

Additionally, if it's a **3D movie** (boolean), add **3 EUR** to the price

Given these variables:
```python
age = 15
is_3d = True
```

Calculate and print the result

Expected output
```text
Base price: 8 EUR
3D surcharge: 3 EUR
Total: 11 EUR
```

If the movie is NOT 3D, don't print the surcharge line — just the base price and total (which would be the same)
