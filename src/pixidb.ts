import { readFileSync, writeFileSync, accessSync } from "node:fs";

export interface Row {
  id: string;
}

export enum LogLevel {
  None,
  Init,
  Operations,
  Verbose
}

export class Table<T extends Row> {
  static loglevel = LogLevel.None
  saveTimer: NodeJS.Timer | null = null;
  dbPath: string | null;
  name: string;
  tablePath: string;
  schemaObject: object | null = null;
  private rows: T[];

  /**
   * @param name The name of the table, used for the filename and logging
   * @param dbPath Path to where the file will be written (excluding the db name), null to disable saving
   * @param schema See .schema() docs
   */
  constructor(name: string, dbPath: string | null) {
    this.name = name;
    this.dbPath = dbPath;
    if (this.dbPath) {
      this.tablePath = `${this.dbPath}/${this.name}.json`
      try {
        accessSync(this.tablePath)
        this.load()
        if (Table.loglevel >= LogLevel.Init)
          console.log(`${this.name}->init: loaded from file`);
      } catch (error: any) {
        if (error.code == 'ENOENT') {
          this.rows = []
          if (Table.loglevel >= LogLevel.Init)
            console.log(`${this.name}->init: new db file`);
        } else throw error
      }
    } else {
      this.rows = []
      if (Table.loglevel >= LogLevel.Init)
        console.log(`${this.name}->init: memory-only mode`);
    }
  }

  schema(schemaObject: object) {
    this.schemaObject = schemaObject
    return this
  }

  /**
   * Note: 
   * Validate only ensures input contains the schema, 
   * input may contain more props and will return true
   */
  validate(input: any, schema: object = this.schemaObject) {
    if (Table.loglevel >= LogLevel.Verbose) {
      console.log('Schema Validation:')
      console.log(schema);
      console.log('input:');
      console.log(input);
    }
    
    try {
      if (this.schemaObject != null) {
        for (let [schemaProp, schemaType] of Object.entries(schema)) {
          if (typeof (schemaType) == 'string') {
            if (!(schemaProp in input)) {
              throw ("Prop not in input: " + schemaProp)
            }
            if (schemaType == 'array') {
              if (!Array.isArray(input[schemaProp]))
                throw "Input was not an array"
            }
            else if (!(typeof (input[schemaProp]) == schemaType)) {
              throw (`Input was wrong type ${schemaProp} ${schemaType} ${typeof (input[schemaProp])}`)
            }
          }
          else if (typeof (schemaType) == 'object') {            
            if (Array.isArray(input[schemaProp]))
              throw "Schema contains an array object"
            
            if (!this.validate(input[schemaProp], schemaType))
              return false
          }
        }
      }
    } catch (error) {
      if (Table.loglevel >= LogLevel.Verbose)
        console.log(`error: ${error.message}`);
      return false
    }
    return true
  }

  private load(): void {
    let rawdata = readFileSync(this.tablePath);
    this.rows = JSON.parse(rawdata.toString());
  }

  private save(messsage: string = 'no message'): void {
    if (Table.loglevel >= LogLevel.Operations)
      console.log(messsage);
    if (this.dbPath === null) return;
    if (!this.saveTimer) {
      this.saveTimer = setTimeout(() => {
        let json = JSON.stringify(this.rows)
        writeFileSync(this.tablePath, json)
        if (Table.loglevel >= LogLevel.Verbose)
          console.log("db saved");
      }, 1000)
    }
    else this.saveTimer.refresh()
  }

  /** Returns all rows */
  getAll(): T[] {
    return this.rows
  }

  /** Returns all rows matching the predicate */
  get(selector: (v: T, i: number, a: T[]) => T[]): T[] {
    return this.rows.filter(selector);
  }

  /** Returns the row with the id, otherwise null */
  getOne(id: string): T | null {
    return this.rows.find(x => x.id == id) || null
  }

  /** 
   * The same as .set() but first checks if the id is already present in the table.
   * If it is, will not insert and will return false, otherwise true.
   * */
  new(value: T): boolean {
    if (!this.validate(value)) return false
    let index = this.rows.findIndex(x => x.id == value.id)
    if (index == -1) { // if not in table
      this.rows.push(value);
      this.save(`${this.name}->added: ${value.id}`)
      return true;
    }
    if (Table.loglevel >= LogLevel.Operations)
      console.log(`${this.name}->failed new id: ${value.id}`)
    return false
  }

  /** 
   * For inserting or updating rows.
   * If a schema is set on the table, will check if it matches the schema first.
   * If it does not match the schema, will return false, otherwise true.
   * */
  set(value: T): boolean {
    if (!this.validate(value)) return false
    let index = this.rows.findIndex(x => x.id == value.id)
    if (index == -1) { // if not in table
      this.rows.push(value);
      this.save(`${this.name}->added: ${value.id}`)
    } else {
      this.rows[index] = value;
      this.save(`${this.name}->updated: ${value.id}`)
    }
    return true;
  }

  /** Removes any row that matches the predicate. */
  remove(selector: (v: T, i: number, a: T[]) => void): void {
    let rows = this.rows.filter(selector)
    for (let r of rows) {
      this.removeOne(r.id)
    }
  }

  /** 
   * Removes the row with the id.
   * If no row with id exists, returns false, otherwise true.
   * */
  removeOne(id: string): boolean {
    let index = this.rows.findIndex(x => x.id == id)
    if (index == -1) {
    if (Table.loglevel >= LogLevel.Operations)
      console.log(`${this.name}->failed remove id: ${id}`);
      return false;
    }
    this.rows.splice(index, 1)
    this.save(`${this.name}->removed: ${id}`)
    return true;
  }
}