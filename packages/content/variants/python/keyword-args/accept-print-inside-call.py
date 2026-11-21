def book(name, destination, seats=1, window=False):
    if window:
        return f"{name} -> {destination}, seats {seats}, window"
    return f"{name} -> {destination}, seats {seats}"


name = "Ada"
destination = "Mars"
seats = 2
window = True
print(book(destination=destination, name=name, window=window, seats=seats))
print(book(destination="Moon", name=name))
