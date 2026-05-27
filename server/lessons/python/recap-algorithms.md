Combine **linear search**, **frequency dictionary**, **bubble sort**, and **selection sort**

---

Build a **leaderboard system**. You have a list of game results where each entry is a player name:

```python
results = ["Ana", "Mihai", "Ana", "Elena", "Mihai", "Ana", "Radu", "Elena", "Mihai", "Ana"]
```

Each appearance = 1 win. Do the following:

1. Build a **frequency dictionary** counting wins per player
2. Use **linear search** to find the player with the most wins
3. Create a list of **(name, wins)** tuples and sort it by wins in **descending** order using **selection sort** (find the max, swap it to the front, repeat)
4. Print the sorted leaderboard with rankings

Expected output

```text
Wins: {'Ana': 4, 'Mihai': 3, 'Elena': 2, 'Radu': 1}
Champion: Ana (4 wins)
=== LEADERBOARD ===
1. Ana - 4 wins
2. Mihai - 3 wins
3. Elena - 2 wins
4. Radu - 1 wins
```
