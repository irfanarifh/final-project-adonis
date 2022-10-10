import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

/**
* @swagger
* definitions:
*   Venues:
*     type: object
*     properties: 
*       name: 
*         type: string
*       phone: 
*         type: string
*         example: "08123456789"
*       address: 
*         type: string
*     required:
*       - name
*       - phone
*       - address
*/
export default class Venue extends BaseModel {
  public static table = 'venues'

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public phone: string

  @column()
  public address: string

  @column()
  public users_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
