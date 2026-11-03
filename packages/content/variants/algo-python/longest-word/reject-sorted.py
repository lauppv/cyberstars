words = input().split()
print(sorted(words, key=len, reverse=True)[0])
