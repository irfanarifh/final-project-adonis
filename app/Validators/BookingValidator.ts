import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BookingValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    play_date_start: schema.date({
      format: 'yyyy-MM-dd HH:mm:ss', 
    },[
      rules.after('today')
    ]),
    play_date_end: schema.date({
      format: 'yyyy-MM-dd HH:mm:ss', 
    },[
      rules.after('today')
    ]),
    fields_id: schema.number(),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    required: "inputan {{field}} tidak boleh kosong",
    number: "inputan {{field}} hanya boleh angka",
    "date.format": "inputan {{field}} harus berformat yyyy-MM-dd HH:mm:ss",
    "play_date_start.after": "inputan {{field}} hanya bisa booking 1 hari sebelumnya",
    "play_date_end.after": "inputan {{field}} hanya bisa booking 1 hari sebelumnya"
  }
}
