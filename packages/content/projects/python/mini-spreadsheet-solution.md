```python
cells = {}


class SheetError(Exception):
    pass


def tokens(text):
    out = []
    i = 0
    while i < len(text):
        ch = text[i]
        if ch == ' ':
            i += 1
        elif ch.isdigit() or ch == '.':
            j = i
            while j < len(text) and (text[j].isdigit() or text[j] == '.'):
                j += 1
            out.append(text[i:j])
            i = j
        elif ch.isalpha():
            j = i
            while j < len(text) and text[j].isalnum():
                j += 1
            out.append(text[i:j].upper())
            i = j
        elif ch in '+-*/():':
            out.append(ch)
            i += 1
        else:
            raise SheetError('#ERROR!')
    return out


def is_cell(tok):
    return len(tok) >= 2 and tok[0].isalpha() and tok[1:].isdigit() and len(tok) <= 3


def cell_range(a, b):
    c1, c2 = sorted([ord(a[0]), ord(b[0])])
    r1, r2 = sorted([int(a[1:]), int(b[1:])])
    return [chr(c) + str(r) for c in range(c1, c2 + 1) for r in range(r1, r2 + 1)]


class Parser:
    def __init__(self, toks, sheet):
        self.toks = toks
        self.pos = 0
        self.sheet = sheet

    def peek(self):
        return self.toks[self.pos] if self.pos < len(self.toks) else None

    def take(self, expected=None):
        tok = self.peek()
        if tok is None or (expected and tok != expected):
            raise SheetError('#ERROR!')
        self.pos += 1
        return tok

    def expr(self):
        value = self.term()
        while self.peek() in ('+', '-'):
            if self.take() == '+':
                value += self.term()
            else:
                value -= self.term()
        return value

    def term(self):
        value = self.factor()
        while self.peek() in ('*', '/'):
            op = self.take()
            right = self.factor()
            if op == '*':
                value *= right
            elif right == 0:
                raise SheetError('#DIV/0!')
            else:
                value /= right
        return value

    def factor(self):
        tok = self.take()
        if tok == '-':
            return -self.factor()
        if tok == '(':
            value = self.expr()
            self.take(')')
            return value
        if tok in ('SUM', 'MIN', 'MAX'):
            self.take('(')
            a = self.take()
            self.take(':')
            b = self.take()
            self.take(')')
            if not (is_cell(a) and is_cell(b)):
                raise SheetError('#ERROR!')
            values = [self.sheet.number(c) for c in cell_range(a, b)]
            return {'SUM': sum, 'MIN': min, 'MAX': max}[tok](values)
        if is_cell(tok):
            return self.sheet.number(tok)
        try:
            return float(tok)
        except ValueError:
            raise SheetError('#ERROR!')


class Sheet:
    def __init__(self):
        self.done = {}
        self.visiting = set()

    def value(self, name):
        if name in self.done:
            return self.done[name]
        raw = cells.get(name, '')
        if name in self.visiting:
            raise SheetError('#CYCLE!')
        if raw.startswith('"'):
            result = raw.strip('"')
        elif raw == '':
            result = 0.0
        else:
            self.visiting.add(name)
            try:
                p = Parser(tokens(raw), self)
                result = p.expr()
                if p.peek() is not None:
                    raise SheetError('#ERROR!')
            except SheetError as err:
                result = err
            finally:
                self.visiting.discard(name)
        self.done[name] = result
        return result

    def number(self, name):
        v = self.value(name)
        if isinstance(v, SheetError):
            raise SheetError(str(v))
        if isinstance(v, str):
            raise SheetError('#VALUE!')
        return v


def show(v):
    if isinstance(v, SheetError):
        return str(v)
    if isinstance(v, str):
        return v
    if abs(v - round(v)) < 1e-9:
        return str(int(round(v)))
    return f'{v:.2f}'


while True:
    try:
        line = input().strip()
    except EOFError:
        break
    if not line:
        continue
    if line == 'print':
        if not cells:
            print('(empty)')
            continue
        sheet = Sheet()
        last_col = max(ord(c[0]) for c in cells)
        last_row = max(int(c[1:]) for c in cells)
        cols = [chr(c) for c in range(ord('A'), last_col + 1)]
        print(('    ' + ''.join(f'{c:^10}' for c in cols)).rstrip())
        for r in range(1, last_row + 1):
            row = f'{r:>3} '
            for c in cols:
                name = c + str(r)
                v = sheet.value(name) if name in cells else ''
                text = show(v) if name in cells else ''
                row += f'{text:<10}' if isinstance(v, str) and name in cells else f'{text:>10}'
            print(row.rstrip())
    elif line.startswith('show '):
        name = line[5:].strip().upper()
        if name not in cells:
            print(f'{name} is empty')
        else:
            print(f'{name} = {cells[name]} -> {show(Sheet().value(name))}')
    elif '=' in line:
        typed, formula = line.split('=', 1)
        name = typed.strip().upper()
        if not is_cell(name):
            print(f'Not a cell: {typed.strip()}')
            continue
        formula = formula.strip()
        if formula == '':
            cells.pop(name, None)
        else:
            cells[name] = formula
    else:
        print(f"I don't understand: {line}")
```
