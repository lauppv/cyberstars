```python
DIRS = {'north': (-1, 0), 'south': (1, 0), 'east': (0, 1), 'west': (0, -1)}

rows, cols, steps = [int(x) for x in input().split()]
wind = input().split()[1]
forest = [list(input().strip()) for _ in range(rows)]


def show(g):
    for row in g:
        print(''.join(row))


def count(g, ch):
    return sum(row.count(ch) for row in g)


def inside(r, c):
    return 0 <= r < rows and 0 <= c < cols


def step(g):
    new = [row[:] for row in g]
    for r in range(rows):
        for c in range(cols):
            if g[r][c] == 'F':
                new[r][c] = 'x'
            elif g[r][c] == 'T':
                catches = any(inside(r + dr, c + dc) and g[r + dr][c + dc] == 'F' for dr, dc in DIRS.values())
                if wind in DIRS and not catches:
                    dr, dc = DIRS[wind]
                    # fire two cells upwind jumps over the cell between, unless it is water
                    sr, sc = r - 2 * dr, c - 2 * dc
                    mr, mc = r - dr, c - dc
                    if inside(sr, sc) and g[sr][sc] == 'F' and g[mr][mc] != '#':
                        catches = True
                if catches:
                    new[r][c] = 'F'
    return new


trees = count(forest, 'T') + count(forest, 'F')
print(f'Forest {rows}x{cols}, {trees} trees, wind {wind}')
show(forest)
out_at = None
for s in range(1, steps + 1):
    if count(forest, 'F') == 0:
        break
    forest = step(forest)
    print()
    print(f'Step {s}')
    show(forest)
    if count(forest, 'F') == 0:
        out_at = s
        break
print()
burned = count(forest, 'x') + count(forest, 'F')
standing = count(forest, 'T')
print(f'Burned: {burned} of {trees} ({round(burned * 100 / trees) if trees else 0}%)')
print(f'Standing: {standing}')
if out_at:
    print(f'The fire went out after {out_at} {"step" if out_at == 1 else "steps"}')
elif count(forest, 'F'):
    print(f'Still burning after {steps} {"step" if steps == 1 else "steps"}')
else:
    print('There was no fire')
```
