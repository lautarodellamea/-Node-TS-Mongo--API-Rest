import { regularExps } from "../../../config";


export class LoginUserDto {


  constructor(
    public readonly email: string,
    public readonly password: string
  ) { }

  static login(object: { [key: string]: any }): [string?, LoginUserDto?] {

    const { email, password } = object;

    if (!email) { return ['Missing email', undefined]; }
    if (!regularExps.email.test(email)) {
      return ['Email is not valid', undefined];
    }

    if (!password) { return ['Missing password', undefined]; }
    if (password.length < 6) {
      return ['Password must have at least 6 characters', undefined];
    }

    return [undefined, new LoginUserDto(email, password)]
  }


}