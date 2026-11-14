```js status-count.js
export default function countStatuses(ships) {
  const counts = {};
  for (const { status } of ships) {
    if (counts[status] === undefined) {
      counts[status] = 0;
    }
    counts[status] + 1;
  }
  return counts;
}
```
