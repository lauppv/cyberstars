words = [w for w in input().split() if sum(1 for ch in w.lower() if ch in "aeiou") == 2]
print(" ".join(words))
