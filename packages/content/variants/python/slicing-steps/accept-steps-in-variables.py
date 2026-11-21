signal = "S7R2A9T4S"
backwards = signal[::-1]
hidden = backwards[::2]
check = signal[len(signal) - 3:]
print("Check:", check)
print("Message:", hidden)
