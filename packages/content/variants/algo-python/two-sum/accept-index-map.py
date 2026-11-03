def two_sum(values, goal):
    where = {}
    for j, v in enumerate(values):
        if goal - v in where:
            return where[goal - v], j
        where[v] = j


nums = [int(x) for x in input().split()]
i, j = two_sum(nums, int(input()))
print(i, j)
