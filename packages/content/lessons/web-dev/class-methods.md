A remote control comes with its buttons. Every remote of that model has the same buttons, and each one works on its own TV. You don't wire a new button onto each remote: it's part of the model. A class can give its objects their buttons too.

## A method in a class

On the settings page you wrote methods inside an object. A class can have methods as well, written in its body, after the constructor, without `function`:

```js
class Pupil {
  constructor(name, grade) {
    this.name = name;
    this.grade = grade;
  }

  introduce() {
    return `I'm ${this.name}, in grade ${this.grade}`;
  }
}

const mia = new Pupil("Mia", 7);
const ben = new Pupil("Ben", 8);

console.log(mia.introduce());
console.log(ben.introduce());
```

```text
I'm Mia, in grade 7
I'm Ben, in grade 8
```

Every pupil has `introduce`, and inside it `this` is the pupil it was called on, as with the settings object's methods. The method is written once, in the class, and every object made with `new` shares it: it isn't copied into each one.

The code that uses pupils doesn't need to know how an introduction is written. It asks the pupil. Change the sentence in the class, and every page that asks gets the new one.

## Break it on purpose

Write `return `I'm ${name}`;` without `this.`. The browser says `name is not defined`: inside a method, the object's values are reached through `this`. Then call `mia.introduce` without brackets. You get the function itself, not its answer, and the page shows its code.

---

## Mission: Describe yourself

The crew panel puts each line together itself. Let each crew member say their own line.

**Example**: the crew panel looks exactly as before: `Vega, Commander`, `Orion, Pilot`, and so on. `new CrewMember({ name: "Nova", role: "Navigator" }).describe()` gives `Nova, Navigator`.

- `CrewMember` has a method `describe()` that returns the member's name, a comma and a space, then the role.
- The crew panel writes what `describe()` returns for each person, and puts no line together itself any more.

Psst, inside a method, the object is `this` :)
