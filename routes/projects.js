const express = require('express');
const router = express.Router();
const {verifyToken} = require("../utils/handleJwt")
const { projectValidator } = require('../validators/projectsValidator');
const ctrl = require('../controllers/projects');

router.use(verifyToken);

router.post('/', projectValidator, ctrl.createProject);
router.put('/:id', projectValidator, ctrl.updateProject);
router.get('/', ctrl.getAllProjects);
router.get('/archived', ctrl.getArchivedProjects);
router.get('/:id', ctrl.getProjectById);
router.delete('/:id', ctrl.deleteProject);
router.patch('/:id/restore', ctrl.restoreProject);

module.exports = router;
