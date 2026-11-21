def book(name, destination, seats=1, window=False):
    text = name + " -> " + destination + ", seats " + str(seats)
    return text + (", window" if window else "")


name = "Ada"
destination = "Mars"
seats = 2
window = True
first = book(name, destination, window=window, seats=seats)
print(first)
print(book(name, "Moon"))
