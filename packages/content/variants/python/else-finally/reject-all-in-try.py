def import_reading(text, readings, checked):
    try:
        number = int(text)
        readings.append(number)
        print("saved", number)
    except ValueError:
        print("skipped", repr(text))
    checked.append(text)


texts = ["21", "x7", "-3", ""]
readings, checked = [], []
for text in texts:
    import_reading(text, readings, checked)
print(f"Saved: {readings}")
print(f"Checked: {len(checked)}")
