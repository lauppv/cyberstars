word = "moon"
abc = "abcdefghijklmnopqrstuvwxyz"
codes = []
mirror = ""
for letter in word:
    codes.append(str(ord(letter)))
    mirror = mirror + abc[25 - abc.find(letter)]
print("Codes: " + " ".join(codes))
print("Mirror: " + mirror)
