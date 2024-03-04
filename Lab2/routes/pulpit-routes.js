import express from 'express';
import PulpitController from '../controllers/pulpit-controller.js';

const router = express.Router();

router.get('/', PulpitController.getPulpits);
router.post('/', PulpitController.createPulpit);
router.put('/', PulpitController.updatePulpit);
router.delete('/:id', PulpitController.deletePulpit);

export default router;