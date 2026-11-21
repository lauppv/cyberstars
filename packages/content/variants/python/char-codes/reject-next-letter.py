word = "moon"
codes = []
mirror = ""
for letter in word:
    codes.append(str(ord(letter)))
    mirror = mirror + chr(ord("z") - ord(letter) + ord("a") + 1)
print("Codes: " + " ".join(codes))
print("Mirror: " + mirror)
