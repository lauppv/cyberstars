We briefly saw in the dictionaries lesson how to count letters in a word. This pattern is so important that it deserves its own lesson. It's called a **frequency dictionary** (or **histogram**) and it's the go-to tool when the question is "how many times does each X appear?"

```py
word = "mississippi"
freq = {}

for letter in word:
    if letter in freq:
        freq[letter] += 1
    else:
        freq[letter] = 1

print(freq)
```

Output **{'m': 1, 'i': 4, 's': 4, 'p': 2}**

Let's understand this line by line. We start with an empty dictionary. For each letter, we check: is it already in the dictionary? If yes, add 1 to its count. If not, create a new entry with count 1

---

This works for **anything**, not just letters. Counting words in a sentence

```py
sentence = "I like pizza and I like burgers and I like tacos"
words = sentence.split(" ")
freq = {}

for word in words:
    if word in freq:
        freq[word] += 1
    else:
        freq[word] = 1

print(freq)
```

Output **{'I': 3, 'like': 3, 'pizza': 1, 'and': 2, 'burgers': 1, 'tacos': 1}**

---

Once we have a frequency dictionary, we can answer interesting questions

**What's the most common element?**

```py
bestKey = ""
bestCount = 0
for key, count in freq.items():
    if count > bestCount:
        bestCount = count
        bestKey = key
print(f"Most common: {bestKey} ({bestCount} times)")
```

**What elements appear only once?**

```py
unique = []
for key, count in freq.items():
    if count == 1:
        unique.append(key)
print(f"Unique: {unique}")
```

**Sort by frequency?**

```py
sortedItems = sorted(freq.items(), key=lambda x: x[1], reverse=True)
for item, count in sortedItems:
    print(f"{item}: {count}")
```

Don't worry about **lambda** for now, just know that it tells **sorted()** which value to sort by (in this case, the count)

---

A real-life use case: you're building an analytics system for **CyberStars** and you want to know which course is most popular

```py
enrollments = ["python", "java", "python", "c", "python", "java", "c", "python", "java", "python"]
freq = {}
for course in enrollments:
    if course in freq:
        freq[course] += 1
    else:
        freq[course] = 1

for course, count in freq.items():
    print(f"{course}: {count} students")
```

Output

```text
python: 5 students
java: 3 students
c: 2 students
```

---

You have a list of **grades** (letters). Build a frequency dictionary and display each grade with its count, **sorted alphabetically**

Expected output

```text
A: 3
B: 4
C: 2
D: 1
```
