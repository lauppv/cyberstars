```py
fuels = [1, 2, 3, 4, 5, 6, 7, 8, 9]
target = 10

def pair_with_sum(numbers, target):
    pairs = []
    left = 0
    right = len(numbers) - 1
    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            pairs.append((numbers[left], numbers[right]))
            left += 1
            right -= 1
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return pairs

result = pair_with_sum(fuels, target)
print(f"Pairs: {result}")
print(f"Total pairs: {len(result)}")
```
