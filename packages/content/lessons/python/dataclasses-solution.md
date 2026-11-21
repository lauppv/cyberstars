```py
from dataclasses import dataclass


@dataclass(order=True)
class Crate:
    weight: int
    label: str


weights = [40, 5, 40]
labels = ["food", "seeds", "books"]

crates = [Crate(w, l) for w, l in zip(weights, labels)]
ordered = sorted(crates)
for crate in ordered:
    print(crate)
print(f"Heaviest: {ordered[-1].label}")
print(f"Same as first: {crates.count(crates[0])}")
```
