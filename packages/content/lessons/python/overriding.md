A child class gets its parent's methods. But sometimes a child must do the same job in its own way. When it writes a method with the same name as the parent's, its own version wins for its objects. This is called **overriding**

---

Here every alarm can make a sound, but a fire alarm makes a different one

```py
class Alarm:
    def sound(self):
        return "beep"

class FireAlarm(Alarm):
    def sound(self):
        return "WEE-OO WEE-OO"

print(Alarm().sound())
print(FireAlarm().sound())
```

Output

```text
beep
WEE-OO WEE-OO
```

Python looks for a method in the object's own class first, then in the parent. A `FireAlarm` finds `sound` in its own class, so the parent's is never reached

---

The child's version can also build on the parent's, with `super()`, instead of replacing it all

```py
class Alarm:
    def __init__(self, place):
        self.place = place

    def message(self):
        return f"Alarm in {self.place}"

class FireAlarm(Alarm):
    def message(self):
        return super().message() + ": fire, leave now"

print(FireAlarm("Lab").message())
```

Output

```text
Alarm in Lab: fire, leave now
```

If the parent's message changes later, the fire alarm follows, since it never copied the parent's words

---

The best part: code that uses alarms doesn't need to know which kind it has. It calls `message()`, and each object answers in its own way

```py
class Alarm:
    def __init__(self, place):
        self.place = place

    def message(self):
        return f"Alarm in {self.place}"

class FireAlarm(Alarm):
    def message(self):
        return super().message() + ": fire, leave now"

class DoorAlarm(Alarm):
    def message(self):
        return f"Door open in {self.place}"

for alarm in [Alarm("Dock"), FireAlarm("Lab"), DoorAlarm("Gym")]:
    print(alarm.message())
```

Output

```text
Alarm in Dock
Alarm in Lab: fire, leave now
Door open in Gym
```

The loop has no `if` about kinds. Adding a new kind of alarm later needs a new class, not a change to the loop

---

`__str__` and `__init__` can be overridden too, in the same way. That's what we did with `__init__` and `super()` in the last lesson

---

## Mission: Alarm Panel

The station's alarm panel shows one line for each alarm. Every kind of alarm writes its line in its own way

1. Write a class **Alarm** with an `__init__` that takes a `place`, and a method **message()** that returns `Alarm in place`
2. Write a class **FireAlarm** that inherits from `Alarm` and overrides **message()**: it returns the parent's message with `: fire, leave now` added, using `super()`
3. Write a class **DoorAlarm** that inherits from `Alarm` and overrides **message()**: it returns `Door open in place`
4. Start your program with two variables: **places** and **kinds**, two lists of strings in the same order. A kind is `fire`, `door` or `basic`. For example `places = ["Dock", "Lab", "Gym"]` and `kinds = ["basic", "fire", "door"]`
5. Make the right kind of alarm for each place, keep them in a list, and print the message of each with one loop that has no `if` about kinds
6. Print `Fire alarms: ` and how many fire alarms there are

The lists have from 1 to 10 alarms

**Example** for the values above

```text
Alarm in Dock
Alarm in Lab: fire, leave now
Door open in Gym
Fire alarms: 1
```
