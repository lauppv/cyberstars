scores = {"Tommy": 88, "Lance": 95, "Cortez": 70}

for k in scores.keys():
    print(k)
running = 0
for v in scores.values():
    print(v)
    running += v
print(f"Total: {running}")
print(f"Average: {running / len(scores)}")
leader = None
for who, pts in scores.items():
    if leader is None or pts > scores[leader]:
        leader = who
print(f"Top: {leader}")
