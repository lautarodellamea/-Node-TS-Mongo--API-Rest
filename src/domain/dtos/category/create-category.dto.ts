export class CreateCategoryDto {

  private constructor(
    public readonly name: string,
    public readonly available: boolean
  ) { }


  static create(object: { [key: string]: any }): [string?, CreateCategoryDto?] {

    const { name, available = false } = object;
    let availableBoolean = available;

    if (!name) { return ['Missing name', undefined] };

    // validar que sea un boolean ya que nos puede venir de manera booleana y string
    if (typeof available !== 'boolean') {
      availableBoolean = (available === 'true');
    };

    return [undefined, new CreateCategoryDto(name, availableBoolean)];
  }


}