
import express from 'express'
import { EcoBuildPageController } from '../controllers/build-page-controller.js';

const router = express.Router()
const controller = new EcoBuildPageController({ name: 'EcoBuildPageController' });

router.post('/', controller.buildPage)

export default router
