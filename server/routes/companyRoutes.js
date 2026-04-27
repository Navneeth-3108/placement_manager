const express = require('express');
const controller = require('../controllers/companyController');
const { ROLES, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', authorize(ROLES.ADMIN, ROLES.OFFICER, ROLES.STUDENT), controller.listCompanies);
router.get('/:id', authorize(ROLES.ADMIN, ROLES.OFFICER, ROLES.STUDENT), controller.getCompany);
router.post('/', authorize(ROLES.ADMIN, ROLES.OFFICER), controller.createCompany);
router.put('/:id', authorize(ROLES.ADMIN, ROLES.OFFICER), controller.updateCompany);
router.delete('/:id', authorize(ROLES.ADMIN), controller.deleteCompany);

module.exports = router;
