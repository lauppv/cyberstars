In the previous lesson we saw that we can make decisions in code just like we do in real life

Still, how could I implement the following story?

We have a rocket that launches from the ground. Depending on how many seconds are left until launch, we want to prepare for the big event

If we have **100** seconds left, we start all onboard computers

If we have **60** seconds left, we check the connection with the control tower

If we have **20** seconds left, we start the secondary engines

If we have **10** seconds left, we start the main engines

If we have less than **10** seconds left, we check whether all components are running properly:
 If even the smallest error appears anywhere, we cancel the launch

Here we can see that we have 2 conditions inside one another

```py
seconds = 100  # number of seconds
error_detected = False # no error in the beginning

if seconds == 100:
    print("Starting all onboard computers")
elif seconds == 60:
    print("Checking connection with the control tower")
elif seconds == 20:
    print("Starting secondary engines")
elif seconds == 10:
    print("Starting the main engines")
elif seconds < 10:  # the last 10 seconds
    if error_detected == True:
        print("Error detected. Canceling the mission")
    else:
        print("No error detected. Taking off...")
else: # unknown number of seconds
    print(f"{seconds} seconds has no effect")
```

An explanation of this code would be very complicated. **Run** the code as it is, then change the two variables. Change seconds to 60, 20, 10, then 9. See how the program’s output changes. Also change **error_detected** to **True** and see how the program reacts. The code may look intimidating, but in the end it’s just a story. Feel free to **play around**

So, we can see how **elif** is nothing more than another **if**. Still, why did we use if-elif-elif-elif...else? **Why chain them?**

If we test the **same variable for multiple cases**, we chain them with **if-elif-else**. The program runs from top to bottom. At the first if/elif whose condition is true, it enters and runs the code in that block, and then it exits completely

```py
seconds = 60  # number of seconds
error_detected = False # no error in the beginning

if seconds == 100:
    print("Starting all onboard computers")
elif seconds == 60:
    # the program will enter here and display this print
    print("Checking connection with the control tower")
    # after displaying it, it jumps out of the chain
elif seconds == 20:
    print("Starting secondary engines")
elif seconds == 10:
    print("Starting the main engines")
elif seconds < 10:  # the last 10 seconds
    if error_detected == True:
        print("Error detected. Canceling the mission")
    else:
        print("No error detected. Taking off...")
else: # unknown number of seconds
    print(f"{seconds} seconds has no effect")

print("The program jumps straight here and no longer checks the rest of the elif statements or the else")
```

We can see the output

```text
Checking connection with the control tower
The program jumps straight here and no longer checks the rest of the elif statements or the else
```

But why didn't we write the program like this?

```py
seconds = 60  # number of seconds
error_detected = False # no error in the beginning

if seconds == 100:
    print("Starting all onboard computers")
if seconds == 60:
    print("Checking connection with the control tower")
if seconds == 20:
    print("Starting secondary engines")
if seconds == 10:
    print("Starting the main engines")
if seconds < 10:  # the last 10 seconds
    if error_detected == True:
        print("Error detected. Canceling the mission")
    else:
        print("No error detected. Taking off...")
else: # unknown number of seconds
    print(f"{seconds} seconds has no effect")

```

We see an incorrect output

```text
Checking connection with the control tower
60 seconds has no effect
```

We see that on the last line it says **60 seconds has no effect**, but that’s not true, since _Checking connection with the control tower_ was printed exactly because **seconds = 60** **:)**

The full explanation is complex, but as a general rule: **if we test the same variable for multiple cases, we chain if-elif-else**

---

## Mission: Oxygen Level Monitor

The station constantly checks its `oxygen` level (in percent) and whether there is still `crew_aboard`. Based on the oxygen level, print **one** status line using a chained **if / elif / else**:

- `oxygen` is **80 or more** → `Oxygen nominal`
- `oxygen` is **50 to 79** → `Oxygen low - conserve power`
- `oxygen` is **20 to 49** → `Oxygen critical - seal the bay`
- below **20** → it's an emergency. Here, check `crew_aboard` with a **nested if**:
  - if the crew is still aboard → `EMERGENCY - evacuate now`
  - otherwise → `Venting the bay is safe`

**Input** (already set at the top of your code — change the values to test):

- `oxygen` — oxygen level in percent
- `crew_aboard` — `True` if the crew is still on the station

**Example**

With `oxygen = 65`, your program should print

```text
Oxygen low - conserve power
```

Now set `oxygen = 12` and `crew_aboard = True` and run again

```text
EMERGENCY - evacuate now
```

And with `oxygen = 12` and `crew_aboard = False`

```text
Venting the bay is safe
```

Once again, here at **CyberStars** we encourage **curiosity** — play around with the values **:)**
