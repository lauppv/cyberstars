```py
def selection_sort(numbers):
    for i in range(len(numbers)):
        min_index = i
        for j in range(i + 1, len(numbers)):
            if numbers[j] < numbers[min_index]:
                min_index = j
        numbers[i], numbers[min_index] = numbers[min_index], numbers[i]
    return numbers

batch1 = [64, 25, 12, 22, 11]
batch2 = [9, 7, 5, 3, 1]
print(selection_sort(batch1))
print(selection_sort(batch2))
```
