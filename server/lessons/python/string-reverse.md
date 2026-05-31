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

## Mission: Decode Transmission

A garbled transmission just arrived. The crew suspects it was sent **backwards**, so you need to flip it two ways and see which one makes sense.

1. Write a function **reverse_text(text)** that returns the text reversed **character by character**, using a loop (**don't use `[::-1]`**).
2. **Read** the transmission, then print `Reversed: ` followed by the character-reversed text.
3. Also reverse the **order of the words** (split into words, reverse the list, join back with spaces) and print `Word order: ` followed by the result.

**Input** (typed by the user when the program runs):

- the transmission, a line of words separated by spaces

**Output** — two lines: the character-reversed text, then the word-order-reversed text.

**Example**

If the user types

```text
navigation system online
```

the program should print

```text
Reversed: enilno metsys noitagivan
Word order: online system navigation
```
