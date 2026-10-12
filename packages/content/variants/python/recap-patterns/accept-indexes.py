log = "scan probe scan analyze probe scan boot"


def count_word(text, target):
    n = 0
    parts = text.split()
    i = 0
    while i < len(parts):
        if parts[i] == target:
            n = n + 1
        i += 1
    return n


def longest_word(text):
    best = None
    for item in text.split():
        if best is None or len(item) > len(best):
            best = item
    return best


def has_duplicate(text):
    found = False
    items = text.split()
    for a in range(len(items)):
        for b in range(a + 1, len(items)):
            if items[a] == items[b]:
                found = True
    return found


all_words = log.split()
print("Total words:", len(all_words))
print("Count of scan:", count_word(log, "scan"))
print("Longest word:", longest_word(log))
print("Has duplicate:", has_duplicate(log))
print("Unique words:", sorted(set(all_words)))
