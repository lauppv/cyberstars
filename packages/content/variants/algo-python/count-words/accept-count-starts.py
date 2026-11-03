line = " " + input()
print(sum(1 for i in range(1, len(line)) if line[i] != " " and line[i - 1] == " "))
