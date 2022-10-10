import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable
      table.string('email').notNullable
      table.string('password').notNullable
      table.string('role').notNullable().defaultTo('user')
      table.string('remember_me_token').nullable()
      table.string('otp_code').notNullable()
      table.boolean('is_verified').defaultTo(false)

      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
