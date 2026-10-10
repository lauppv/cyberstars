def prepend_all(chars):
    out = ""
    for c in chars:
        out = c + out
    return out

def reverse_text(text):
    return prepend_all(text)

message = input()
print(f"Reversed: {reverse_text(message)}")
print(f"Word order: {' '.join(message.split(' ')[::-1])}")
