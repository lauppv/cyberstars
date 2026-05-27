We learned that strings in C are arrays of **char** ending with **'\0'**. Working with them manually (character by character) is tedious. The **string.h** library gives us ready-made functions

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char name[] = "Tommy Vercetti";
    printf("Length: %lu\n", strlen(name));
    return 0;
}
```

Output: **Length: 14**

**strlen** returns the number of characters in the string, **NOT** counting the **'\0'**. The actual array has 15 chars (14 letters + '\0'), but strlen says 14. This is an important distinction

---

**strcmp** — compare two strings

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char a[] = "apple";
    char b[] = "banana";
    char c[] = "apple";

    printf("%d\n", strcmp(a, b));   // negative (a comes before b)
    printf("%d\n", strcmp(b, a));   // positive (b comes after a)
    printf("%d\n", strcmp(a, c));   // 0 (they're equal)
    return 0;
}
```

**strcmp** returns **0** if the strings are equal, a **negative** number if the first comes before the second (alphabetically), and a **positive** number if it comes after. Remember: in C, **you cannot compare strings with ==**. That compares **addresses**, not content

---

**strcpy** — copy one string into another

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char source[] = "Hello";
    char dest[20];

    strcpy(dest, source);
    printf("%s\n", dest);   // Hello
    return 0;
}
```

**strcpy(dest, source)** copies everything from **source** into **dest**, including the **'\0'**. Make sure **dest** is big enough! If it's too small, you get a **buffer overflow** — one of the most dangerous bugs in programming. This is how real security vulnerabilities happen

---

**strcat** — concatenate (join) two strings

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char greeting[50] = "Hello, ";
    strcat(greeting, "CyberStars!");
    printf("%s\n", greeting);   // Hello, CyberStars!
    return 0;
}
```

**strcat** appends the second string to the end of the first. Again, make sure the destination array is big enough for both strings plus the **'\0'**

---

A useful trick: **strstr** — find a substring

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char text[] = "I love programming in C";
    char *found = strstr(text, "programming");

    if (found != NULL) {
        printf("Found: %s\n", found);   // Found: programming in C
    }
    return 0;
}
```

**strstr** returns a pointer to where the substring starts, or **NULL** if it's not found. **NULL** is C's way of saying "nothing" — it's a special pointer value that means "points to nothing." We'll see it a lot

---

You have two char arrays: **first** with value **"Cyber"** and **second** with value **"Stars"**

1. Print the length of **first**
2. Copy **first** into a **result** array (make it big enough, like `char result[50]`)
3. Concatenate **second** onto **result**
4. Print **result**

Expected output

```text
5
CyberStars
```
