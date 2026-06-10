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
#include <stdio.h>

typedef int Score;
typedef char* String;

int main(void) {
    Score high_score = 9999;
    String name = "Vercetti";
    printf("%d %s\n", high_score, name);
    return 0;
}
```

We can give meaningful names to types. **Score** is still an int underneath, but the name tells you what it represents

---

**typedef** really shines with function pointers (if you're curious) and with removing the **struct** keyword. Here's the most common pattern you'll see in real code

```c
#include <stdio.h>

typedef struct {
    double x;
    double y;
} Point;

typedef struct {
    Point center;
    double radius;
} Circle;

void print_circle(Circle *c) {
    printf("Center: (%.1f, %.1f), Radius: %.1f\n",
           c->center.x, c->center.y, c->radius);
}

int main(void) {
    Circle c = {{2.0, 3.0}, 5.0};
    print_circle(&c);
    return 0;
}
```

Notice how we can use **Point** inside **Circle**. Structs inside structs — **composition**. This is how C programs build complex data structures without classes

---

## Mission: Crew Performance Report

The station captain wants a formatted report of crew members' performance scores. Use **typedef** to define a clean struct and loop through the roster.

1. Define a **typedef** struct called **CrewMember** with fields: **name** (char array), **rank** (int), **rating** (double)
2. Create an array of **3 crew members** with the values shown below
3. Loop through them and print each one in the format **"Name - Rank X - Rating Y.YY"**

**Input** (already set at the top of your code — change the values to test):

- **"Tommy"**, rank **10**, rating **9.50**
- **"Lance"**, rank **11**, rating **8.20**
- **"Cortez"**, rank **10**, rating **9.80**

**Example**

With the starter values, your program should print

```text
Tommy - Rank 10 - Rating 9.50
Lance - Rank 11 - Rating 8.20
Cortez - Rank 10 - Rating 9.80
```
