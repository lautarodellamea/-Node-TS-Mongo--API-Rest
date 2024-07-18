import { Request, Response } from "express";
import { CustomError, PaginationDto } from "../../domain";
import { CreateCategoryDto } from '../../domain/dtos/category/create-category.dto';
import { CategoryService } from "../services/catregory.service";

export class CategoryController {

  constructor(
    private readonly categoryService: CategoryService
  ) { }


  private handleError = (error: any, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);
    return res.status(500).json({ error: error.message });
  }

  createCategory = (req: Request, res: Response) => {

    const [error, createCategoryDto] = CreateCategoryDto.create(req.body);
    if (error) return res.status(400).json({ error });

    // usamos el servicio, express nos recomienda no poner async-await dentro de los controladores
    this.categoryService.createCategory(createCategoryDto!, req.body.user)
      .then((category) => res.status(201).json(category))
      .catch((error) => this.handleError(error, res))



    // aca vemos todo lo que mandamos en el body desde el middleware
    // res.json(req.body)
  }

  getCategories = async (req: Request, res: Response) => {


    const { page = 1, limit = 10 } = req.query
    const [error, paginationDto] = PaginationDto.create(+page, +limit)
    if (error) return res.status(400).json({ error })



    this.categoryService.getCategories(paginationDto!)
      .then((categories) => res.json(categories))
      .catch((error) => this.handleError(error, res))





    // res.json('Get Category')
  }




}