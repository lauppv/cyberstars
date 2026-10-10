def swap(arr, a, b):
    arr[a], arr[b] = arr[b], arr[a]


def bubble_sort(nums):
    n = len(nums)
    for done in range(n - 1):
        for idx in range(n - 1 - done):
            if nums[idx + 1] < nums[idx]:
                swap(nums, idx, idx + 1)
    return nums


batch1 = [42, 17, 88, 9, 23]
batch2 = [5, 4, 3, 2, 1]
for batch in (batch1, batch2):
    print(bubble_sort(batch))
