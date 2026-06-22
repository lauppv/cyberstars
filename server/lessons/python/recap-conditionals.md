Combine **if/elif/else**, **booleans**, and **math operations**

---

## Mission: Ticket Booth

Build a **ticket price calculator** for the station's cinema.

A ticket has a standard price of 10 EUR (the full price, without any discount). Based on the customer's age, discounts may apply:

- under **6** → discount **10 EUR** (free)
- **6 to 12** → discount **5 EUR**
- **13 to 17** → discount **3 EUR**
- **18 to 64** → discount **0 EUR**
- **65 and over** → discount **4 EUR**

If the movie is 3D, a **2 EUR** fee is added

You must print the final ticket price

**Example**

For an **8-year-old** customer at a **3D** movie, your program should print

```text
Standard price: 10 EUR
Discount: 5 EUR
3D fee: 2 EUR
Total: 7 EUR
```

(10 − 5 = 5, plus 2 EUR for 3D, so 7 EUR)

Now try a **30-year-old** customer at a movie that is **not 3D**

```text
Standard price: 10 EUR
Discount: 0 EUR
Total: 10 EUR
```

Or a **70-year-old** customer at a **3D** movie

```text
Standard price: 10 EUR
Discount: 4 EUR
3D fee: 2 EUR
Total: 8 EUR
```

And a **4-year-old** customer at a movie that is **not 3D**

```text
Standard price: 10 EUR
Discount: 10 EUR
Total: 0 EUR
```
