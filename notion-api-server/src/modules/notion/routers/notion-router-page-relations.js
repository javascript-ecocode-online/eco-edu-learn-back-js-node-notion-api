import express from 'express'
import { EcoNotionControllerPageRelations } from '../controllers/notion-controller-page-relations.js';

const router = express.Router()
const controller = new EcoNotionControllerPageRelations({ name: 'EcoPageRelationsontroller' });

router.get('/:pageId', controller.getRelations)

export default router