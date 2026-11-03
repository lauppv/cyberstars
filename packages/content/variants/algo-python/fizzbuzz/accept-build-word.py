n = int(input())
for i in range(1, n + 1):
    word = ""
    if i % 3 == 0:
        word += "Fizz"
    if i % 5 == 0:
        word += "Buzz"
    print(word or i)
