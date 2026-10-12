def add_task(board, title):
    board.append({"name": title, "done": False})


def complete_task(board, i):
    board[i]["done"] = True


def count_done(board):
    return len([t for t in board if t["done"]])


board = []
for _ in range(int(input())):
    add_task(board, input())
for part in input().split(" "):
    complete_task(board, int(part))
for i in range(len(board)):
    mark = "[done]" if board[i]["done"] else "[pending]"
    print(str(i) + ". " + mark + " " + board[i]["name"])
print("Completed: " + str(count_done(board)) + "/" + str(len(board)))
