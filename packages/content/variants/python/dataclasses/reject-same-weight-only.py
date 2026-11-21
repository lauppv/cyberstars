from dataclasses import dataclass


@dataclass(order=True)
class Crate:
    weight: int
    label: str


weights = [40, 5, 40]
labels = ["food", "seeds", "books"]
crates = [Crate(w, l) for w, l in zip(weights, labels)]
ordered = sorted(crates)
for c in ordered:
    print(c)
print(f"Heaviest: {ordered[-1].label}")
print(f"Same as first: {sum(1 for c in crates if c.weight == crates[0].weight)}")
