import string

text = input()
k = int(input())
lower = string.ascii_lowercase
upper = string.ascii_uppercase
table = str.maketrans(lower + upper, lower[k:] + lower[:k] + upper[k:] + upper[:k])
print(text.translate(table))
