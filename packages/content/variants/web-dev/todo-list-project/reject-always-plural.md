```html index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="A to-do list that remembers your tasks, even after you close the page." />
    <title>My Tasks</title>
    <link rel="stylesheet" href="style.css" />
    <script src="script.js" defer></script>
  </head>
  <body>
    <main>
      <h1>My Tasks</h1>
      <form id="task-form">
        <label for="task-input">A new task</label>
        <input id="task-input" required />
        <button type="submit">Add</button>
      </form>
      <ul id="task-list"></ul>
      <p id="task-count" aria-live="polite"></p>
      <button type="button" id="clear-done">Remove the done tasks</button>
    </main>
  </body>
</html>
```

```css style.css
html {
  --page-bg: #f6f7fb;
  --text: #1b1f33;
  --card-bg: #ffffff;
  --accent: #5b3cc4;
  --muted: #5f6680;
}

@media (prefers-color-scheme: dark) {
  html {
    --page-bg: #14162a;
    --text: #eef0ff;
    --card-bg: #20233d;
    --accent: #b9a8ff;
    --muted: #a9aecb;
  }
}

body {
  margin: 0;
  padding: 0 16px;
  background-color: var(--page-bg);
  color: var(--text);
  font-family: Verdana, Geneva, sans-serif;
}

main {
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  color: var(--accent);
}

input,
button {
  font: inherit;
}

#task-form {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

#task-form label {
  flex-basis: 100%;
}

#task-input {
  flex-grow: 1;
  padding: 8px;
}

button {
  padding: 8px 16px;
  border-radius: 8px;
  border: 2px solid var(--accent);
  background-color: var(--card-bg);
  color: var(--text);
}

#task-list {
  padding: 0;
  list-style: none;
}

#task-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: var(--card-bg);
}

.task-text {
  flex-grow: 1;
}

.done .task-text {
  text-decoration: line-through;
  color: var(--muted);
}
```

```js script.js
const taskList = document.querySelector("#task-list");
const taskInput = document.querySelector("#task-input");

let tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];

const save = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const render = () => {
  taskList.textContent = "";
  for (const task of tasks) {
    const item = document.createElement("li");
    if (task.done) {
      item.classList.add("done");
    }

    const box = document.createElement("input");
    box.setAttribute("type", "checkbox");
    box.checked = task.done;
    box.setAttribute("aria-label", `Done: ${task.text}`);
    box.addEventListener("change", () => {
      task.done = box.checked;
      save();
      render();
    });

    const text = document.createElement("span");
    text.classList.add("task-text");
    text.textContent = task.text;

    const remove = document.createElement("button");
    remove.setAttribute("type", "button");
    remove.classList.add("delete");
    remove.textContent = "Delete";
    remove.addEventListener("click", () => {
      tasks.splice(tasks.indexOf(task), 1);
      save();
      render();
    });

    item.append(box);
    item.append(text);
    item.append(remove);
    taskList.append(item);
  }

  const left = tasks.filter((task) => !task.done).length;
  let countText = `${left} tasks left`;
  if (left === 0) {
    countText = "Nothing left to do";
  }
  document.querySelector("#task-count").textContent = countText;
};

document.querySelector("#task-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (text === "") {
    return;
  }
  tasks.push({ text, done: false });
  save();
  render();
  taskInput.value = "";
  taskInput.focus();
});

document.querySelector("#clear-done").addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.done);
  save();
  render();
});

render();
```
