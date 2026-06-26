```py
def bubble_sort(numbers):
    for i in range(len(numbers)):
        for j in range(len(numbers) - 1):
            if numbers[j] > numbers[j + 1]:
                numbers[j], numbers[j + 1] = numbers[j + 1], numbers[j]
    return numbers

print(bubble_sort([42, 17, 88, 9, 23]))
print(bubble_sort([5, 4, 3, 2, 1]))
```
