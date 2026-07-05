```py
sentence = input()
words = sentence.split()

for word in words:
    count = 0
    for ch in word:
        if ch == 'a' or ch == 'e' or ch == 'i' or ch == 'o' or ch == 'u':
            count = count + 1
        elif ch == 'A' or ch == 'E' or ch == 'I' or ch == 'O' or ch == 'U':
            count = count + 1
    if count == 2:
        print(word)
```
