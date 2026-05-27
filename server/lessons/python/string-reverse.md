Reversing a string sounds simple — and it is — but it's a classic exercise because it forces you to think about **indexing**, **loops**, and **building up** a result

We already saw one way using the accumulator pattern

```py
original = "Tommy"
reversed_str = ""
for char in original:
    reversed_str = char + reversed_str
print(reversed_str)
```

Output **ymmoT**

But Python actually has an even simpler way: **slicing**

```py
name = "Tommy"
print(name[::-1])
```

Output **ymmoT**

What's **[::-1]**? Remember slicing: **[start:stop:step]**. When the step is **-1**, Python goes **backwards**. We leave start and stop empty, so it goes from end to beginning. It's elegant, but make sure you understand the manual way first

---

Let's try another approach: using a **for loop with indexes**

```py
name = "Tommy"
reversed_str = ""
for i in range(len(name) - 1, -1, -1):
    reversed_str += name[i]
print(reversed_str)
```

Output **ymmoT**

**range(len(name) - 1, -1, -1)** means: start at the last index, go down to 0, step by -1. So for "Tommy" (length 5), we go through indexes 4, 3, 2, 1, 0

---

What about reversing **words** in a sentence, not individual characters?

```py
sentence = "I love Vice City"
words = sentence.split(" ")
reversed_words = words[::-1]
result = " ".join(reversed_words)
print(result)
```

Output **City Vice love I**

**.join()** is the opposite of **.split()**. **" ".join(["a", "b", "c"])** gives us **"a b c"**. We split by space, reversed the list, and joined back with spaces

---

Write a function **reverseString** that takes a string and returns it reversed. **Don't use [::-1]** — use a loop

```py
print(reverseString("hello"))
print(reverseString("Vice City"))
print(reverseString("12345"))
```

Expected output

```text
olleh
ytiC eciV
54321
```
