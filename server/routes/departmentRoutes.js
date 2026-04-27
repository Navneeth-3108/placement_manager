const express = require('express');
const controller = require('../controllers/departmentController');
const { ROLES, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', authorize(ROLES.ADMIN, ROLES.OFFICER, ROLES.STUDENT), controller.listDepartments);
router.get('/:id', authorize(ROLES.ADMIN, ROLES.OFFICER, ROLES.STUDENT), controller.getDepartment);
router.post('/', authorize(ROLES.ADMIN, ROLES.OFFICER), controller.createDepartment);
router.put('/:id', authorize(ROLES.ADMIN, ROLES.OFFICER), controller.updateDepartment);
router.delete('/:id', authorize(ROLES.ADMIN), controller.deleteDepartment);

module.exports = router;
