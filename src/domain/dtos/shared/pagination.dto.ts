export class PaginationDto {

  private constructor(
    public readonly page: number,
    public readonly limit: number
  ) { }


  static create(page: number, limit: number): [string?, PaginationDto?] {

    if (isNaN(page) || isNaN(limit)) {
      return ['Invalid page or limit, page and limit must be numbers', undefined];
    }

    if (page <= 0 || limit <= 0) {
      return ['Invalid page or limit, page and limit must be greater than 0', undefined];
    }

    return [undefined, new PaginationDto(page, limit)];

  }
}