def bubble_sort(values):
    data = list(values)
    end = len(data) - 1
    swapped = True
    while swapped:
        swapped = False
        for k in range(end):
            if data[k] > data[k + 1]:
                data[k], data[k + 1] = data[k + 1], data[k]
                swapped = True
        end -= 1
    return data


batch1 = [42, 17, 88, 9, 23]
batch2 = [5, 4, 3, 2, 1]
print(bubble_sort(batch1))
print(bubble_sort(batch2))
