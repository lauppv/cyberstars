def reverse_text(text):
    result = ""
    for char in text:
        result = char + result
    return result

message = "navigation system online"
print(f"Reversed: {reverse_text(message)}")
print(f"Word order: {' '.join(message.split()[::-1])}")
