A shop's till has a drawer with the money in it. Customers pay at the counter, and the cashier puts the money in the drawer. Nobody else opens the drawer, and it's locked so they can't. The counter is for everyone, the drawer only for the shop.

## The underscore is only a wish

The setter keeps the tidy role in `_role`. The underscore says "please don't touch". But it's only a wish: any code can still write `vega._role = "   "` and skip the setter, and the messy role is back.

## `#`: private fields

A name that starts with `#` is **private**: only the code inside the class can read or write it. It's declared at the top of the class body:

```js
class Pupil {
  #nickname;

  get nickname() {
    return this.#nickname;
  }

  set nickname(value) {
    const clean = String(value ?? "").trim();
    this.#nickname = clean === "" ? "No nickname" : clean;
  }
}

const mia = new Pupil();
mia.nickname = " Mimi";
console.log(mia.nickname);
console.log(Object.keys(mia));
```

```text
Mimi
[]
```

The getter and the setter reach `#nickname`, since they're inside the class. Outside, `Object.keys` doesn't even show it, and `mia.#nickname` is an error. The only way in is the setter, so the value is always tidy.

## Break it on purpose

Use `this.#nickname` in the class without declaring `#nickname;` at the top. The browser refuses the whole file: a private field must be declared first. Then try `console.log(mia.#nickname)` outside the class: the same refusal, before anything runs.

---

## Mission: Locked in

The tidy role should be kept where nothing outside the class can change it.

**Example**: the crew panel looks exactly as before, messy roles tidied. A crew member shows only its `name` from the outside, and its role is still read and written as `role`.

- `CrewMember` keeps the role in a private field instead of `_role`.
- The getter and the setter `role` work as before, so the crew panel looks the same.

Psst, a private field is declared at the top of the class before it's used :)
