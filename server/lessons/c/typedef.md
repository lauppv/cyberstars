Writing **struct Player** everywhere gets tiring. **typedef** lets us create a shorter name for any type

```c
#include <stdio.h>

typedef struct {
    char name[50];
    int health;
    int score;
} Player;

int main(void) {
    Player p = {"Tommy", 100, 500};
    printf("%s: %d HP\n", p.name, p.health);
    return 0;
}
```

Now we write **Player** instead of **struct Player**. Much cleaner. This is how most C codebases define their structs

---

The pattern is **typedef existing_type new_name**

```c
typedef int Score;
typedef char* String;

Score highScore = 9999;
String name = "Vercetti";
```

We can give meaningful names to types. **Score** is still an int underneath, but the name tells you what it represents

---

**typedef** really shines with function pointers (if you're curious) and with removing the **struct** keyword. Here's the most common pattern you'll see in real code

```c
typedef struct {
    double x;
    double y;
} Point;

typedef struct {
    Point center;
    double radius;
} Circle;

void printCircle(Circle *c) {
    printf("Center: (%.1f, %.1f), Radius: %.1f\n",
           c->center.x, c->center.y, c->radius);
}
```

Notice how we can use **Point** inside **Circle**. Structs inside structs — **composition**. This is how C programs build complex data structures without classes

---

Define a **typedef** struct called **Student** with fields: **name** (char array), **grade** (int), **average** (double)

Create an array of **3 students**:
- "Ana", 10, 9.5
- "Mihai", 11, 8.2
- "Elena", 10, 9.8

Loop through them and print each one

Expected output
```text
Ana - Grade 10 - Avg 9.50
Mihai - Grade 11 - Avg 8.20
Elena - Grade 10 - Avg 9.80
```

Use **printf("%.2f")** for the average to get 2 decimal places
