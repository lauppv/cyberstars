Searching is one of the most fundamental things a computer does. "Is this user in the database?" "Does this list contain the number 42?" "Where is the word 'error' in this log?"

The simplest way to search is **linear search**: go through the list **one element at a time**, from start to finish, and check each one

```py
def linear_search(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i
    return -1

names = ["Tommy", "Lance", "Cortez", "Phil", "Sonny"]
result = linear_search(names, "Cortez")
print(result)
```

Output **2**. Cortez is at index 2

If the target is not in the list, we return **-1** (a convention meaning "not found")

```py
result = linear_search(names, "Shrek")
print(result)
```

Output **-1**. Shrek is not in Vice City :)

---

How does it work? We look at position **0** — is it Cortez? No. Position **1** — is it Cortez? No. Position **2** — is it Cortez? **Yes!** Return **2**

If we go through the entire list without finding the target, we return **-1**

---

We can also search for something based on a **condition**, not just an exact match

```py
scores = [65, 42, 88, 95, 71]

for i in range(len(scores)):
    if scores[i] > 90:
        print(f"Found a score above 90: {scores[i]} at index {i}")
        break
```

Output **Found a score above 90: 95 at index 3**

---

**How good is linear search?** If the list has **10** elements, we might check all 10. If it has **1,000,000** elements, we might check all 1,000,000. Linear search checks elements **one by one**. The more elements, the longer it takes. In the worst case (element not found), we check **every single one**

Is there something faster? Yes — **binary search**, which we'll learn later. But binary search only works on **sorted** lists. Linear search works on **anything**

---

## Mission: Crew Locator

The station roster is a list of crew names, each one at a numbered station (station 0, station 1, and so on). Mission Control wants to look someone up by name.

Write a function **find_crew(crew, target)** that uses **linear search** to return the **station number** (the index) where `target` sits in the list. If the name is not in the list, return **-1**.

Then **read** a name and report the result.

**Input** (typed by the user when the program runs):

- the crew member's name to find

**Output** — one line. If the name is on board, print the name, then `is at station`, then the station number. If not, print the name followed by `is not on board`. See the example below for the exact wording.

**Example**

If the user types

```text
Cara
```

the program should print

```text
Cara is at station 2
```

If the user types

```text
Zane
```

the program should print

```text
Zane is not on board
```
