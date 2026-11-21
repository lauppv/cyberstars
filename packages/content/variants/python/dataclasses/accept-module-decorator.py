import dataclasses


@dataclasses.dataclass(order=True)
class Crate:
    weight: int
    label: str


weights = [40, 5, 40]
labels = ["food", "seeds", "books"]
crates = []
for i in range(len(weights)):
    crates.append(Crate(weight=weights[i], label=labels[i]))
crates_sorted = sorted(crates)
print("\n".join(str(c) for c in crates_sorted))
print("Heaviest:", max(crates).label)
print("Same as first:", sum(1 for c in crates if c == crates[0]))
