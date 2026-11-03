n = int(input())
nums = []
for x in input().split():
    nums.append(int(x))
print(*sorted(nums))
