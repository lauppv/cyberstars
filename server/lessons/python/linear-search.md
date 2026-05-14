Searching is one of the most fundamental things a computer does. "Is this user in the database?" "Does this list contain the number 42?" "Where is the word 'error' in this log?"

The simplest way to search is **linear search**: go through the list **one element at a time**, from start to finish, and check each one

```py
def linearSearch(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i
    return -1

names = ["Tommy", "Lance", "Cortez", "Phil", "Sonny"]
result = linearSearch(names, "Cortez")
print(result)
```
Output **2**. Cortez is at index 2

If the target is not in the list, we return **-1** (a convention meaning "not found")
```py
result = linearSearch(names, "Shrek")
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

Write a function **findFirst** that takes a list and a **target** value, and returns the **index** of the first occurrence of the target. If not found, return **-1**

```py
print(findFirst(["a", "b", "c", "b", "a"], "b"))   # 1
print(findFirst(["a", "b", "c"], "z"))               # -1
print(findFirst([10, 20, 30, 40], 30))               # 2
```

Expected output
```text
1
-1
2
```