import { Router } from 'express';
<<<<<<< Updated upstream
=======
import { AuthRoutes } from './auth/routes';
import { CategoryRoutes } from './category/routes';
>>>>>>> Stashed changes




export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Definir las rutas
<<<<<<< Updated upstream
    // router.use('/api/todos', /*TodoRoutes.routes */ );
=======
    router.use('/api/auth', AuthRoutes.routes);
    router.use('/api/categories', CategoryRoutes.routes);
>>>>>>> Stashed changes



    return router;
  }


}

