import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { LogLevel, Table } from "../dist/pixidb.js";

Table.loglevel = LogLevel.None

let users = new Table('users', null)
describe("Table Methods", () => {
  it(".set()", () => {
    assert.ok(users.set({ id: 'bob', age: 10 }))
    assert.ok(users.set({ id: 'jimmy', age: 18 }))
    assert.ok(users.set({ id: 'carl', age: 30 }))
    assert.ok(users.set({ id: 'billy', age: 30 }))
    assert.ok(users.set({ id: 'chang', age: 60 }))
  })

  it(".getOne()", () => {
    assert.equal(users.getOne('bob').age, 10)
    assert.equal(users.getOne('jimmy').age, 18)
    assert.equal(users.getOne('carl').age, 30)
  })

  it(".getAll()", () => {
    assert.equal(users.getAll().length, 5)
  })

  it(".get()", () => {
    let a = users.get((v) => v.age > 20)
    assert.equal(a.length, 3)
  })

  it(".removeOne", () => {
    assert.ok(users.removeOne('bob'))
    assert.equal(users.getAll().length, 4)
  })

  it(".remove", () => {
    users.remove((v) => v.age === 30)
    assert.equal(users.getAll().length, 2)
  })

  it(".new()", () => {
    assert.equal(users.new({ id: 'beth', age: 76 }), true)
    assert.equal(users.new({ id: 'jimmy', age: 18 }), false)
    assert.equal(users.getAll().length, 3)
  })
})