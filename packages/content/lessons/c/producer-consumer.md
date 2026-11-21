One of the most common shapes of concurrent programs: one thread **produces** items, another one **consumes** them, and between them there is a small shared buffer with room for a few items. Think of a conveyor belt between two workers. A web server reading requests and a worker answering them, a program reading a file and another one compressing it: they all look like this

Two rules keep it working

1. The producer must wait when the buffer is **full**
2. The consumer must wait when the buffer is **empty**

---

The buffer is an array used in a circle: a **ring buffer**. We keep where the next item goes in, where the next item comes out, and how many items are inside. When an index reaches the end of the array, it goes back to 0, with %

```c
#include <stdio.h>

#define SIZE 4
int buffer[SIZE];
int in = 0, out = 0, count = 0;

void put(int item) {
    buffer[in] = item;
    in = (in + 1) % SIZE;
    count++;
}

int take(void) {
    int item = buffer[out];
    out = (out + 1) % SIZE;
    count--;
    return item;
}

int main(void) {
    for (int i = 1; i <= 3; i++) {
        put(i);
    }
    printf("%d\n", take());
    printf("%d\n", take());

    // 4, 5 and 6 go round the end of the array, back to 0
    for (int i = 4; i <= 6; i++) {
        put(i);
    }
    while (count > 0) {
        printf("%d\n", take());
    }
    return 0;
}
```

Output

```text
1
2
3
4
5
6
```

---

All of it is shared, so a mutex protects it. And the two kinds of waiting need two condition variables: one for "there is room now", one for "there is an item now"

```text
pthread_mutex_lock(&lock);
while (count == SIZE) {
    pthread_cond_wait(&not_full, &lock);
}
// put the item
pthread_cond_signal(&not_empty);
pthread_mutex_unlock(&lock);
```

The consumer is the mirror image: it waits while count is 0, takes an item, and signals not_full

---

How does the consumer know when to stop? A simple way is a special item that means "that's all", often called a **sentinel**. The producer puts it in last. When the consumer takes it, it stops, without treating it as a real item

---

The output of such a program is still predictable, even with two threads: the buffer is first in, first out, so the consumer gets the items in the order they were produced. What changes from run to run is only how full the buffer is at each moment, and that never shows in what the consumer prints

---

## Mission: The Conveyor Belt

Parts come off the press and go on a short conveyor belt to the packing station. The belt holds only a few parts at once. The press is one thread, the packer is another

1. Read B, the room on the belt, then whole numbers until the input ends: the weights of the parts. Every weight is greater than 0
2. Make a ring buffer of B places, with one mutex and two condition variables
3. Start a producer thread that puts every weight on the belt, in order, waiting while the belt is full. At the end it puts a 0 on the belt, the sentinel
4. Start a consumer thread that takes parts from the belt, waiting while it's empty. For each real part it prints `packed` and the weight. When it takes the 0, it stops
5. main waits for both threads and then prints the total weight that was packed

B is from 1 to 5, and there are from 1 to 1000 parts

**Example**

Input

```text
2
5 3 8 1
```

Output

```text
packed 5
packed 3
packed 8
packed 1
Total: 17
```
