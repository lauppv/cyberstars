replies = {"status": "System active"}
powered_on = True
while powered_on:
    text = input()
    if text == "shutdown":
        powered_on = False
        continue
    print(replies.get(text, "Unknown command"))
print("Closing console...")
