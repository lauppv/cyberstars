def parse(text):
    nums = sorted(int(p) for p in text.split())
    return sum(nums), nums[-1], nums[0]


s, hi, lo = parse(input())
print("Total:", s)
print("Largest:", hi)
print("Smallest:", lo)
