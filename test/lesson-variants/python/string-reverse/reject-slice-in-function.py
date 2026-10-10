def reverse_text(text):
    return text[::-1]


line = input()
words = []
for word in line.split():
    words.append(word)
print("Reversed: " + reverse_text(line))
print("Word order: " + " ".join(words[::-1]))
