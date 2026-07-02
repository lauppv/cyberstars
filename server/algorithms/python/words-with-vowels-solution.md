```py
sentence = input()
vowels = set('aeiouAEIOU')

for word in sentence.split():
    count = sum(1 for ch in word if ch in vowels)
    if count == 2:
        print(word)
```
