nums = [int(x) for x in input().split()]
target = int(input())
index = {v: i for i, v in enumerate(nums)}
for i, v in enumerate(nums):
    if target - v in index:
        print(i, index[target - v])
        break
