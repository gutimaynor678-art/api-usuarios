import { Router } from 'express';
import * as ctrl from '../controllers/usuarios.controller.js';
import { validarId } from '../middlewares/validarId.js';
import { validarUsuario } from '../middlewares/validarUsuario.js';
import { validarConsulta } from '../middlewares/validarConsulta.js';

const router = Router();

router.get('/', validarConsulta, ctrl.listar);
router.get('/:id', validarId, ctrl.obtener);
router.post('/', validarUsuario, ctrl.crear);
router.put('/:id', validarId, validarUsuario, ctrl.actualizar);
router.delete('/:id', validarId, ctrl.eliminar);

export default router;