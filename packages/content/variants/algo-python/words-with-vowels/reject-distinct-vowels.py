for word in input().split():
    if len(set(ch for ch in word.lower() if ch in "aeiou")) == 2:
        print(word)
