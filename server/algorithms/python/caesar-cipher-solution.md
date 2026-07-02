```py
s = input()
shift = int(input())

result = []
for ch in s:
    if ch.isalpha():
        base = ord('A') if ch.isupper() else ord('a')
        result.append(chr((ord(ch) - base + shift) % 26 + base))
    else:
        result.append(ch)

print(''.join(result))
```
