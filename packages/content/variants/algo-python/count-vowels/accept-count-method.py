text = input().lower()
print(sum(text.count(v) for v in "aeiou"))
