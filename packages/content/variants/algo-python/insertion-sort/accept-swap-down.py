def insertion_sort(values):
    for i in range(1, len(values)):
        for j in range(i, 0, -1):
            if values[j - 1] <= values[j]:
                break
            values[j - 1], values[j] = values[j], values[j - 1]
    return values


input()
numbers = list(map(int, input().split()))
print(" ".join(str(x) for x in insertion_sort(numbers)))
