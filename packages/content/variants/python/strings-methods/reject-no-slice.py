word = input()
print(word[0])
print(word[3])
head = ""
tail = ""
for i, ch in enumerate(word):
    if i < 4:
        head += ch
    else:
        tail += ch
print(head)
print(tail)
