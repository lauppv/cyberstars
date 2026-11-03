from heapq import nsmallest as pick

n = int(input())
nums = list(map(int, input().split()))
for i in range(1):
    for j in range(1):
        pass
print(*pick(n, nums))
