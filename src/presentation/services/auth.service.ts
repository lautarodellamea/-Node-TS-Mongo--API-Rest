// los servicios se encargan de realizar el trabajo de la creacion, validacion, gestor de estado, etc

import { bcryptAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain";
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';
import { EmailService } from "./email.service";

export class AuthService {

  // DI
  constructor(
    // DI - Email Service
    private readonly emailService: EmailService
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


      // generar JWT <---- para mantener la autenticidad del usuario




      // regresamos el usuario sin la contraseña
      const { password, ...userEntity } = UserEntity.fromObject(user);

      // generacion del token
      const token = await JwtAdapter.generateToken({ id: userEntity.id });
      if (!token) throw CustomError.internalServer('Error generating token');

      // Email de confirmacion
      this.sendEmailVlidationLink(user.email)

      // guardamos el usuario al ultimo por si ocurre un error
      await user.save();

      return {
        user: userEntity,
        token: token
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


  // mecanismo del envio de emails
  private sendEmailVlidationLink = async (email: string) => {

    const token = await JwtAdapter.generateToken({ email: email });
    if (!token) throw CustomError.internalServer('Error generating token');

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;

    // dentro del html podemos poner imagenes pero con el lunk completo https://...
    const html = `
      <h1>Validate your email</h1>
      <p>Click this link to validate your email:</p>
      <a href="${link}">Validate your email: ${email} </a>
    `

    const options = {
      to: email,
      subject: 'Validate your email',
      htmlBody: html
    }

    const isSent = await this.emailService.sendEmail(options);

    if (!isSent) throw CustomError.internalServer('Email not sent');

    return true

  }


  public validateEmail = async (token: string) => {

    // validamos el token para obtener el email
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw CustomError.unauthorized('Invalid token');

    // como yo le puse de tipo any al payload puede ser cualquier cosa entonces le ponemos esto
    const { email } = payload as { email: string };
    if (!email) throw CustomError.internalServer('Email not in token');


    const user = await UserModel.findOne({ email: email });
    if (!user) throw CustomError.internalServer('User not found');

    user.emailValidated = true;
    await user.save();

    return true


  }

}



