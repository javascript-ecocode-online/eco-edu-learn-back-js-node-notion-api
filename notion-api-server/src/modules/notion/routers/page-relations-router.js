import express from 'express'
import { EcoPageRelationsController } from '../controllers/page-relations-controller.js';

const router = express.Router()
const controller = new EcoPageRelationsController({ name: 'EcoPageRelationsontroller' });

router.get('/:pageId', controller.getRelations)

export default router