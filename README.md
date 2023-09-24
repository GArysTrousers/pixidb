# PixiDB

## Summary
A small in-memory database with background file writing.

The idea is to keep the whole database in memory and write to json files async after writes.


## Basic Example
```
//
interface User {
  id: string;
  age: number;
}

// Make an object that will have house all your tables
export const db = {
  users: new Table<User>('/path/to/db/dir', 'users')
}

db.users.getAll()
db.users.getOne('cool_guy')
db.users.get((v) => v.age > 10)
```