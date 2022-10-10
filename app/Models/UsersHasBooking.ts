import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class UsersHasBooking extends BaseModel {
  public static table = 'users_has_bookings'

  @column({ isPrimary: true })
  public users_id: number

  @column({ isPrimary: true })
  public bookings_id: number
}
