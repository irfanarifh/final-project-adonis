import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

/**
* @swagger
* definitions:
*   Bookings:
*     type: object
*     properties: 
*       play_date_start: 
*         type: string
*         format: date-time
*         example: "2022-10-13 15:00:00"
*       play_date_end: 
*         type: string
*         format: date-time
*         example: "2022-10-13 16:00:00"
*       fields_id: 
*         type: integer
*     required:
*       - play_date_start
*       - play_date_end
*       - fields_id
*/
export default class Booking extends BaseModel {
  public static table = 'bookings'

  @column({ isPrimary: true })
  public id: number

  @column.dateTime()
  public play_date_start: DateTime

  @column.dateTime()
  public play_date_end: DateTime

  @column()
  public users_id_booking: number

  @column()
  public fields_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
