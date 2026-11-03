nums = [int(x) for x in input().split()]
target = int(input())
seen = {}
for j, v in enumerate(nums):
    if target - v in seen:
        print(j, seen[target - v])
        break
    seen[v] = j
