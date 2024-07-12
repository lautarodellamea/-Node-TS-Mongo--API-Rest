// los servicios se encargan de realizar el trabajo de la creacion, validacion, gestor de estado, etc

import { bcryptAdapter, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain";
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';

export class AuthService {

  constructor(

  ) { }

  public async registerUser(registerUserDto: RegisterUserDto) {

    const existUser = await UserModel.findOne({ email: registerUserDto.email });
    if (existUser) throw CustomError.badRequest('Email already exists');


    // al grabar en base de datos es bueno hacerlo dentro de un trycatch
    try {

      // creamos el usuario
      const user = new UserModel(registerUserDto);

      // encriptar la contraseña
      user.password = bcryptAdapter.hash(user.password);

      await user.save();

      // generar JWT <---- para mantener la autenticidad del usuario


      // Email de confirmacion


      // regresamos el usuario sin la contraseña
      const { password, ...userEntity } = UserEntity.fromObject(user);


      return {
        user: userEntity,
        token: 'ABC'
      };


    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }



  }

  public async loginUser(loginUserDto: LoginUserDto) {



    const user = await UserModel.findOne({ email: loginUserDto.email });
    if (!user) throw CustomError.badRequest('Email not found'); // aca podemos poner contraseña y/o password no son validos (para no darle la pista exacta a un hacker en que le erró



    const isMatch = bcryptAdapter.compare(loginUserDto.password, user.password);
    if (!isMatch) throw CustomError.badRequest('Password not valid'); // aca podemos poner contraseña y/o password no son validos (para no darle la pista exacta a un hacker en que le erró


    const { password, ...userEntity } = UserEntity.fromObject(user);


    // generacion del token
    const token = await JwtAdapter.generateToken({ id: user.id, email: user.email });
    if (!token) throw CustomError.internalServer('Error generating token');
    // console.log(token)

    return {
      user: userEntity,
      token: token
    };

  }



}



