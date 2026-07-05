```py
def sort_chars(word):
    chars = []
    for ch in word:
        chars.append(ch)
    for i in range(len(chars)):
        for j in range(i + 1, len(chars)):
            if chars[j] < chars[i]:
                chars[i], chars[j] = chars[j], chars[i]
    result = ""
    for ch in chars:
        result = result + ch
    return result


def sort_words(words):
    for i in range(len(words)):
        for j in range(i + 1, len(words)):
            if words[j] < words[i]:
                words[i], words[j] = words[j], words[i]


n = int(input())
words = []
for _ in range(n):
    words.append(input())

groups = {}
for word in words:
    key = sort_chars(word)
    if key not in groups:
        groups[key] = []
    groups[key].append(word)

result = []
for key in groups:
    group = groups[key]
    sort_words(group)
    result.append(group)

for i in range(len(result)):
    for j in range(i + 1, len(result)):
        if result[j][0] < result[i][0]:
            result[i], result[j] = result[j], result[i]

for group in result:
    line = ""
    for i in range(len(group)):
        line = line + group[i]
        if i < len(group) - 1:
            line = line + " "
    print(line)
```
