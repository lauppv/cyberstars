```py
log = "scan probe scan analyze probe scan boot"

def count_word(log, word):
    count = 0
    for w in log.split(" "):
        if w == word:
            count += 1
    return count

def longest_word(log):
    longest = ""
    for w in log.split(" "):
        if len(w) > len(longest):
            longest = w
    return longest

def has_duplicate(log):
    seen = set()
    for w in log.split(" "):
        if w in seen:
            return True
        seen.add(w)
    return False

words = log.split(" ")
print(f"Total words: {len(words)}")
print(f"Count of scan: {count_word(log, 'scan')}")
print(f"Longest word: {longest_word(log)}")
print(f"Has duplicate: {has_duplicate(log)}")
print(f"Unique words: {sorted(set(words))}")
```
