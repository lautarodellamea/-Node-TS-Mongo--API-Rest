import bcrypt from 'bcryptjs';

// podriamos hacer una clase si quisieramos, aca hice un objeto con metodos
export const bcryptAdapter = {

  // metodo que regresa la contraseña encriptada, seria un hash
  hash: (password: string) => {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
  },

  // metodo para comparar, regresa un true o false
  compare: (password: string, hash: string) => {
    return bcrypt.compareSync(password, hash);
  }




}