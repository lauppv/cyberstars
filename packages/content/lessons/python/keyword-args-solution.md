```py
def book(name, destination, seats=1, window=False):
    line = f"{name} -> {destination}, seats {seats}"
    if window:
        line = line + ", window"
    return line


name = "Ada"
destination = "Mars"
seats = 2
window = True

print(book(window=window, name=name, seats=seats, destination=destination))
print(book(name=name, destination="Moon"))
```
