import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Field from 'App/Models/Field'
import Booking from 'App/Models/Booking'
import UsersHasBooking from 'App/Models/UsersHasBooking'
import BookingValidator from 'App/Validators/BookingValidator'

export default class BookingsController {

    /**
    * @swagger
    * /api/v1/bookings:
    *   get:
    *     tags:
    *       - Bookings
    *     summary: get data bookings (owner, user)
    *     security:
    *       - bearerAuth: []
    *     responses:
    *       201:
    *         description: Success
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                   status: 
    *                       type: string
    *                   message: 
    *                       type: string
    *                   data: 
    *                       type: object
    *       400:
    *         description: Error
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                   status: 
    *                       type: string
    *                   message: 
    *                       type: string
    */
    public async index({response}: HttpContextContract) {
        try {
            const data = await Booking.all()
            response.ok({
                status: "success",
                message: "Succes mengambil data",
                data: data
            })
        } catch (error) {
            response.badRequest({
                status: "error",
                message: "Gagal mengambil data"
            })
        }
    }

    /**
    * @swagger
    * /api/v1/venues/{venue_id}/bookings:
    *   post:
    *     tags:
    *       - Venues
    *     summary: create data bookings (owner)
    *     security:
    *       - bearerAuth: []
    *     parameters: 
    *       -   in: path
    *           name: venue_id
    *           scheme: 
    *               type: integer
    *           required: true
    *           description: venue id
    *     requestBody:
    *       required: true
    *       content:
    *         application/x-www-form-urlencoded:
    *           schema:
    *             $ref: '#definitions/Bookings'
    *     responses:
    *       201:
    *         description: Success
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                   status: 
    *                       type: string
    *                   message: 
    *                       type: string
    *       400:
    *         description: Error
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                   status: 
    *                       type: string
    *                   message: 
    *                       type: string
    */
    public async store({response, request, params, auth}: HttpContextContract) {
        try {
            if (auth.user?.role != 'owner') {
                return response.forbidden({
                    status: "error",
                    message: "Hanya user dengan role owner yang diizinkan untuk mengakses"
                })
            }
            const payload = await request.validate(BookingValidator)
            Object.assign(payload, {users_id_booking: auth.user?.id})
            await Field.query()
                .where('id', payload.fields_id)
                .where('venues_id', params.venue_id)
                .firstOrFail()
            const data = await Booking.create(payload)
            await UsersHasBooking.create({
                users_id: auth.user?.id,
                bookings_id: data.id
            })
            response.created({
                status: "success",
                message: "Success simpan data"
            })
        } catch (error) {
            response.badRequest({
                status: "error",
                message: error.messages ?? "Gagal Menyimpan Data"
            })
        }
    }
    
    /**
    * @swagger
    * /api/v1/bookings/{id}:
    *   get:
    *     tags:
    *       - Bookings
    *     summary: get data bookings (owner, user)
    *     security:
    *       - bearerAuth: []
    *     parameters: 
    *       -   in: path
    *           name: id
    *           scheme: 
    *               type: integer
    *           required: true
    *           description: bookings id
    *     responses:
    *       201:
    *         description: Success
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                   status: 
    *                       type: string
    *                   message: 
    *                       type: string
    *                   data: 
    *                       type: object
    *       400:
    *         description: Error
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                   status: 
    *                       type: string
    *                   message: 
    *                       type: string
    */
    public async show({response, params}: HttpContextContract) {
        try {
            const data = await Database.query()
                .from('bookings')
                .where('id', params.id)
                .firstOrFail()
            const dataPemain = await Database.query()
                .from('users_has_bookings')
                .where('bookings_id', params.id)
                .leftJoin('users', 'users_has_bookings.users_id', 'users.id')
                .select('users.id', 'name', 'email')
            Object.assign(data, {list_pemain: dataPemain})
            response.ok({
                status: "success",
                message: "Success mengambil data",
                data: data
            })
        } catch (error) {
            response.badRequest({
                status: "error",
                message: `Data dengan id ${params.id} tidak ditemukan`
            })
        }
    }
    
