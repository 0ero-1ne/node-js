import express from 'express';
import AuditoriumTypeController from '../controllers/auditorium-type-controller.js';

const router = express.Router();

router.get('/', AuditoriumTypeController.getAuditoriumTypes);
router.post('/', AuditoriumTypeController.createAuditoriumType);
router.put('/', AuditoriumTypeController.updateAuditoriumType);
router.delete('/:id', AuditoriumTypeController.deleteAuditoriumType);

export default router;