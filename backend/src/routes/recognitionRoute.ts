import {Router} from 'express';
import multer from 'multer';
import {handleRecognize} from '../controllers/recognitionController';

const router = Router();

const upload = multer({storage: multer.memoryStorage()});

router.post('/recognize', upload.single('image'), handleRecognize);
router.get('/recognize', upload.single('image'), handleRecognize);

export default router;