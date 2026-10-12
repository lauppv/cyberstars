```py
s = input()

is_palindrome = True
left = 0
right = len(s) - 1
while left < right:
    if s[left] != s[right]:
        is_palindrome = False
        break
    left = left + 1
    right = right - 1

print(is_palindrome)
```
