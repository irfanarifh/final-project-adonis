import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Hash from '@ioc:Adonis/Core/Hash'
import Mail from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'

export default class AuthController {

    /**
    * @swagger
    * /api/v1/register:
    *   post:
    *     tags:
    *       - Authentication
    *     summary: Register User
    *     requestBody:
    *       required: true
    *       content:
    *         application/x-www-form-urlencoded:
    *           schema:
    *             $ref: '#definitions/Users'
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
    public async store({response, request}: HttpContextContract) {
        try {
            const otp_code: number = Math.floor(100000 + Math.random() * 900000)
            const payload = await request.validate(UserValidator)
            Object.assign(payload, {otp_code: otp_code})
            await User.create(payload)
            await Mail.send((message) => {
                message
                  .from('admin@sanberdev.com')
                  .to(payload.email)
                  .subject('Welcome Onboard!')
                  .htmlView('mail/otp_verification', { name: payload.name, otp_code: otp_code })
            })
            response.created({
                status: "success",
                message: "Silahkan lakukan verifikasi kode OTP yang dikirimkan ke email anda"
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
    * /api/v1/login:
    *   post:
    *     tags:
    *       - Authentication
    *     summary: Login User
    *     requestBody:
    *       required: true
    *       content:
    *         application/x-www-form-urlencoded:
    *           schema:
    *               type: object
    *               properties:
    *                   email:
    *                       type: string
    *                       format: email
    *                       example: email1@gmail.com
    *                   password:
    *                       type: string
    *                       example: 123456
    *               required:
    *                   - email
    *                   - password
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
    *                   token: 
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
    public async login({response, request, auth}: HttpContextContract) {
        try {
            const userSchema = schema.create({
                email: schema.string(),
                password: schema.string()
            })
            const payload = await request.validate({schema: userSchema})
            const data = await User.query()
                .where('email', payload.email)
                .firstOrFail()
            if (!(await Hash.verify(data.password, payload.password))) {
                return response.badRequest({
                    status: "error",
                    message: "Email atau Password anda salah"
                })
            }
            if (!data.isVerified) {
                return response.badRequest({
                    status: "error",
                    message: "Email masih belum diverifikasi"
                })
            }
            const token = await auth.use('api').login(data, {
                expiresIn: '24hours',
            })
            response.ok({
                status: "success",
                message: "Login Success",
                token
            })
        } catch (error) {
            response.badRequest({
                status: "error",
                message: error.messages ?? "Email atau Password anda salah"
            })
        }
    }
    
    /**
    * @swagger
    * /api/v1/logout:
    *   post:
    *     tags:
    *       - Authentication
    *     summary: Logout User (owner, user)
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
    public async logout({ auth, response }: HttpContextContract) {
        await auth.use('api').logout()
        if (auth.use('api').isLoggedOut) {
            response.ok({
                status: "success",
                message: "Logout Success"
            })
        }else{
            response.badRequest({
                status: "error",
                message: "Logout Gagal"
            })
        }
        
      }

    /**
    * @swagger
    * /api/v1/otp-confirmation:
    *   post:
    *     tags:
    *       - Authentication
    *     summary: Login User
    *     requestBody:
    *       required: true
    *       content:
    *         application/x-www-form-urlencoded:
    *           schema:
    *               type: object
    *               properties:
    *                   email:
    *                       type: string
    *                       format: email
    *                       example: email1@gmail.com
    *                   otp_code:
    *                       type: string
    *                       example: 567201
    *               required:
    *                   - email
    *                   - otp_code
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
    public async otp_confirmation({response, request}: HttpContextContract) {
        try {
            const email = request.input('email')
            const otp_code = request.input('otp_code')

            const data = await User.findByOrFail('email', email)
            if (data.otp_code == otp_code) {
                data.isVerified = true
                await data.save()
                response.ok({
                    status: "success",
                    message: "Code OTP berhasil diverifikasi"
                })
            } else {
                response.badRequest({
                    status: "error",
                    message: "Code OTP tidak sesuai"
                })
            }
        } catch (error) {
            response.badRequest({
                status: "error",
                message: error.messages ?? error
            })
        }
    }
}
