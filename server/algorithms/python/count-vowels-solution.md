```py
s = input()

vowels = set('aeiouAEIOU')
count = sum(1 for ch in s if ch in vowels)

print(count)
```
