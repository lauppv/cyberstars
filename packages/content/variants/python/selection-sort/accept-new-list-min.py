def selection_sort(numbers):
    rest = list(numbers)
    out = []
    while rest:
        smallest = min(rest)
        rest.remove(smallest)
        out.append(smallest)
    return out


batch1 = [64, 25, 12, 22, 11]
batch2 = [9, 7, 5, 3, 1]
print(selection_sort(batch1))
print(selection_sort(batch2))
