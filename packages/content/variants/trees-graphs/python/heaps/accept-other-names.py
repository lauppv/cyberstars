def add(h, x):
    h.append(x)
    k = len(h) - 1
    while k and h[(k - 1) // 2] > h[k]:
        up = (k - 1) // 2
        h[up], h[k] = h[k], h[up]
        k = up


def take(h):
    top = h[0]
    h[0] = h[-1]
    del h[-1]
    k = 0
    while True:
        l, r = 2 * k + 1, 2 * k + 2
        best = k
        if l < len(h) and h[l] < h[best]:
            best = l
        if r < len(h) and h[r] < h[best]:
            best = r
        if best == k:
            return top
        h[k], h[best] = h[best], h[k]
        k = best


values = [5, 3, 8, 1, 9, 6]
pops = 2

h = []
for x in values:
    add(h, x)
print("Heap: " + " ".join(map(str, h)))
out = [take(h) for _ in range(pops)]
print("Popped: " + " ".join(map(str, out)))
print("Left: " + " ".join(map(str, h)))
