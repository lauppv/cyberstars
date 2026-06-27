Combine **for and while loops**, **break / continue**, and **conditions**

---

## Mission: Collection Run

Tommy is doing his collection run across Vice City. The shops on the strip are numbered from **1** up to a total, and he visits them one by one, in increasing order. Each shop pays an amount equal to its number (shop 1 pays 1, shop 2 pays 2, and so on).

Two things can ruin his run:

- one shop is **closed** today — skip it with **continue** (he collects nothing there) and move on
- at one shop the **police are waiting** — stop the whole run immediately with **break** and collect nothing at that shop

Store the total number of shops, the closed shop, and the shop where the police wait. Then use a loop that goes through the shops from **1** to the total. For each shop he actually collects from, print `Shop N` (where **N** is the shop number) and add the amount to a running total. At the end, print `Total: X`.

**Example** for **6** shops, with the closed shop **3** and police at shop **5**:

```text
Shop 1
Shop 2
Shop 4
Total: 7
```

(Shop 3 is skipped, and at shop 5 he stops, so 6 is never reached. The total is 1 + 2 + 4 = 7.)

**Example** for **4** shops, with closed **10** and police at **10** (neither shows up, the run goes to the end):

```text
Shop 1
Shop 2
Shop 3
Shop 4
Total: 10
```

**Example** for **6** shops, with closed **2** and police at shop **1** (he stops on the first, collecting nothing):

```text
Total: 0
```
