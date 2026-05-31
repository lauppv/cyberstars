We learned **for** and **while**. Loops do their job from start to finish. But what if, in the middle of a loop, we want to say "ok, that’s enough, stop"? Or "skip this one, go to the next"?

For exactly these two situations, **Python** gives us **break** and **continue**

---

**break** **stops** the loop completely. Once we hit it, the program exits the loop, no matter how many iterations were left

```py
i = 0
for i in range(0, 100):
    if i == 5:
        break
    print(i)
```

Output

```text
0
1
2
3
4
```

We told **for** to go from **0** to **99**, but as soon as **i** became **5**, we hit **break** and the loop stopped. The numbers **5, 6, 7, ..., 99** were never printed

A real example: imagine we’re searching for a name in a list. Once we found it, why keep looking?

```py
names = ["Tommy", "Lance", "Cortez", "Phil", "Sonny"]
target = "Cortez"

for name in names:
    if name == target:
        print(f"Found {target}!")
        break
    print(f"Checking {name}...")
```

Output

```text
Checking Tommy...
Checking Lance...
Found Cortez!
```

The loop didn’t check **Phil** and **Sonny**, because we already found what we wanted. **break** saved us time

---

**continue** is different. It doesn’t stop the loop. It just **skips** the rest of the current iteration and **jumps to the next one**

```py
i = 0
for i in range(0, 10):
    if i == 5:
        continue
    print(i)
```

Output

```text
0
1
2
3
4
6
7
8
9
```

Notice that **5** is **missing**. When **i** was **5**, **continue** kicked in, jumped over **print(i)**, and the loop kept going from **i = 6**

A real example: print only **even** numbers from 0 to 10

```py
for i in range(0, 11):
    if i % 2 != 0:
        continue
    print(i)
```

Output

```text
0
2
4
6
8
10
```

For odd numbers, **continue** skipped the **print**. For even ones, the **if** was **False**, so **continue** didn’t fire and **print** ran normally

---

A small warning: **break** and **continue** can make code harder to read if you abuse them. Use them when they make the logic clearer, not just to be clever :)

Both keywords work the same way in **while** loops, not just **for**

```py
i = 0
while True:
    if i >= 5:
        break
    print(i)
    i = i + 1
```

**while True** would normally be an infinite loop, but **break** lets us exit it when we want

---

## Mission: Signal Scanner

The station scans a list of incoming signals (already on the right). The rules of the scan:

- a **negative** number is just noise — **skip** it (use **continue**)
- a **0** means "end of transmission" — **stop** scanning immediately (use **break**)
- every other (positive) signal is valid — **print** it and **count** it

At the end, print `Total signals: ` then how many valid signals you found.

**Output**

```text
12
7
5
Total signals: 3
```

The `-3` and `-8` are skipped, the scan stops at the `0`, and the `99` and `4` after it are never reached — so only `12`, `7`, and `5` count.
