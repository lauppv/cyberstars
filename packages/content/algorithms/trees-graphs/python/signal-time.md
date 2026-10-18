A network has `n` towers joined by cables, and a signal leaves tower `s` at minute `0`. Each cable takes the signal a number of minutes, and a tower passes the signal on along all its cables the moment it arrives. Print the minute when the last tower gets the signal, or `-1` if some tower never gets it.

### How the network is written

The first line has the number of towers `n` and the number of cables `m`. Then come `m` lines, one per cable: the two towers it joins and how many minutes the signal takes along it, either way. The towers are numbered from `0` to `n - 1`.

```
0 ---7--- 1
|         |
1         2
|         |
2 ---1--- 3
```

This network is written:

```
4 4
0 1 7
1 3 2
0 2 1
2 3 1
```

The hidden part of the program already reads the network into `adj`, where `adj[u]` lists one `(v, w)` pair per cable at `u`: it goes to `v` and takes `w` minutes, then prints what `signal_time` returns. You write `signal_time`.

### Input

- Line 1: `n` and `m`. There are between 1 and 500 towers and at most 2000 cables.
- The next `m` lines: the cables, each `u v w`, where `w` is between 1 and 1000. No cable joins a tower to itself, and no two cables join the same two towers.
- Last line: `s`.

### Output

The minute the last tower gets the signal, or `-1`.

### Examples

```
Input:
4 4
0 1 7
1 3 2
0 2 1
2 3 1
0

Output:
4
```

The cable from `0` straight to `1` takes 7 minutes, but through `2` and `3` the signal gets there in 1 + 1 + 2 = 4.

```
Input:
3 1
0 1 5
0

Output:
-1
```

Tower `2` has no cable, so the signal never reaches it.

```
Input:
1 0
0

Output:
0
```
