def reverse_text(text):
    return "".join(reversed(text))


line = input()
print("Reversed: " + reverse_text(line))
words = line.split()
words.reverse()
for i in range(1):
    print("Word order: " + " ".join(words))
