/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
    return { hello: 'world' }
})

Route.group(() => {
    Route.post('register', 'AuthController.store')
    Route.post('login', 'AuthController.login')
    Route.post('logout', 'AuthController.logout').middleware('auth')
    Route.post('otp-confirmation', 'AuthController.otp_confirmation')

    Route.resource('venues', 'VenuesController').apiOnly().middleware({'*': ['auth']})
    Route.post('venues/:venue_id/bookings', 'BookingsController.store').middleware('auth')
    Route.resource('venues.fields', 'FieldsController').apiOnly().middleware({'*': ['auth']})

    Route.get('bookings', 'BookingsController.index').middleware('auth')
    Route.get('bookings/:id', 'BookingsController.show').middleware('auth')
    Route.put('bookings/:id/join', 'BookingsController.join').middleware('auth')
    Route.put('bookings/:id/unjoin', 'BookingsController.unjoin').middleware('auth')
    Route.get('schedules', 'BookingsController.schedules').middleware('auth')
}).prefix('/api/v1')
