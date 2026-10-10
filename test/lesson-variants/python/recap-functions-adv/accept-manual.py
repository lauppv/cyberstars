readings = ["10", "bad", "25", "7", "x"]


def safe_int(text, fallback=0):
    try:
        return int(text)
    except Exception:
        return fallback


def summarize(nums):
    s = 0
    big = small = nums[0]
    for v in nums:
        s += v
        big = v if v > big else big
        small = v if v < small else small
    return [s, big, small]


numbers = []
idx = 0
while idx < len(readings):
    numbers += [safe_int(readings[idx])]
    idx += 1
print(f"Numbers: {numbers}")
total, largest, smallest = summarize(numbers)
print(f"Total: {total}\nLargest: {largest}\nSmallest: {smallest}")
