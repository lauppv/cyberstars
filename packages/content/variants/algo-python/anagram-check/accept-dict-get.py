def letter_counts(word):
    counts = {}
    for ch in word.lower():
        counts[ch] = counts.get(ch, 0) + 1
    return counts


print(letter_counts(input()) == letter_counts(input()))
