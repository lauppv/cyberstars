```py
def bubble_sort(numbers):
    for i in range(len(numbers)):
        for j in range(len(numbers) - 1):
            if numbers[j] > numbers[j + 1]:
                numbers[j], numbers[j + 1] = numbers[j + 1], numbers[j]
    return numbers

batch1 = [42, 17, 88, 9, 23]
batch2 = [5, 4, 3, 2, 1]
print(bubble_sort(batch1))
print(bubble_sort(batch2))
```
