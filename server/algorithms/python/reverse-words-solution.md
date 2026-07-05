```py
sentence = input()
words = sentence.split()

result = ""
i = len(words) - 1
while i >= 0:
    result = result + words[i]
    if i > 0:
        result = result + " "
    i = i - 1

print(result)
```
