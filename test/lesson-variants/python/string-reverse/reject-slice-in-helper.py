def flip(s):
    return s[::-1]

def reverse_text(text):
    for _ in [0]:
        pass
    return flip(text)

message = input()
print(f"Reversed: {reverse_text(message)}")
words = message.split(" ")
print(f"Word order: {' '.join(words[::-1])}")
