// podesmos hacerlo como una clase o un objeto como en el bcrypt.adapter
// hagamoslo con una clase para ver mas ideas
import jwt from 'jsonwebtoken'
import { envs } from './envs'

// lo definimos aca arriba para que se vea que estamos usando (sin embargo es una dependencia oculta, seria buena idea pasarlo por el constructor)
const JWT_SEED = envs.JWT_SEED


export class JwtAdapter {

  // DI, si la inyeccion de dependencia no la nececito podemos trabajar con metodos estaticos

  static async generateToken(payload: any, duration: string = '2h') {

    return new Promise((resolve) => {
      jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (err, token) => {

        if (err) resolve(null)

        resolve(token)
      })
    })



  }

  static validateToken(token: string) {
    return new Promise((resolve) => {
      jwt.verify(token, JWT_SEED, (err, decoded) => {

        if (err) resolve(null)

        // el decoded es lo que yo puse dentro del token y lo quiero ver
        resolve(decoded)
      })
    })
  }





}