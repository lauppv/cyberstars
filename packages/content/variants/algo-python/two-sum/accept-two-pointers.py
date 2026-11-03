nums = list(map(int, input().split()))
target = int(input())
order = sorted(range(len(nums)), key=lambda i: nums[i])
lo, hi = 0, len(order) - 1
while lo < hi:
    total = nums[order[lo]] + nums[order[hi]]
    if total == target:
        a, b = order[lo], order[hi]
        print(min(a, b), max(a, b))
        break
    if total < target:
        lo += 1
    else:
        hi -= 1
