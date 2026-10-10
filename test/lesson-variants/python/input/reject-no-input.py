import sys

lines = sys.stdin.read().split("\n")
name = lines[0]
age = int(lines[1])
print(f"Welcome aboard, {name}! You are {age}. Next year you will be {age + 1}.")
