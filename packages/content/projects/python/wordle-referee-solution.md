```python
def marks(secret, guess):
    result = ['.'] * 5
    left = {}
    for i in range(5):
        if guess[i] == secret[i]:
            result[i] = 'G'
        else:
            left[secret[i]] = left.get(secret[i], 0) + 1
    for i in range(5):
        if result[i] != 'G' and left.get(guess[i], 0) > 0:
            result[i] = 'Y'
            left[guess[i]] -= 1
    return ''.join(result)


words = set(input()[len('words:'):].upper().split())
games = []
while True:
    try:
        line = input().strip()
    except EOFError:
        break
    if line:
        secret, guesses = line.split(':')
        games.append((secret.strip().upper(), guesses.upper().split()))
print(f'Words: {len(words)}, games: {len(games)}')

solved_in = []
for number, (secret, guesses) in enumerate(games, 1):
    print()
    print(f'Game {number}')
    tries = 0
    won = False
    absent = set()
    for guess in guesses:
        if len(guess) != 5 or guess not in words:
            print(f'{guess:<5}  not a word')
            continue
        tries += 1
        m = marks(secret, guess)
        print(f'{guess}  {m}')
        for letter, mark in zip(guess, m):
            if mark == '.' and letter not in secret:
                absent.add(letter)
        if m == 'GGGGG':
            won = True
            break
        if tries == 6:
            break
    if won:
        print(f'Solved in {tries}')
        solved_in.append(tries)
    else:
        print(f'Not solved, the word was {secret}')
    print('Never in the word: ' + (', '.join(sorted(absent)) if absent else 'nothing'))

print()
print(f'Played: {len(games)}')
print(f'Won: {round(len(solved_in) * 100 / len(games)) if games else 0}%')
for n in range(1, 7):
    count = solved_in.count(n)
    print(f'{n}: {"#" * count} {count}' if count else f'{n}: 0')
```
