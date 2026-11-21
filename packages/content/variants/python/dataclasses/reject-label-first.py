from dataclasses import dataclass


@dataclass(order=True)
class Crate:
    label: str
    weight: int


weights = [40, 5, 40]
labels = ["food", "seeds", "books"]
crates = [Crate(l, w) for w, l in zip(weights, labels)]
ordered = sorted(crates)
for c in ordered:
    print(c)
print(f"Heaviest: {ordered[-1].label}")
print(f"Same as first: {crates.count(crates[0])}")
