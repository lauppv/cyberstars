fuels = [1, 2, 3, 4, 5, 6, 7, 8, 9]
target = 10


def pair_with_sum(nums, goal):
    found = []
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        s = nums[lo] + nums[hi]
        if s < goal:
            lo += 1
        elif s > goal:
            hi -= 1
        else:
            found.append((nums[lo], nums[hi]))
            lo, hi = lo + 1, hi - 1
    return found


pairs = pair_with_sum(fuels, target)
print("Pairs:", pairs)
print("Total pairs:", len(pairs))
