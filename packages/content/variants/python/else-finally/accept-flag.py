def import_reading(text, readings, checked):
    try:
        value = int(text)
    except ValueError:
        print("skipped " + repr(text))
    else:
        readings += [value]
        print("saved " + str(value))
    finally:
        checked.append(text)


texts = ["21", "x7", "-3", ""]
good, seen = [], []
for t in texts:
    import_reading(t, good, seen)
print("Saved:", good)
print("Checked:", len(seen))
