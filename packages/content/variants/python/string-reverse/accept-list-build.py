def reverse_text(text):
    chars = []
    for c in text:
        chars.insert(0, c)
    return "".join(chars)

transmission = input("Transmission: ")
backwards = reverse_text(transmission)
words = transmission.split(" ")
flipped = []
for w in words:
    flipped = [w] + flipped
print(f"Reversed: {backwards}")
print(f"Word order: {' '.join(flipped)}")
