signals = ["A1", "B2", "A1", "C3", "B2", "A1", "D4", "C3"]
total = len(signals)
codes = set(signals)
message = "D4 missing"
if codes.__contains__("D4"):
    message = "D4 detected"
print("Total: " + str(total))
print("Unique: " + str(len(codes)))
print(message)
