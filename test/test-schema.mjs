import { test } from "node:test";
import assert from "node:assert/strict";

import { LogLevel, Table } from "../dist/pixidb.js";

Table.loglevel = LogLevel.None

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
  
  assert.ok(!users.set({
    id: 'bill',
    age: 10,
    verified: 1,
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

  assert.ok(!users.set({
    id: 'bill',
    age: 10,
    verified: true,
    groups: 10,
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

  assert.ok(!users.set({
    id: 'bill',
    age: 10,
    settings: "uh oh"
  }))
})