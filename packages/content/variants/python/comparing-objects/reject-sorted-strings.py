class Version:
    def __init__(self, text):
        self.text = text
        self.parts = [int(p) for p in text.split(".")]

    def __str__(self):
        return self.text

    def __eq__(self, other):
        return self.parts == other.parts

    def __lt__(self, other):
        return self.parts < other.parts


versions = ["1.10.2", "1.9.0", "2.0.0", "1.9.0"]
current = "1.10.2"
ordered = sorted(versions)
print(" < ".join(ordered))
newest = Version(ordered[-1])
print(f"Newest: {newest}")
print(f"Up to date: {'yes' if Version(current) == newest else 'no'}")
