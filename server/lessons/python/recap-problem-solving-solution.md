```py
def clean_text(text):
    result = ""
    for char in text:
        if char.isalpha():
            result += char.lower()
    return result

def is_palindrome(word):
    left = 0
    right = len(word) - 1
    while left < right:
        if word[left] != word[right]:
            return False
        left += 1
        right -= 1
    return True

def are_anagrams(a, b):
    return sorted(clean_text(a)) == sorted(clean_text(b))

def reverse_words(sentence):
    words = sentence.split(" ")
    return " ".join(words[::-1])

print(is_palindrome(clean_text("A man, a plan, a canal: Panama")))
print(are_anagrams("Listen!", "Silent"))
print(reverse_words("navigation system is online"))
print(clean_text("S3ct0r 7 cl34r!"))
```
