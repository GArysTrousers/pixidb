import { test } from "node:test";
import assert from "node:assert/strict";

import { Table } from "../dist/pixidb.js";

test("schema: basic types", () => {

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

test("schema: arrays", () => {
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

test("schema: nested object", () => {
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
    settings: {
      darkmode: true,
      volume: 100,
    }
  }))
})