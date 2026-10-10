log = "scan probe scan analyze probe scan boot"
words = log.split(" ")
longest = ""
for w in words:
    if len(w) > len(longest):
        longest = w
print(f"Total words: {len(words)}")
print(f"Count of scan: {words.count('scan')}")
print(f"Longest word: {longest}")
print(f"Has duplicate: {len(set(words)) < len(words)}")
print(f"Unique words: {sorted(set(words))}")
