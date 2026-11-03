def largest(values):
    top = values[0]
    for v in values[1:]:
        if v > top:
            top = v
    return top


n = int(input())
print(largest([int(x) for x in input().split()]))
