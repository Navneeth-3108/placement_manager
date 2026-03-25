const express = require('express');
const controller = require('../controllers/departmentController');

const router = express.Router();

router.get('/', controller.listDepartments);
router.get('/:id', controller.getDepartment);
router.post('/', controller.createDepartment);
router.put('/:id', controller.updateDepartment);
router.delete('/:id', controller.deleteDepartment);

module.exports = router;
