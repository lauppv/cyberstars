def clean_text(text):
    return "".join([c.lower() for c in text if c.isalpha()])


def is_palindrome(word):
    i, j = 0, len(word) - 1
    same = True
    while i < j and same:
        same = word[i] == word[j]
        i, j = i + 1, j - 1
    return same


def are_anagrams(a, b):
    x = list(clean_text(a))
    y = list(clean_text(b))
    x.sort()
    y.sort()
    return x == y


def reverse_words(sentence):
    out = []
    for w in sentence.split():
        out.insert(0, w)
    return " ".join(out)


palindrome_text = "A man, a plan, a canal: Panama"
anagram_a = "Listen!"
anagram_b = "Silent"
sentence = "navigation system is online"
messy = "S3ct0r 7 cl34r!"
print(is_palindrome(clean_text(palindrome_text)))
print(are_anagrams(anagram_a, anagram_b))
print(reverse_words(sentence))
print(clean_text(messy))
