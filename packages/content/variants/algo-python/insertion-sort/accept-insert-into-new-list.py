n = int(input())
done = []
for x in map(int, input().split()):
    pos = len(done)
    while pos > 0 and done[pos - 1] > x:
        pos -= 1
    done.insert(pos, x)
print(*done)
