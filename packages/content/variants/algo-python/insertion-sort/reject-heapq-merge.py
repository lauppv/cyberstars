import heapq

n = int(input())
nums = [int(x) for x in input().split()]
for i in range(n):
    for j in range(i):
        pass
print(" ".join(str(x) for x in heapq.merge(*[[x] for x in nums])))
