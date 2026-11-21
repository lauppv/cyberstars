class Version:
    def __init__(self, text):
        self.text = text

    def __str__(self):
        return self.text

    def __eq__(self, other):
        return self.text == other.text

    def __lt__(self, other):
        return self.text < other.text


versions = ["1.10.2", "1.9.0", "2.0.0", "1.9.0"]
current = "1.10.2"
ordered = sorted(Version(t) for t in versions)
print(" < ".join(str(v) for v in ordered))
print(f"Newest: {ordered[-1]}")
print(f"Up to date: {'yes' if Version(current) == ordered[-1] else 'no'}")
