We learned **for** and **while**. Loops do their job from start to finish. But what if, in the middle of a loop, we want to say "ok, that's enough, stop"? Or "skip this one, go to the next"?

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

A real example: imagine we scan the station's sectors, one by one, to find a signal. Once we found it, why keep scanning?

```py
for sector in range(1, 100):
    if sector == 7:
        print(f"Signal found in sector {sector}!")
        break
    print(f"Scanning sector {sector}...")
```

Output

```text
Scanning sector 1...
Scanning sector 2...
Scanning sector 3...
Scanning sector 4...
Scanning sector 5...
Scanning sector 6...
Signal found in sector 7!
```

The loop never checked sectors **8** through **99**, because we already found what we wanted. **break** saved us time

---

**continue** is different. It doesn't stop the loop. It just **skips** the rest of the current iteration and **jumps to the next one**

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

For odd numbers, **continue** skipped the **print**. For even ones, the **if** was **False**, so **continue** didn't fire and **print** ran normally

---

Both keywords work the same way in **while** loops, not just **for**. A very common pattern is **while True** together with **input()**: we repeat forever and exit with **break** when the user tells us to

```py
while True:
    command = input("Command: ")
    if command == "stop":
        break
    print(f"Running: {command}")
print("System stopped")
```

**while True** would normally be an infinite loop. But on every step we ask for a command, and if the user types **stop**, **break** takes us out of the loop. Whatever else they type, the program prints **Running: ...** and asks again

---

## Mission: Manual Sector Scanner

The station operator enters sector numbers **one by one**. Use a **while True** loop and read a number on every step with `int(input(...))`. For each number:

- if the operator types `0` → it's the end of the scan, **stop** the loop (use **break**)
- if the number is **negative** → it's just noise, **skip it** (use **continue**) and print nothing
- otherwise → print `Sector ` then the number, then ` checked` (for example `Sector 4 checked`)

After the loop, print `Scan complete`.

**Example**

If the operator types `4`, then `-2`, then `7`, then `0` in turn, the program prints

```text
Sector 4 checked
Sector 7 checked
Scan complete
```

`-2` is skipped, and `0` stops the scan.
