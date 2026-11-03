n = int(input())
nums = list(map(int, input().split()))
out = []
while nums:
    smallest = min(nums)
    nums.remove(smallest)
    out.append(smallest)
print(*out)
