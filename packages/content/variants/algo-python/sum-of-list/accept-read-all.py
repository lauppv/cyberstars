import sys

data = sys.stdin.read().split()
count = int(data[0])
total = 0
for value in data[1 : count + 1]:
    total += int(value)
print(total)
