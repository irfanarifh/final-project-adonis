import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Venue from 'App/Models/Venue'
import VenueValidator from 'App/Validators/VenueValidator'


export default class VenuesController {

    /**
    * @swagger
    * /api/v1/venues:
    *   get:
    *     tags:
    *       - Venues
    *     summary: get data venues (owner)
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
    public async index({response, auth}: HttpContextContract) {
        try {
            if (auth.user?.role != 'owner') {
                return response.forbidden({
                    status: "error",
                    message: "Hanya user dengan role owner yang diizinkan untuk mengakses"
                })
            }
            const data = await Venue.all()
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
    * /api/v1/venues:
    *   post:
    *     tags:
    *       - Venues
    *     summary: create data venues (owner)
    *     security:
    *       - bearerAuth: []
    *     requestBody:
    *       required: true
    *       content:
    *         application/x-www-form-urlencoded:
    *           schema:
    *             $ref: '#definitions/Venues'
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
    public async store({response, request, auth}: HttpContextContract) {
        try {
            if (auth.user?.role != 'owner') {
                return response.forbidden({
                    status: "error",
                    message: "Hanya user dengan role owner yang diizinkan untuk mengakses"
                })
            }
            const payload = await request.validate(VenueValidator)
            Object.assign(payload, {users_id: auth.user?.id})
            await Venue.create(payload)
            response.created({
                status: "success",
                message: "Success simpan data"
            })
        } catch (error) {
            response.badRequest({
                status: "error",
                message: error.messages ?? error
            })
        }
    }
    
    /**
    * @swagger
    * /api/v1/venues/{id}:
    *   get:
    *     tags:
    *       - Venues
    *     summary: get data venue (owner)
    *     security:
    *       - bearerAuth: []
    *     parameters: 
    *       -   in: path
    *           name: id
    *           scheme: 
    *               type: integer
    *           required: true
    *           description: venue id
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
    public async show({response, params, auth}: HttpContextContract) {
        try {
            if (auth.user?.role != 'owner') {
                return response.forbidden({
                    status: "error",
                    message: "Hanya user dengan role owner yang diizinkan untuk mengakses"
                })
            }
            const data = await Venue.findOrFail(params.id)
            Object.assign(data, {asd: 'asd'})
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
    * /api/v1/venues/{id}:
    *   put:
    *     tags:
    *       - Venues
    *     summary: update data venue (owner)
    *     security:
    *       - bearerAuth: []
    *     parameters: 
    *       -   in: path
    *           name: id
    *           scheme: 
    *               type: integer
    *           required: true
    *           description: venue id
    *     requestBody:
    *       required: true
    *       content:
    *         application/x-www-form-urlencoded:
    *           schema:
    *             $ref: '#definitions/Venues'
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
    public async update({response, request, params, auth}: HttpContextContract) {
        try {
            if (auth.user?.role != 'owner') {
                return response.forbidden({
                    status: "error",
                    message: "Hanya user dengan role owner yang diizinkan untuk mengakses"
                })
            }
            const payload = await request.validate(VenueValidator)
            const data = await Venue.findOrFail(params.id)
            data.merge(payload)
            await data.save()
            response.ok({
                status: "success",
                message: "Success update data"
            })
        } catch (error) {
            response.badRequest({
                status: "error",
                message: error.messages ?? error
            })
        }
    }
    
    /**
    * @swagger
    * /api/v1/venues/{id}:
    *   delete:
    *     tags:
    *       - Venues
    *     summary: delete data venue (owner)
    *     security:
    *       - bearerAuth: []
    *     parameters: 
    *       -   in: path
    *           name: id
    *           scheme: 
    *               type: integer
    *           required: true
    *           description: venue id
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
    public async destroy({response, params, auth}: HttpContextContract) {
        try {
            if (auth.user?.role != 'owner') {
                return response.forbidden({
                    status: "error",
                    message: "Hanya user dengan role owner yang diizinkan untuk mengakses"
                })
            }
            const data = await Venue.findOrFail(params.id)
            await data.delete()
            response.ok({
                status: "success",
                message: "Success delete data"
            })
        } catch (error) {
            response.badRequest({
                status: "error",
                message: "Gagal menghapus data"
            })
        }
    }
}
