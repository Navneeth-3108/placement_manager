const express = require('express');
const controller = require('../controllers/studentController');
const { ROLES, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', authorize(ROLES.ADMIN, ROLES.OFFICER, ROLES.STUDENT), controller.listStudents);
router.get('/:id', authorize(ROLES.ADMIN, ROLES.OFFICER, ROLES.STUDENT), controller.getStudent);
router.post('/', authorize(ROLES.ADMIN, ROLES.OFFICER), controller.createStudent);
router.put('/:id', authorize(ROLES.ADMIN, ROLES.OFFICER), controller.updateStudent);
router.delete('/:id', authorize(ROLES.ADMIN), controller.deleteStudent);

module.exports = router;
