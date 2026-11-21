```py
def check_code(code):
    if len(code) < 4:
        raise ValueError("too short")
    if not code.isdigit():
        raise ValueError("digits only")
    if len(set(code)) == 1:
        raise ValueError("all the same")
    in_a_row = True
    for i in range(1, len(code)):
        if int(code[i]) != int(code[i - 1]) + 1:
            in_a_row = False
    if in_a_row:
        raise ValueError("in a row")
    return code


codes = ["12", "4a21", "7777", "3456", "9071"]

for code in codes:
    try:
        check_code(code)
        print(f"{code}: ok")
    except ValueError as e:
        print(f"{code}: {e}")
```
