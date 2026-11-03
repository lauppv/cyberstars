def mirrored(text, i, j):
    while i < j:
        if text[i] != text[j]:
            return False
        i += 1
        j -= 1
    return True


word = input()
print(mirrored(word, 0, len(word) - 1))
