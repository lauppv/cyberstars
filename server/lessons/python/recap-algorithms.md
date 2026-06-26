Combine **linear search**, **frequency dictionary**, **bubble sort**, and **selection sort**

---

## Mission: Mission Leaderboard

Every time a crew member completes a mission, their name is logged. Each appearance counts as **one win**. Mission Control wants a ranked leaderboard.

Pull together everything from this chapter:

1. Build a **frequency dictionary** counting wins per crew member, then print `Wins: ` followed by the dictionary.
2. Scan the dictionary (**linear search**) to find the crew member with the most wins, and print `Champion: ` then the name and win count, like `Champion: Tommy (4 wins)`.
3. Build a list of **(wins, name)** tuples, then sort it from most wins to fewest using **selection sort** (find the max each pass, swap it to the front).
4. Print `=== LEADERBOARD ===`, then each crew member on its own line as `rank. name - count wins` (for example, `1. Tommy - 4 wins`).

**Output**

```text
Wins: {'Rex': 1, 'Tommy': 4, 'Boris': 3, 'Cara': 2}
Champion: Tommy (4 wins)
=== LEADERBOARD ===
1. Tommy - 4 wins
2. Boris - 3 wins
3. Cara - 2 wins
4. Rex - 1 wins
```
