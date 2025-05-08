
import express from 'express'
import { EcoNotionControllerBuildPage } from '../controllers/notion-controller-page-build.js';

const router = express.Router()
const controller = new EcoNotionControllerBuildPage({ name: 'EcoBuildPageController' });

router.post('/', controller.buildPage)

export default router
