log = "scan probe scan analyze probe scan boot"

def count_word(log, word):
    total = 0
    for token in log.split(" "):
        total += token == word
    return total

def longest_word(log):
    result = ""
    for token in log.split(" "):
        if len(token) > len(result):
            result = token
    return result

def has_duplicate(log):
    counts = {}
    for token in log.split(" "):
        counts[token] = counts.get(token, 0) + 1
    dup = False
    for c in counts.values():
        if c > 1:
            dup = True
    return dup

tokens = log.split(" ")
print("Total words: " + str(len(tokens)))
print("Count of scan: " + str(count_word(log, "scan")))
print("Longest word: " + longest_word(log))
print("Has duplicate: " + str(has_duplicate(log)))
print("Unique words: " + str(sorted(set(tokens))))
