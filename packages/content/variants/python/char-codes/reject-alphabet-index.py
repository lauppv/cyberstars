word = "moon"

alphabet = "abcdefghijklmnopqrstuvwxyz"
codes = []
mirror = ""
for letter in word:
    place = alphabet.index(letter)
    codes.append(str(97 + place))
    mirror = mirror + alphabet[25 - place]

print(f"Codes: {' '.join(codes)}")
print(f"Mirror: {mirror}")
