# hac api

i was bored so uh i made this

# usage
you first need to require it, like so:
```js
const hac = require("rrisd-hac-api");
const api = new hac();
```

---
after you do that, call this function:
```js
await api.login(username, password);
```
---
once thats done, call this:
```js
api.getGrades();
```

which will return an array that looks like this:
```json
[
  { courseName: 'PE', average: 100 },
  { courseName: 'Math', average: 86 },
  { courseName: 'Spanish', average: 93 },
  { courseName: 'ELA', average: 97 },
  { courseName: 'Science', average: 92 },
  { courseName: 'History', average: 90 },
  { courseName: 'Band', average: 96 }
]
```

## it will take a few seconds to fetch, be patient.