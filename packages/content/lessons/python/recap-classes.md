Put together classes and objects, `__init__`, methods, `__str__` and class attributes

---

## Mission: Robot Crew

The station's robots do the heavy work. A robot spends 10% of its battery for each hour of work, and it refuses a job it can't finish. At the end of the day, every robot under 50% goes to its charger

1. Write a class **Robot** with:
   - a class attribute `made`, which counts how many robots were made
   - an `__init__` that takes a `name`, sets the attributes `name` and `battery` (which starts at 100), and adds 1 to `made`
   - a method **work(hours)** that takes the battery for the job and returns True if the robot has enough, or changes nothing and returns False if not
   - a method **charge()** that brings the battery back to 100
   - a `__str__` that returns the name and the battery like `Rex (70%)`
2. Start your program with two variables: **names**, a list of robot names, and **jobs**, a list of strings, each a robot's name and a number of hours, like `"Rex 3"`. For example `names = ["Rex", "Bolt"]` and `jobs = ["Rex 3", "Bolt 8", "Rex 8"]`
3. Make a `Robot` for each name. Then for each job print the job, `: `, `done` or `too tired`, then `->` with a space on each side, and the robot, as its `__str__` shows it
4. Charge every robot with less than 50% battery, and print `Charged: ` and their names joined with `, `, in the order of **names**, or `none`
5. Print `Robots made: ` and the class's count

There are from 1 to 6 robots, with different names, and from 0 to 15 jobs, each for a robot in the list, from 1 to 10 hours

**Example** for the values above

```text
Rex 3: done -> Rex (70%)
Bolt 8: done -> Bolt (20%)
Rex 8: too tired -> Rex (70%)
Charged: Bolt
Robots made: 2
```
