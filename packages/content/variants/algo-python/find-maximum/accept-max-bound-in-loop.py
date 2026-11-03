input()
nums = [int(x) for x in input().split()]
for i in range(len(nums)):
    if i == 0 or nums[i] > max:
        max = nums[i]
print(max)
