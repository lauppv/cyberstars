def check_code(code):
    if len(code) < 4:
        raise ValueError("too short")
    for ch in code:
        if ch not in "0123456789":
            raise ValueError("digits only")
    if code == code[0] * len(code):
        raise ValueError("all the same")
    if code in "0123456789":
        raise ValueError("in a row")
    return code


codes = ["12", "4a21", "7777", "3456", "9071"]
for c in codes:
    try:
        result = check_code(c)
    except ValueError as err:
        print(c + ": " + str(err))
    else:
        print(c + ": ok")
