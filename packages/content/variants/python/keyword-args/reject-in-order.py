def book(name, destination, seats=1, window=False):
    line = f"{name} -> {destination}, seats {seats}"
    if window:
        line = line + ", window"
    return line


name = "Ada"
destination = "Mars"
seats = 2
window = True
print(book(name, destination, seats, window))
print(book(name, "Moon"))