    /**
    * @swagger
    * /api/v1/bookings/{id}/join:
    *   put:
    *     tags:
    *       - Bookings
    *     summary: join data bookings (user)
    *     security:
    *       - bearerAuth: []
    *     parameters: 
    *       -   in: path
    *           name: id
    *           scheme: 
    *               type: integer
    *           required: true
    *           description: bookings id
    *     responses:
    *       201:
    *         description: Success
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                   status: 
    *                       type: string
    *                   message: 
    *                       type: string
    *       400:
    *         description: Error
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                   status: 
    *                       type: string
    *                   message: 
    *                       type: string
    */
    public async join({response, params, auth}: HttpContextContract) {
        try {
            if (auth.user?.role != 'user') {
                return response.forbidden({
                    status: "error",
                    message: "Hanya user dengan role user yang diizinkan untuk mengakses"
                })
            }
            const dataSet = {
                users_id: auth.user?.id,
                bookings_id: params.id
            }
            await UsersHasBooking.updateOrCreate(dataSet, dataSet)
            response.ok({
                status: "success",
                message: "Success join data booking"
            })
        } catch (error) {
            response.badRequest({
                status: "error",
                message: error.messages ?? "Gagal join data booking"
            })
        }
    }
    
    /**
    * @swagger
    * /api/v1/bookings/{id}/unjoin:
    *   put:
    *     tags:
    *       - Bookings
    *     summary: join data bookings (user)
    *     security:
    *       - bearerAuth: []
    *     parameters: 
    *       -   in: path
    *           name: id
    *           scheme: 
    *               type: integer
    *           required: true
    *           description: bookings id
    *     responses:
    *       201:
    *         description: Success
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                   status: 
    *                       type: string
    *                   message: 
    *                       type: string
    *       400:
    *         description: Error
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                   status: 
    *                       type: string
    *                   message: 
    *                       type: string
    */
    public async unjoin({response, params, auth}: HttpContextContract) {
        try {
            if (auth.user?.role != 'user') {
                return response.forbidden({
                    status: "error",
                    message: "Hanya user dengan role user yang diizinkan untuk mengakses"
                })
            }
            const data = await UsersHasBooking.query()
                .where('users_id', auth.user?.id ?? 0)
                .where('bookings_id', params.id)
                .firstOrFail()
            await data.delete()
            response.ok({
                status: "success",
                message: "Success unjoin data booking"
            })
        } catch (error) {
            response.badRequest({
                status: "error",
                message: "Gagal unjoin data booking"
            })
        }
    }

    /**
    * @swagger
    * /api/v1/schedules:
    *   get:
    *     tags:
    *       - Bookings
    *     summary: get data schedules (user)
    *     security:
    *       - bearerAuth: []
    *     responses:
    *       201:
    *         description: Success
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                   status: 
    *                       type: string
    *                   message: 
    *                       type: string
    *                   data: 
    *                       type: object
    *       400:
    *         description: Error
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                   status: 
    *                       type: string
    *                   message: 
    *                       type: string
    */
    public async schedules({response, auth}: HttpContextContract) {
        try {    
            if (auth.user?.role != 'user') {
                return response.forbidden({
                    status: "error",
                    message: "Hanya user dengan role user yang diizinkan untuk mengakses"
                })
            }
            const data = await Database.query()
                .from('users_has_bookings')
                .leftJoin('bookings', 'users_has_bookings.bookings_id', 'bookings.id')
                .where('users_has_bookings.users_id', auth.user?.id ?? 0)
                .select('bookings.*')
            response.ok({
                status: "success",
                message: "Success mengambil data schedules",
                data: data
            })
        } catch (error) {
            response.badRequest({
                status: "error",
                message: `Gagal mengambil data schedules`
            })
        }
    }
}
