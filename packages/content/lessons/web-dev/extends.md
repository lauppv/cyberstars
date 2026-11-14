A class teacher is a teacher: they teach lessons, mark tests and come to the staff room, like every teacher. But they also do one thing more: they look after one class. You wouldn't describe a class teacher from zero. You'd say "a teacher who also looks after a class".

## `extends`

`extends` makes a class that starts from another one. It gets everything the first class has, and adds or changes what's different:

```js
class Pupil {
  constructor(name, grade) {
    this.name = name;
    this.grade = grade;
  }

  introduce() {
    return `I'm ${this.name}, in grade ${this.grade}`;
  }

  isCaptain() {
    return false;
  }
}

class Captain extends Pupil {
  isCaptain() {
    return true;
  }
}

const ana = new Captain("Ana", 8);
console.log(ana.introduce());
console.log(ana.isCaptain());
```

```text
I'm Ana, in grade 8
true
```

`Captain` has no constructor and no `introduce` of its own: it uses `Pupil`'s. Its own `isCaptain` replaces `Pupil`'s, so a captain answers `true` and every other pupil `false`. The page can ask any pupil `isCaptain()`, without checking what kind it is.

A captain **is** a pupil: everywhere a pupil fits, a captain fits too.

In a file of its own, the new class imports the one it starts from:

```js
import Pupil from "./pupil.js";

export default class Captain extends Pupil { ... }
```

## Break it on purpose

Copy `Pupil` into `Captain` instead of using `extends`. It works today. Then change `introduce` in `Pupil`, and captains still introduce themselves the old way: two copies, and you fixed one. Then leave out `isCaptain` in `Pupil`: every pupil who isn't a captain throws `isCaptain is not a function`.

---

## Mission: The commander

On a station, the commander isn't just one of the crew: they're in charge. The crew panel should show it.

**Example**: in the crew panel, `Vega, Commander` stands out from the rest, in another color or in bold. Every other line looks as before.

- `CrewMember` has a method `isInCharge()` that returns `false`.
- A new file, `commander.js`, exports by default a class `Commander` that starts from `CrewMember`, whose `isInCharge()` returns `true`.
- The crew panel makes a `Commander` for a person whose role is `Commander`, and a `CrewMember` for everyone else. The line of a person in charge gets the class `in-charge`, which makes it stand out.

Psst, the new class gets everything else from the class it starts from :)
