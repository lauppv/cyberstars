We have a list of names. We want to greet each one of them. We could do

```py
names = ["Tommy", "Lance", "Cortez"]
print(f"Hello, {names[0]}!")
print(f"Hello, {names[1]}!")
print(f"Hello, {names[2]}!")
```

Once again, we **repeat** code. And once again, this is **forbidden** :). What if the list has 100 names? We won’t write 100 prints. We use a **for** loop, just like we did before

```py
names = ["Tommy", "Lance", "Cortez"]
for name in names:
    print(f"Hello, {name}!")
```

Output

```text
Hello, Tommy!
Hello, Lance!
Hello, Cortez!
```

What does this mean? We tell **Python**: "for **each name** in the list **names**, do this". On every iteration, the variable **name** takes the value of the next element in the list

The keyword **in** is the same one we saw with **range()**. Here, instead of going through numbers, we go through the elements of a list

---

We can also use **range()** with **len()** if we want the **index** as well as the value

```py
names = ["Tommy", "Lance", "Cortez"]
for i in range(0, len(names)):
    print(f"Hero number {i + 1}: {names[i]}")
```

Output

```text
Hero number 1: Tommy
Hero number 2: Lance
Hero number 3: Cortez
```

Why **i + 1**? Because we count from **0** in code, but humans usually start from **1** when they say "first, second, third". So we add **1** just for display

Both styles are useful. **for name in names** is cleaner when we just want the value. **for i in range(...)** is necessary when we need the position too

---

A classic use case: **summing** numbers in a list

```py
prices = [10, 20, 30, 40]
total = 0
for price in prices:
    total = total + price
print(total)
```

Output **100**. We started with **total = 0**, then for each price we added it to **total**. This is one of the most common patterns in programming, and you will write it many, many times. Read the code line by line and make sure you understand **why** it works

---

You have a list **scores** with the values **[80, 95, 60, 72, 88]**

Display **on separate lines**

1. Each score (just the number, one per line)
2. The **total** of all scores
3. The **average** (total divided by how many there are)

Expected output

```text
80
95
60
72
88
395
79.0
```

Tip: use **len(scores)** so the average works no matter how many numbers are in the list. Try adding or removing scores and run again. Programming is fun when **you’re curious** :)
