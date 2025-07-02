const {projectsModel} = require('../models');
const {clientsModel} = require('../models');

const createProject = async (req, res) => {
  const { nombre, cliente } = req.body;
  const userId = req.user._id;
  const company = req.user.company;

  const existing = await projectsModel.findOne({
    nombre,
    cliente,
    deleted: false,
    $or: [{ createdBy: userId }, { company }]
  });

  if (existing) return res.status(409).json({ error: 'Proyecto ya existe para este cliente' });

  const client = await clientsModel.findById(cliente);
  if (!client) return res.status(404).json({ error: 'Cliente no encontrado' });

  const projectData = {
    ...req.body,
    createdBy: userId,
    company: company || undefined
  };

  const project = await projectsModel.create(projectData)

  await project.save();
  res.status(201).json(project);
};

const updateProject = async (req, res) => {
  const { id } = req.params;
  const project = await projectsModel.findById(id);
  if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

  const authorized = project.createdBy.equals(req.user._id) ||
    (req.user.company && project.company?.equals(req.user.company));
  if (!authorized) return res.status(403).json({ error: 'No autorizado' });

  Object.assign(project, req.body);
  await project.save();
  res.json(project);
};

const getAllProjects = async (req, res) => {
  const query = {
    deleted: false,
    $or: [
      { createdBy: req.user._id },
      { company: req.user.company }
    ]
  };

  const projects = await projectsModel.find(query).populate('cliente');
  res.json(projects);
};

const getProjectById = async (req, res) => {
  const project = await projectsModel.findOne({
    _id: req.params.id,
    deleted: false,
    $or: [
      { createdBy: req.user._id },
      { company: req.user.company }
    ]
  }).populate('cliente');

  if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
  res.json(project);
};

const deleteProject = async (req, res) => {
  const { id } = req.params;
  const soft = req.query.soft !== 'false';
  const project = await projectsModel.findById(id);
  if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

  const authorized = project.createdBy.equals(req.user._id) ||
    (req.user.company && project.company?.equals(req.user.company));
  if (!authorized) return res.status(403).json({ error: 'No autorizado' });

  if (soft) {
    project.deleted = true;
    await project.save();
    res.json({ message: 'Proyecto archivado (soft delete)' });
  } else {
    await projectsModel.findByIdAndDelete(id);
    res.json({ message: 'Proyecto eliminado (hard delete)' });
  }
};

const getArchivedProjects = async (req, res) => {
  const query = {
    deleted: true,
    $or: [
      { createdBy: req.user._id },
      { company: req.user.company }
    ]
  };

  const projects = await projectsModel.find(query).populate('cliente');
  res.json(projects);
};

const restoreProject = async (req, res) => {
  const project = await projectsModel.findOne({
    _id: req.params.id,
    deleted: true,
    $or: [
      { createdBy: req.user._id },
      { company: req.user.company }
    ]
  });

  if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

  project.deleted = false;
  await project.save();

  res.json({ message: 'Proyecto restaurado', project });
};

module.exports = { createProject, updateProject, getAllProjects, getProjectById, deleteProject, getArchivedProjects, restoreProject };
