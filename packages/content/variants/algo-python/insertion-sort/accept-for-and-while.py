n = int(input())
nums = [int(x) for x in input().split()]

for i in range(1, n):
    key = nums[i]
    j = i - 1
    while j >= 0 and nums[j] > key:
        nums[j + 1] = nums[j]
        j -= 1
    nums[j + 1] = key

print(*nums)
