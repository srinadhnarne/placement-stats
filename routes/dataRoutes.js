import express from 'express'
import { AllDataController, 
        cummulatedDataController, 
        FTEController, 
        SixMonthController, 
        updateDataController 
    } from '../controllers/dataControllers.js';
import { isAdmin, verifyToken } from '../middleWares/authMiddleWare.js';

const router = express.Router();

router.post('/get-6M/:pgNo',verifyToken,SixMonthController);

router.post('/get-FTE/:pgNo',verifyToken,FTEController);

router.post('/get-All/:pgNo',verifyToken,AllDataController);

router.get('/get-cummulated-data/:queryType',verifyToken,cummulatedDataController);

router.post('/update-Data',verifyToken,isAdmin,updateDataController)

export default router;