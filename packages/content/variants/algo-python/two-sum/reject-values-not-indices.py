nums = [int(x) for x in input().split()]
target = int(input())
seen = set()
for v in nums:
    if target - v in seen:
        print(target - v, v)
        break
    seen.add(v)
