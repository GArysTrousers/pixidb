import { test } from "node:test";
import assert from "node:assert/strict";

import { Table } from "../dist/pixidb.js";

let users = new Table('users', null)


test(".set()", () => {
  assert.ok(users.set({ id: 'bob', age: 10 }))
  assert.ok(users.set({ id: 'jimmy', age: 18 }))
  assert.ok(users.set({ id: 'carl', age: 30 }))
})

test(".getOne()", () => {
  assert.equal(users.getOne('bob').age, 10)
  assert.equal(users.getOne('jimmy').age, 18)
  assert.equal(users.getOne('carl').age, 30)
})

test(".getAll()", () => {
  assert.equal(users.getAll().length, 3)
})

test(".get()", () => {
  let a = users.get((v) => v.age > 15)
  assert.equal(a.length, 2)
})