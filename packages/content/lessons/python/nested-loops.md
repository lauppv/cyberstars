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

## Printing on the same line with end=""

So far, every **print()** automatically moved to a new line after printing. We can change that with **end**

```py
print("a", end="")
print("b", end="")
print("c")
```

Prints

```text
abc
```

Normally, the three **print()** calls would put **a**, **b**, and **c** on separate lines. With **end=""** we tell **print** "don't move to a new line, leave the cursor right here". The last **print("c")** has no **end=""**, so after it we do drop to the next line

This gets powerful together with nested loops: we can draw a shape **row by row**

```py
for row in range(3):
    for star in range(3):
        print("*", end="")
    print()
```

Prints

```text
***
***
***
```

Let's trace what happens:

- the outer loop starts with **row = 0**
- the inner loop prints `*` three times, all on the same line thanks to **end=""** → `***`
- after the inner loop, **print()** alone (empty) drops to the next line
- the outer loop continues with **row = 1**, then **row = 2**, and it all repeats

The inner loop draws one full row, and the **print()** at the end drops to the next row

---

## Mission: Signal Tower

Build a tower of stars for the station's antenna. **Read** from the user how many rows the tower has, then print a triangle: the first row has **1** star, the second **2**, the third **3**, and so on down to the last row

**Example**

If the user types

```text
5
```

the program prints

```text
*
**
***
****
*****
```
