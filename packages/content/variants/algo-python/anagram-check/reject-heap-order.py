import heapq

a = input().lower()
b = input().lower()
print(heapq.nsmallest(len(a), [c for c in a]) == heapq.nsmallest(len(b), [c for c in b]))
