signal = "S7R2A9T4S"
message = ""
i = len(signal) - 1
while i >= 0:
    message = message + signal[i]
    i = i - 2
print("Check: " + signal[-3:])
print("Message: " + message)
