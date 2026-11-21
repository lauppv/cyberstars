Next project: a booking system for a small plane at Escobar International, the Vice City airport. People ask for a seat, or for any seat. The system hands seats out, says no to bad requests, and keeps a waiting list when the plane is full

You'll use a 2D array, chars, your own exception, a queue and a StringBuilder. One step at a time

---

**Step 1: The seat map**

A plane has rows, and every row has the same number of seats. That's a grid, so we use a 2D array. Each cell holds the passenger's name, or `null` when the seat is free

```text
class Plane {
    String[][] seats;

    Plane(int rows, int seatsPerRow) {
        seats = new String[rows][seatsPerRow];
    }
}
```

A new array of Strings is full of `null`, so a new plane starts empty

---

**Step 2: From a seat code to the grid**

Passengers speak in seat codes like `3B`: the row number, then a letter. The grid speaks in indexes that start at 0. So `3B` is row index 2 and seat index 1

```java
public class Main {
    public static void main(String[] args) {
        String code = "12C";

        int row = Integer.parseInt(code.substring(0, code.length() - 1)) - 1;
        int col = code.charAt(code.length() - 1) - 'A';
        System.out.println(row + " " + col);

        String back = (row + 1) + "" + (char) ('A' + col);
        System.out.println(back);
    }
}
```

Output

```text
11 2
12C
```

The last character is the letter, everything before it is the number. `'C' - 'A'` is 2, because chars are numbers inside. To go back, add the index to `'A'` and turn it into a `char`

---

**Step 3: An exception for bad seats**

A seat can be wrong in two ways: it doesn't exist on this plane, or someone already has it

```text
class SeatException extends Exception {
    SeatException(String message) {
        super(message);
    }
}
```

---

**Step 4: Booking a chosen seat**

Turn the code into indexes, check them, then take the seat

```text
void book(String name, String code) throws SeatException {
    int row = Integer.parseInt(code.substring(0, code.length() - 1)) - 1;
    int col = code.charAt(code.length() - 1) - 'A';
    if (row < 0 || row >= seats.length || col < 0 || col >= seats[0].length) {
        throw new SeatException("No seat " + code);
    }
    if (seats[row][col] != null) {
        throw new SeatException("Seat " + code + " is taken");
    }
    seats[row][col] = name;
}
```

Check that the seat exists before you look inside it. In the other order, `seats[row][col]` would crash with an index out of bounds

---

**Step 5: Any free seat, or the waiting list**

Some people don't care where they sit. Walk the grid row by row, seat by seat, and give them the first free one. If there is none, they go into a queue: first to wait, first to get a seat later

```text
Queue<String> waiting = new LinkedList<>();

String bookAny(String name) {
    for (int r = 0; r < seats.length; r++) {
        for (int c = 0; c < seats[r].length; c++) {
            if (seats[r][c] == null) {
                seats[r][c] = name;
                return (r + 1) + "" + (char) ('A' + c);
            }
        }
    }
    waiting.offer(name);
    return null;
}
```

The `return` inside the loops stops the search at the first free seat. If the loops end without a `return`, the plane is full

---

**Step 6: Printing the map**

For the crew, print one line per row: the row number, a space, then `X` for a taken seat and `.` for a free one. A StringBuilder builds each line

```java
public class Main {
    public static void main(String[] args) {
        String[][] seats = new String[2][3];
        seats[0][1] = "Tommy";
        seats[1][0] = "Lance";

        for (int r = 0; r < seats.length; r++) {
            StringBuilder line = new StringBuilder();
            line.append(r + 1).append(" ");
            for (String s : seats[r]) {
                line.append(s == null ? "." : "X");
            }
            System.out.println(line);
        }
    }
}
```

Output

```text
1 .X.
2 X..
```

---

## Mission: Escobar International

Build the plane from the steps above, then run the day's bookings through it

The plane has `int rows` rows and `int seatsPerRow` seats in each row (at most 6, so the letters go from A to F). The bookings are in a `String[] bookings` array. Each one is `name:seat`, like `Tommy:1A`, or `name:any`. Make a `SeatException` that extends `Exception`, and keep the seats in a 2D array. For each booking, print:

- `name gets seat` when it works, with the seat they got
- `Refused: No seat code` when the seat isn't on the plane, and `Refused: Seat code is taken` when someone has it
- `name waits for a seat` when they asked for any seat and the plane is full

At the end, print the map, one line per row as in step 6, then `Waiting: ` and the names on the waiting list in order, separated by a comma and a space, or `Waiting: nobody`

**Example**

```text
Tommy gets 1A
Refused: Seat 1A is taken
Lance gets 1B
Refused: No seat 3A
Kent gets 2B
Phil gets 2A
Candy waits for a seat
Diaz waits for a seat
1 XX
2 XX
Waiting: Candy, Diaz
```

**Example**

```text
1 ...
Waiting: nobody
```
