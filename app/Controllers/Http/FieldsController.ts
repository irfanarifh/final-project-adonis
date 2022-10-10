import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Venue from 'App/Models/Venue'
import Field from 'App/Models/Field'
import FieldValidator from 'App/Validators/FieldValidator'

export default class FieldsController {

    /**
    * @swagger
    * /api/v1/venues/{venue_id}/fields:
    *   get:
    *     tags:
    *       - Venues
    *     summary: get data fields (owner)
    *     security:
    *       - bearerAuth: []
    *     parameters: 
    *       -   in: path
    *           name: venue_id
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
    public async index({response, params, auth}: HttpContextContract) {
        try {
            if (auth.user?.role != 'owner') {
                return response.forbidden({
                    status: "error",
                    message: "Hanya user dengan role owner yang diizinkan untuk mengakses"
                })
            }
            const data = await Field.query()
                .where('venues_id', params.venue_id)
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
    * /api/v1/venues/{venue_id}/fields:
    *   post:
    *     tags:
    *       - Venues
    *     summary: create data fields (owner)
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
    *             $ref: '#definitions/Fields'
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
            const payload = await request.validate(FieldValidator)
            Object.assign(payload, {venues_id: params.venue_id})
            await Venue.findOrFail(params.venue_id)
            await Field.create(payload)
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
    * /api/v1/venues/{venue_id}/fields/{id}:
    *   get:
    *     tags:
    *       - Venues
    *     summary: get data fields (owner)
    *     security:
    *       - bearerAuth: []
    *     parameters: 
    *       -   in: path
    *           name: venue_id
    *           scheme: 
    *               type: integer
    *           required: true
    *           description: venue id
    *       -   in: path
    *           name: id
    *           scheme: 
    *               type: integer
    *           required: true
    *           description: field id
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
            const data = await Field.query()
                .where('id', params.id)
                .where('venues_id', params.venue_id)
                .firstOrFail()
            response.ok({
                status: "success",
                message: "Success mengambil data",
                data: data
            })
        } catch (error) {
            response.badRequest({
                status: "error",
                message: `Data dengan id ${params.id} dan venues_id ${params.venue_id} tidak ditemukan`
            })
        }
    }
    
    /**
    * @swagger
    * /api/v1/venues/{venue_id}/fields/{id}:
    *   put:
    *     tags:
    *       - Venues
    *     summary: update data fields (owner)
    *     security:
    *       - bearerAuth: []
    *     parameters: 
    *       -   in: path
    *           name: venue_id
    *           scheme: 
    *               type: integer
    *           required: true
    *           description: venue id
    *       -   in: path
    *           name: id
    *           scheme: 
    *               type: integer
    *           required: true
    *           description: fields id
    *     requestBody:
    *       required: true
    *       content:
    *         application/x-www-form-urlencoded:
    *           schema:
    *             $ref: '#definitions/Fields'
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
            const payload = await request.validate(FieldValidator)
            const data = await Field.query()
                .where('id', params.id)
                .where('venues_id', params.venue_id)
                .firstOrFail()
            data.merge(payload)
            await data.save()
            response.ok({
                status: "success",
                message: "Success update data"
            })
        } catch (error) {
            response.badRequest({
                status: "error",
                message: error.messages ?? "Gagal Update Data"
            })
        }
    }
    
    /**
    * @swagger
    * /api/v1/venues/{venue_id}/fields/{id}:
    *   delete:
    *     tags:
    *       - Venues
    *     summary: delete data fields (owner)
    *     security:
    *       - bearerAuth: []
    *     parameters: 
    *       -   in: path
    *           name: venue_id
    *           scheme: 
    *               type: integer
    *           required: true
    *           description: venue id
    *       -   in: path
    *           name: id
    *           scheme: 
    *               type: integer
    *           required: true
    *           description: field id
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
            const data = await Field.query()
                .where('id', params.id)
                .where('venues_id', params.venue_id)
                .firstOrFail()
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
