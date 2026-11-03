for word in input().split():
    if sum(1 for ch in word.lower() if ch in "aeiou") >= 2:
        print(word)
