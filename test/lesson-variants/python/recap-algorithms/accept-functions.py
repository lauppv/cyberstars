results = ["Rex", "Tommy", "Boris", "Tommy", "Cara", "Boris", "Tommy", "Cara", "Boris", "Tommy"]


def count(items):
    freq = {}
    for it in items:
        if it not in freq:
            freq[it] = 0
        freq[it] += 1
    return freq


def selection_sort_desc(pairs):
    pairs = list(pairs)
    for i in range(len(pairs)):
        m = i
        j = i + 1
        while j < len(pairs):
            if pairs[j][0] > pairs[m][0]:
                m = j
            j += 1
        pairs[i], pairs[m] = pairs[m], pairs[i]
    return pairs


freq = count(results)
ranked = selection_sort_desc([(c, n) for n, c in freq.items()])
print("Champion: " + ranked[0][1] + " (" + str(ranked[0][0]) + " wins)")
print("=== LEADERBOARD ===")
for i in range(len(ranked)):
    print(str(i + 1) + ". " + ranked[i][1] + " - " + str(ranked[i][0]) + " wins")
