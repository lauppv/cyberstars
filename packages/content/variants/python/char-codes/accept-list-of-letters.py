word = "moon"
numbers = []
letters = []
i = 0
while i < len(word):
    n = ord(word[i])
    numbers.append(str(n))
    letters.append(chr(219 - n))
    i = i + 1
print("Codes: " + " ".join(numbers))
print("Mirror: " + "".join(letters))
