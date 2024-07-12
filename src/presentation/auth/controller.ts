import { Request, Response } from "express";
import { CustomError, RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';


export class AuthController {

  // DI
  constructor(
    public readonly authService: AuthService
  ) { }

  // con esta fucnion analiso si tengo otro tipod e error que no sea de tipo customError y lo manejamos para que la app no se caiga y lo veamos en la respuesta
  private handleError = (error: any, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);
    return res.status(500).json({ error: error.message });
  }


  // si le pongo public, puedo tener problemas con el puntero del this
  registerUser = (req: Request, res: Response) => {

    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.authService.registerUser(registerUserDto!)
      .then((user) => res.json(user))
      // si no pusiera este catch con mi funcion handleError, la app se cae
      .catch((error) => this.handleError(error, res));
    // res.json({ error, registerUserDto });
  }

  loginUser = (req: Request, res: Response) => {


    const [error, loginUserDto] = LoginUserDto.login(req.body);
    if (error) return res.status(400).json({ error });

    this.authService.loginUser(loginUserDto!)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));

  }

  validateEmail = (req: Request, res: Response) => {
    res.json("validateEmail");
  }




}