words = input().split()
lengths = [len(w) for w in words]
print(min(words, key=lambda w: -len(w)))
