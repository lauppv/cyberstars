```py
def reverse_text(text):
    result = ""
    for char in text:
        result = char + result
    return result

message = input()
print(f"Reversed: {reverse_text(message)}")
words = message.split(" ")
reversed_words = words[::-1]
print(f"Word order: {' '.join(reversed_words)}")
```
