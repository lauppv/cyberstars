fuels = [1, 2, 3, 4, 5, 6, 7, 8, 9]
target = 10

def scan(numbers, target, i, j, acc):
    while i < j and numbers[i] + numbers[j] != target:
        if numbers[i] + numbers[j] < target:
            i += 1
        else:
            j -= 1
    if i >= j:
        return acc
    return scan(numbers, target, i + 1, j - 1, acc + [(numbers[i], numbers[j])])

def pair_with_sum(numbers, target):
    return scan(numbers, target, 0, len(numbers) - 1, [])

res = pair_with_sum(fuels, target)
print(f"Pairs: {res}")
print(f"Total pairs: {len(res)}")
