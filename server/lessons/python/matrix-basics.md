A **matrix** is a grid of numbers organized in **rows** and **columns**. Think of a spreadsheet, a chess board, or a pixel screen — all are grids. In Python, we represent a matrix as a **list of lists**

```py
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
```
This is a **3×3** matrix (3 rows, 3 columns). Each inner list is a **row**

To access an element, we use **two indexes**: **matrix[row][column]**
```py
print(matrix[0][0])   # 1  (row 0, column 0)
print(matrix[1][2])   # 6  (row 1, column 2)
print(matrix[2][1])   # 8  (row 2, column 1)
```

---

To go through every element, we use **nested loops**
```py
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

for row in matrix:
    for element in row:
        print(element, end=" ")
    print()
```
Output
```text
1 2 3 
4 5 6 
7 8 9 
```
The outer loop goes through each **row** (which is a list). The inner loop goes through each **element** in that row. **print()** at the end starts a new line after each row

---

If we need the **indexes** (to know where we are)
```py
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

for i in range(len(matrix)):
    for j in range(len(matrix[i])):
        print(f"[{i}][{j}] = {matrix[i][j]}")
```

---

Common operations on matrices

**Sum of all elements**
```py
total = 0
for row in matrix:
    for element in row:
        total += element
print(total)
```
Output **45**

**Find the maximum**
```py
biggest = matrix[0][0]
for row in matrix:
    for element in row:
        if element > biggest:
            biggest = element
print(biggest)
```
Output **9**

---

A real-life use case: imagine a game map where 0 is empty and 1 is a wall

```py
gameMap = [
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 1],
    [1, 0, 0, 0]
]

walls = 0
for row in gameMap:
    for cell in row:
        if cell == 1:
            walls += 1
print(f"Number of walls: {walls}")
```
Output **Number of walls: 4**

---

You have a **4×4** matrix of scores. Write a program that displays

1. The **sum** of each row (on separate lines)
2. The **overall maximum** score

Expected output
```text
22
26
15
37
10
```