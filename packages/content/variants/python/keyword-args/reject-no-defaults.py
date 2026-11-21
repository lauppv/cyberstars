def book(name, destination, seats, window):
    line = f"{name} -> {destination}, seats {seats}"
    if window:
        line = line + ", window"
    return line


name = "Ada"
destination = "Mars"
seats = 2
window = True
print(book(name=name, destination=destination, seats=seats, window=window))
print(book(name=name, destination="Moon", seats=1, window=False))
