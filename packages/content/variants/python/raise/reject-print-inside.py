def check_code(code):
    if len(code) < 4:
        return "too short"
    if not code.isdigit():
        return "digits only"
    if len(set(code)) == 1:
        return "all the same"
    if code in "0123456789":
        return "in a row"
    return "ok"


codes = ["12", "4a21", "7777", "3456", "9071"]
for c in codes:
    try:
        print(f"{c}: {check_code(c)}")
    except ValueError:
        raise
