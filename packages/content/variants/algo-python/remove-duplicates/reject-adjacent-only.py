input()
nums = input().split()
out = [nums[0]]
for x in nums[1:]:
    if x != out[-1]:
        out.append(x)
print(" ".join(out))
