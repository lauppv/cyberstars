for word in input().split():
    if sum(word.lower().count(v) for v in "aeiou") == 2:
        print(word)
