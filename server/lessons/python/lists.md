So far, every variable held **one** thing: one name, one number, one boolean. But what if I want to store the names of all the characters from **GTA Vice City**?

I could do this
```py
name1 = "Tommy Vercetti"
name2 = "Lance Vance"
name3 = "Cortez"
name4 = "Phil Cassidy"
name5 = "Sonny Forelli"
```
Ugly. And what if I wanted **100** names? **1000**? No way. There has to be a better solution

There is. It’s called a **list**
```py
names = ["Tommy Vercetti", "Lance Vance", "Cortez", "Phil Cassidy", "Sonny Forelli"]
print(names)
```
A **list** is a **collection** of values stored in a single variable. We use the square brackets **[ ]** and separate the elements with **commas**

If we run this, **Python** will display the whole list at once
```text
['Tommy Vercetti', 'Lance Vance', 'Cortez', 'Phil Cassidy', 'Sonny Forelli']
```

---

We can also access **a single element** of the list, just like we did with strings: by **index**
```py
names = ["Tommy Vercetti", "Lance Vance", "Cortez"]
print(names[0])    # Tommy Vercetti
print(names[1])    # Lance Vance
print(names[2])    # Cortez
```
Once again, **counting starts from 0**. The first element is **names[0]**, NOT **names[1]**

What happens if we ask for an index that doesn’t exist?
```py
names = ["Tommy Vercetti", "Lance Vance", "Cortez"]
print(names[10])
```
**Run** it. You’ll see **Python** complains with an **IndexError**, because there is no element at position **10**. Always read your errors :)

---

How many elements does a list have? **len()** again
```py
names = ["Tommy Vercetti", "Lance Vance", "Cortez"]
print(len(names))   # 3
```
Same **len()** that we used on strings. **Python** is smart about it

---

We can **add** new elements to a list with **.append()**
```py
names = ["Tommy Vercetti", "Lance Vance"]
names.append("Cortez")
names.append("Phil Cassidy")
print(names)
```
Output
```text
['Tommy Vercetti', 'Lance Vance', 'Cortez', 'Phil Cassidy']
```
**.append()** adds the new element **at the end** of the list. The list has **changed**, this is different from **upper()** and **lower()** on strings, which returned a new string. Lists are modified **in place**

---

We can also **change** a value at a given index
```py
names = ["Tommy Vercetti", "Lance Vance", "Cortez"]
names[1] = "Lance Vance Dance"
print(names)
```
Output
```text
['Tommy Vercetti', 'Lance Vance Dance', 'Cortez']
```

---

Lists can hold any kind of values, not just strings
```py
ages = [42, 35, 60, 29]
prices = [3.14, 9.99, 12.50]
flags = [True, False, True]
```
We can even mix them, but in practice it’s rare and usually a sign that something is wrong with the design

---

You have an empty list **heroes** on the right. Do the following

1. Add **Shrek**, **Fiona** and **Donkey** to the list using **.append()**
2. Display the **length** of the list
3. Display the **first** hero
4. Display the **last** hero (try with **heroes[2]**, but think about how you’d do it if the list had 100 elements)

Expected output
```text
3
Shrek
Donkey
```
Run, play, **add more heroes**, see what changes :)
