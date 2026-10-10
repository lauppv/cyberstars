def index_of_min(values, start):
    best = start
    for k in range(start + 1, len(values)):
        if values[k] < values[best]:
            best = k
    return best

def selection_sort(numbers):
    a = numbers[:]
    for pos in range(len(a) - 1):
        m = index_of_min(a, pos)
        tmp = a[pos]
        a[pos] = a[m]
        a[m] = tmp
    return a

batch1 = [64, 25, 12, 22, 11]
batch2 = [9, 7, 5, 3, 1]
print(selection_sort(batch1))
print(selection_sort(batch2))
