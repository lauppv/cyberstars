Welcome to the second part of the Python curriculum. Until now, we learned the **tools**: variables, loops, functions, lists, dictionaries. Now we learn how to **think** with them

The most important skill in programming is not knowing the syntax. It's knowing how to **break a problem into smaller steps**. This is called **decomposition**

---

Let's say someone asks you: "Write a program that finds the most common word in a sentence"

If you try to write the whole thing at once, you'll get lost. Instead, think about it step by step

**Step 1**: How do I get the individual words from a sentence? → use **.split()**

```py
sentence = "the cat sat on the mat the cat"
words = sentence.split(" ")
print(words)
```

Output **['the', 'cat', 'sat', 'on', 'the', 'mat', 'the', 'cat']**

**Step 2**: How do I count how many times each word appears? → use a dictionary

```py
counter = {}
for word in words:
    if word in counter:
        counter[word] = counter[word] + 1
    else:
        counter[word] = 1
print(counter)
```

Output **{'the': 3, 'cat': 2, 'sat': 1, 'on': 1, 'mat': 1}**

**Step 3**: How do I find which word has the highest count? → loop through the dictionary

```py
bestWord = ""
bestCount = 0
for word, count in counter.items():
    if count > bestCount:
        bestCount = count
        bestWord = word
print(f"Most common: {bestWord} ({bestCount} times)")
```

Output **Most common: the (3 times)**

---

Each step is simple on its own. The trick is **not trying to solve everything at once**. Instead:

1. **Understand** what the problem is asking
2. **Break** it into smaller sub-problems
3. **Solve** each sub-problem one at a time
4. **Combine** the solutions

This is how professional programmers think. Nobody writes a program in one go. They build it piece by piece, testing each piece along the way

---

Let's do another one. "Given a list of numbers, find all pairs that add up to a target"

**Step 1**: What does "all pairs" mean? → every combination of two numbers

```py
numbers = [1, 3, 5, 7, 2]
target = 8
```

**Step 2**: How do I check every pair? → nested loop

```py
for i in range(len(numbers)):
    for j in range(i + 1, len(numbers)):
        if numbers[i] + numbers[j] == target:
            print(f"{numbers[i]} + {numbers[j]} = {target}")
```

Output

```text
1 + 7 = 8
3 + 5 = 8
```

Why **range(i + 1, len(numbers))**? Because we don't want to pair a number with itself, and we don't want to count the same pair twice (3+5 and 5+3 are the same pair)

---

## Mission: Log Analyzer

The station log is a single string of event codes separated by spaces (already on the right). **Break the work into three functions**, then use them together:

1. `split_codes(log)` — returns the **list** of codes (use `.split(" ")`)
2. `count_codes(codes)` — returns a **dictionary** mapping each code to how many times it appears
3. `most_common(counts)` — returns the code with the **highest** count

In the main program, call the functions in order, then print:

- `Codes: ` then the total number of codes
- each code as `code: count` (loop over the dictionary)
- `Most common: ` then the most common code

**Output**

```text
Codes: 6
alpha: 3
beta: 2
gamma: 1
Most common: alpha
```
