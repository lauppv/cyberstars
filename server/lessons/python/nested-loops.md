We already know what a **for** loop does. But what happens if we put a **loop inside another loop**? This is called a **nested loop** and it's one of those things that seems confusing at first but becomes second nature once you see it in action

Let's start simple. We want to display all combinations of two dice rolls

```py
for die1 in range(1, 7):
    for die2 in range(1, 7):
        print(f"{die1} {die2}")
```

This will print **36 lines**: (1,1), (1,2), ..., (1,6), (2,1), (2,2), ... all the way to (6,6)

How does it work? The **outer loop** starts with **die1 = 1**. Then the **inner loop** runs completely from **die2 = 1** to **die2 = 6**. After the inner loop finishes, the outer loop moves to **die1 = 2**, and the inner loop runs again from scratch. And so on

Think of it like a clock: the **inner loop** is the minute hand (goes fast, full rotation), the **outer loop** is the hour hand (moves only after the minute hand completes a full cycle)

---

A very common use: displaying a **multiplication table**

```py
for i in range(1, 6):
    for j in range(1, 6):
        print(f"{i} x {j} = {i * j}")
    print("---")
```

The **print("---")** is inside the outer loop but **outside** the inner loop, so it prints after each "row" of multiplications. Pay attention to the **indentation**, it matters a lot here

---

We can also use nested loops with **lists**

```py
teams = ["Sharks", "Bears"]
players = ["Tommy", "Lance", "Cortez"]

for team in teams:
    for player in players:
        print(f"{player} plays for {team}")
```

Output

```text
Tommy plays for Sharks
Lance plays for Sharks
Cortez plays for Sharks
Tommy plays for Bears
Lance plays for Bears
Cortez plays for Bears
```

Every player gets paired with every team. The outer loop picks a team, and the inner loop goes through all players for that team

---

**break** inside a nested loop only stops the **inner** loop, not the outer one

```py
for i in range(1, 4):
    for j in range(1, 4):
        if j == 2:
            break
        print(f"{i} {j}")
```

Output

```text
1 1
2 1
3 1
```

When **j** hits **2**, **break** stops the inner loop, but the outer loop keeps going to the next **i**

---

## Mission: Signal Tower

Build a tower of stars for the station's antenna. **Read** a number `rows`, then print a right triangle where the first row has **1** star, the second has **2**, and so on, down to `rows` rows.

The outer loop controls the **row**, and the inner loop prints the right number of **stars** for that row. Use `print("*", end="")` to print a star **without** moving to a new line, then `print()` alone after the inner loop to go to the next line.

**Input** (typed by the user when the program runs):

- `rows` — how many rows the tower has

**Example**

If the user types

```text
5
```

the program should print

```text
*
**
***
****
*****
```
