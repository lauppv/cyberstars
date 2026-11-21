def check_code(code):
    if len(code) < 4:
        return "too short"
    if not code.isdigit():
        return "digits only"
    if len(set(code)) == 1:
        return "all the same"
    in_a_row = True
    for i in range(1, len(code)):
        if int(code[i]) != int(code[i - 1]) + 1:
            in_a_row = False
    if in_a_row:
        return "in a row"
    return "ok"


codes = ["12", "4a21", "7777", "3456", "9071"]

for code in codes:
    try:
        print(f"{code}: {check_code(code)}")
    except ValueError:
        print(f"{code}: digits only")
