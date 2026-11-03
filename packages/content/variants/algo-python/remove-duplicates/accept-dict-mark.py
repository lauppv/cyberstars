def unique_in_order(values):
    first = {}
    for v in values:
        if v not in first:
            first[v] = True
    return list(first)


input()
print(*unique_in_order(int(x) for x in input().split()))
