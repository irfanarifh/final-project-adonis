import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'fields'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable
      table.enu('type', ['soccer', 'minisoccer', 'futsal', 'basketball', 'volleyball']).notNullable
      table.integer('venues_id').unsigned().references('venues.id').onDelete('CASCADE')

      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
