import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'

/**
* @swagger
* definitions:
*   Users:
*     type: object
*     properties: 
*       name: 
*         type: string
*       email: 
*         type: string
*       password: 
*         type: string
*       role: 
*         type: string
*         enum: ["user", "owner"]
*     required:
*       - name
*       - email
*       - password
*       - role
*/
export default class User extends BaseModel {
  public static table = 'users'

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column({ serializeAs: null })
  public email: string

  @column()
  public password: string

  @column()
  public role: string

  @column()
  public rememberMeToken?: string

  @column()
  public otp_code?: string
  
  @column()
  public isVerified?: Boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(User: User) {
    if (User.$dirty.password) {
      User.password = await Hash.make(User.password)
    }
  }
}
