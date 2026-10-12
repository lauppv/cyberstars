def reverse_text(text):
    result = ""
    for char in text:
        result = char + result
    return result

message = input()
print(f"Reversed: {reverse_text(message)}")
print(f"Word order: {reverse_text(message)}")
