```py
s = input()

count = 0
for ch in s:
    if ch == 'a' or ch == 'e' or ch == 'i' or ch == 'o' or ch == 'u':
        count = count + 1
    elif ch == 'A' or ch == 'E' or ch == 'I' or ch == 'O' or ch == 'U':
        count = count + 1

print(count)
```
