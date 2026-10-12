def clean_text(text):
    kept = ""
    for ch in text:
        if ch.isalpha():
            kept = kept + ch.lower()
    return kept

def is_palindrome(word):
    n = len(word)
    for k in range(n // 2):
        if word[k] != word[n - 1 - k]:
            return False
    return True

def are_anagrams(a, b):
    return sorted(clean_text(a)) == sorted(clean_text(b))

def reverse_words(sentence):
    parts = sentence.split(" ")
    parts.reverse()
    return " ".join(parts)

palindrome_text = "A man, a plan, a canal: Panama"
anagram_a = "Listen!"
anagram_b = "Silent"
sentence = "navigation system is online"
messy = "S3ct0r 7 cl34r!"
print(is_palindrome(clean_text(palindrome_text)))
print(are_anagrams(anagram_a, anagram_b))
print(reverse_words(sentence))
print(clean_text(messy))
