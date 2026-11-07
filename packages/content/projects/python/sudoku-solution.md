```python
grid = []
for _ in range(9):
    grid.append([0 if ch == '.' else int(ch) for ch in input().strip()])


def show(g):
    for r in range(9):
        if r in (3, 6):
            print('------+-------+------')
        cells = ['.' if v == 0 else str(v) for v in g[r]]
        print(' '.join(cells[0:3]) + ' | ' + ' '.join(cells[3:6]) + ' | ' + ' '.join(cells[6:9]))


def mistakes(g):
    found = []
    groups = [('Row', i + 1, [(i, c) for c in range(9)]) for i in range(9)]
    groups += [('Column', i + 1, [(r, i) for r in range(9)]) for i in range(9)]
    groups += [('Box', i + 1, [(i // 3 * 3 + k // 3, i % 3 * 3 + k % 3) for k in range(9)]) for i in range(9)]
    for kind, number, cells in groups:
        values = [g[r][c] for r, c in cells if g[r][c]]
        for d in sorted(set(values)):
            if values.count(d) > 1:
                found.append(f'{kind} {number} has {values.count(d)} {d}s')
    return found


def candidates(g, r, c):
    used = set(g[r]) | {g[i][c] for i in range(9)}
    br, bc = r // 3 * 3, c // 3 * 3
    used |= {g[br + i][bc + j] for i in range(3) for j in range(3)}
    return [d for d in range(1, 10) if d not in used]


guesses = 0


def solve(g):
    global guesses
    for r in range(9):
        for c in range(9):
            if g[r][c] == 0:
                for d in candidates(g, r, c):
                    g[r][c] = d
                    guesses += 1
                    if solve(g):
                        return True
                g[r][c] = 0
                return False
    return True


show(grid)
print()
found = mistakes(grid)
if found:
    print('Mistakes:')
    for m in found:
        print('  ' + m)
else:
    empty = sum(row.count(0) for row in grid)
    print(f'Empty cells: {empty}')
    sure = 0
    while True:
        filled = False
        for r in range(9):
            for c in range(9):
                if grid[r][c] == 0:
                    options = candidates(grid, r, c)
                    if len(options) == 1:
                        grid[r][c] = options[0]
                        sure += 1
                        filled = True
        if not filled:
            break
    print(f'Sure cells: {sure}')
    if solve(grid):
        print(f'Guesses: {guesses}')
        print()
        show(grid)
    else:
        print(f'Guesses: {guesses}')
        print('No solution')
```
