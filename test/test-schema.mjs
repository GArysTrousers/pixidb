import { test } from "node:test";
import assert from "node:assert/strict";

import { Table } from "../dist/pixidb.js";



test("valid entry - lvl 1", () => {

  let users = new Table('users', null).schema({
    id: 'string',
    age: 'number',
    verified: 'boolean',
  })

  assert.ok(users.set({
    id: 'bob',
    age: 10,
    verified: true,
  }))
})

test("valid entry - lvl 2", () => {
  let users = new Table('users', null).schema({
    id: 'string',
    age: 'number',
    verified: 'boolean',
    groups: 'array',
  })

  assert.ok(users.set({
    id: 'bob',
    age: 10,
    verified: true,
    groups: [
      'admin',
      'user'
    ],
  }))
})

test("valid entry - lvl 3", () => {
  let users = new Table('users', null).schema({
    id: 'string',
    age: 'number',
    settings: {
      darkmode: 'boolean',
      volume: 'number'
    }
  })

  assert.ok(users.set({
    id: 'bob',
    age: 10,
    setting: {
      darkmode: true,
      volume: 100,
    }
  }))
})