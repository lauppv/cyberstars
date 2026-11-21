word = "moon"
codes = []
for letter in word:
    codes.append(str(ord(letter)))
print("Codes: " + " ".join(codes))
print("Mirror: " + chr(ord(word[0])) + word[1:][::-1])
