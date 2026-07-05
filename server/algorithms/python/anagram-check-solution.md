```py
a = input().lower()
b = input().lower()

if len(a) != len(b):
    print(False)
else:
    counts = {}
    for ch in a:
        if ch in counts:
            counts[ch] = counts[ch] + 1
        else:
            counts[ch] = 1

    for ch in b:
        if ch in counts:
            counts[ch] = counts[ch] - 1
        else:
            counts[ch] = -1

    are_anagrams = True
    for ch in counts:
        if counts[ch] != 0:
            are_anagrams = False
            break

    print(are_anagrams)
```
