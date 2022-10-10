import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

/**
* @swagger
* definitions:
*   Fields:
*     type: object
*     properties: 
*       name: 
*         type: string
*       type: 
*         type: string
*         enum: ['soccer', 'minisoccer', 'futsal', 'basketball', 'volleyball']
*     required:
*       - name
*       - type
*/
export default class Field extends BaseModel {
  public static table = 'fields'

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public type: string

  @column()
  public venues_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
