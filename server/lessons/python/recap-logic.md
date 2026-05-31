Combine **input**, **operators**, and **booleans**

---

## Mission: Launch Authorization

Before a rocket can launch, mission control checks three things. Write a program that **reads three numbers** and decides whether launch is authorized.

The three numbers are the **fuel level** (a percentage), the **crew size**, and the number of **completed safety checks**. The rules are:

- fuel is OK when it is **80 or more**
- crew is OK when it is **between 2 and 6** (at least 2 and at most 6)
- checks are OK when they are **exactly 10**

Launch is authorized only when **all three** are OK. Use booleans to store each result.

**Input** (typed by the user when the program runs):

- the fuel level
- the crew size
- the number of completed safety checks

**Output**

Four lines: `Fuel OK: ` then True or False, `Crew OK: ` then True or False, `Checks OK: ` then True or False, and finally `Authorized: ` then True or False.

**Example**

If the user types

```text
90
4
10
```

the program should print

```text
Fuel OK: True
Crew OK: True
Checks OK: True
Authorized: True
```

If the user types

```text
50
4
10
```

the program should print

```text
Fuel OK: False
Crew OK: True
Checks OK: True
Authorized: False
```
