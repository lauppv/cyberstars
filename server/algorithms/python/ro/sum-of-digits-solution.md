```py
n = int(input())

if n < 0:
    n = -n

suma = 0
while n > 0:
    suma = suma + n % 10
    n = n // 10

print(suma)
```
