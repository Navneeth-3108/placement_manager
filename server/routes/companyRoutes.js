const express = require('express');
const controller = require('../controllers/companyController');

const router = express.Router();

router.get('/', controller.listCompanies);
router.get('/:id', controller.getCompany);
router.post('/', controller.createCompany);
router.put('/:id', controller.updateCompany);
router.delete('/:id', controller.deleteCompany);

module.exports = router;
