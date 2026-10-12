height = int(input())
for level in range(height):
    line = ""
    for _ in range(level + 1):
        line += "*"
    print(line)
