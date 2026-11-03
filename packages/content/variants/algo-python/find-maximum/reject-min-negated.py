input()
nums = [int(x) for x in input().split()]
print(min(nums, key=lambda x: -x))
