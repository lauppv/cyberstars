import sys

numbers = list(map(int, sys.stdin.read().split()))
count, edge_count = numbers[0], numbers[1]
table = {}
neighbours = {}
for a in range(count):
    table[a] = {}
    neighbours[a] = []
    for b in range(count):
        table[a][b] = 0
pos = 2
for k in range(edge_count):
    x, y = numbers[pos], numbers[pos + 1]
    pos += 2
    table[x][y] = table[y][x] = 1
    neighbours[x].append(y)
    neighbours[y].append(x)
print("Matrix:")
for a in range(count):
    print(" ".join(str(table[a][b]) for b in range(count)))
print("List:")
for a in range(count):
    print(str(a) + ": " + " ".join(map(str, neighbours[a])))
