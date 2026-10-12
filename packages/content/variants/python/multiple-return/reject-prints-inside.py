def parse(reading):
    parts = [int(p) for p in reading.split(" ")]
    print(f"Total: {sum(parts)}")
    print(f"Largest: {max(parts)}")
    print(f"Smallest: {min(parts)}")


parse(input())
