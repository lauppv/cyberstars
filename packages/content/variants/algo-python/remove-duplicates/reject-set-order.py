input()
nums = [int(x) for x in input().split()]
print(*sorted(set(x for x in nums)))
