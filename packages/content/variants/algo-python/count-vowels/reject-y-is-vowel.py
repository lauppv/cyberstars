s = input().lower()
print(sum(1 for ch in s if ch in "aeiouy"))
