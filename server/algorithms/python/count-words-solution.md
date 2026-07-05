```py
sentence = input()

# A flag tells us if we're inside a word.
# When we transition from a space to a letter, a new word begins and we bump the counter.
word_count = 0
in_word = False

i = 0
while i < len(sentence):
    character = sentence[i]
    if character != " ":
        if not in_word:
            word_count = word_count + 1
            in_word = True
    else:
        in_word = False
    i = i + 1

print(word_count)
```
