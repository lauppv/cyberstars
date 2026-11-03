n = int(input())
i = 1
three = five = 0
while i <= n:
    three += 1
    five += 1
    if three == 3 and five == 5:
        print("FizzBuzz")
        three = five = 0
    elif three == 3:
        print("Fizz")
        three = 0
    elif five == 5:
        print("Buzz")
        five = 0
    else:
        print(i)
    i += 1
