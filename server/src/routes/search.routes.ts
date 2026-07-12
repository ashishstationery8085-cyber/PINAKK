import { Router } from 'express';
import { searchSuggestions, smartSearch } from '../controllers/search.controller';

const router = Router();

router.get('/suggestions', searchSuggestions);
router.get('/', smartSearch);

export default router;
