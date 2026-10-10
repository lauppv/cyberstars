def selection_sort(numbers):
    for i in range(len(numbers) - 1):
        if numbers[i] > numbers[i + 1]:
            numbers[i], numbers[i + 1] = numbers[i + 1], numbers[i]
    return numbers

batch1 = [64, 25, 12, 22, 11]
batch2 = [9, 7, 5, 3, 1]
print(selection_sort(batch1))
print(selection_sort(batch2))
