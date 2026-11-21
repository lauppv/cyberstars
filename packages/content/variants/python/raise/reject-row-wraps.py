def check_code(code):
    if len(code) < 4:
        raise ValueError("too short")
    if not code.isdigit():
        raise ValueError("digits only")
    if len(set(code)) == 1:
        raise ValueError("all the same")
    if code in "01234567890123":
        raise ValueError("in a row")
    return code


codes = ["12", "4a21", "7777", "3456", "9071"]
for c in codes:
    try:
        check_code(c)
        print(f"{c}: ok")
    except ValueError as e:
        print(f"{c}: {e}")
