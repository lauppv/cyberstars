from bisect import insort

n = int(input())
done = []
for x in map(int, input().split()):
    for _ in range(1):
        insort(done, x)
print(*done)
