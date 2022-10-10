import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users_has_bookings'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('users_id').unsigned().references('users.id').onDelete('CASCADE')
      table.integer('bookings_id').unsigned().references('bookings.id').onDelete('CASCADE')
      table.primary(['users_id', 'bookings_id'])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
