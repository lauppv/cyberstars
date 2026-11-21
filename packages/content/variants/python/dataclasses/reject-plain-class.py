class Crate:
    def __init__(self, weight, label):
        self.weight = weight
        self.label = label

    def __repr__(self):
        return f"Crate(weight={self.weight}, label={self.label!r})"

    def __eq__(self, other):
        return (self.weight, self.label) == (other.weight, other.label)

    def __lt__(self, other):
        return (self.weight, self.label) < (other.weight, other.label)


weights = [40, 5, 40]
labels = ["food", "seeds", "books"]
crates = [Crate(w, l) for w, l in zip(weights, labels)]
ordered = sorted(crates)
for c in ordered:
    print(c)
print(f"Heaviest: {ordered[-1].label}")
print(f"Same as first: {crates.count(crates[0])}")
