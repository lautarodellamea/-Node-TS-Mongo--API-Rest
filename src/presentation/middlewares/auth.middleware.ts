import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";

export class AuthMiddleware {

  constructor() { }


  static async validateJWT(req: Request, res: Response, next: NextFunction) {

    // tomamos el header, por convencion se le pone Authorization
    const authorization = req.header('Authorization');

    if (!authorization) {

      return res.status(401).json({
        // ok: false,
        // msg: 'No hay token en la peticion'
        error: 'No token provided'
      });
    }


    // if (authorization.split(' ')[0] !== 'Bearer') {
    if (!authorization.startsWith('Bearer ')) {
      return res.status(401).json({
        // ok: false,
        // msg: 'No hay token en la peticion'
        error: 'Invalid Bearer token'
      })
    }


    const token = authorization.split(' ').at(1) || '';

    try {

      const payload = await JwtAdapter.validateToken<{ id: string }>(token);

      if (!payload) {
        return res.status(401).json({
          error: 'Invalid token'
        })
      }

      const user = await UserModel.findById(payload.id);

      // este error no deberia de pasar a menos que generemos el token y borramos el ususaio despues
      if (!user) {
        return res.status(401).json({
          error: 'Invalid token - user'
        })
      }

      // podriamos verificar si el usuario esta activo
      // if (!user.isActive) {...}

      // si todo es correcto colocamos el user en el request
      req.body.user = UserEntity.fromObject(user);

      next()



    } catch (error) {

      // en el catch manejamos un error que no sabemos que es, no tenemos control sobre el error
      console.log(error)
      return res.status(500).json({
        error: 'Internal server error'
      })


    }




  }
}