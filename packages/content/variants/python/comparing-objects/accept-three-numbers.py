class Version:
    def __init__(self, text):
        self.text = text
        a, b, c = text.split(".")
        self.major, self.minor, self.patch = int(a), int(b), int(c)

    def __str__(self):
        return self.text

    def __eq__(self, other):
        return (self.major, self.minor, self.patch) == (other.major, other.minor, other.patch)

    def __lt__(self, other):
        if self.major != other.major:
            return self.major < other.major
        if self.minor != other.minor:
            return self.minor < other.minor
        return self.patch < other.patch


versions = ["1.10.2", "1.9.0", "2.0.0", "1.9.0"]
current = "1.10.2"
all_versions = [Version(t) for t in versions]
print(" < ".join(map(str, sorted(all_versions))))
top = max(all_versions)
print("Newest:", top)
print("Up to date:", "yes" if Version(current) == top else "no")
