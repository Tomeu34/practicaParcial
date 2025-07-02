const {clientsModel} = require('../models');

const createClient = async (req, res) => {
  const { nombre, email } = req.body;
  const userId = req.user._id;
  const company = req.user.company; // si está definido

  // Prevenir duplicados por usuario o empresa
  const existing = await clientsModel.findOne({
    nombre,
    $or: [{ createdBy: userId }, { company }],
    deleted: false
  });

  if (existing) {
    return res.status(409).json({ error: 'Cliente ya existe para este usuario o empresa' });
  }

  const clientData = {
    ...req.body,
    createdBy: userId,
    company: company || undefined
  };

  console.log(clientData)

  const client = await clientsModel.create(clientData)

  await client.save();
  res.status(201).json(client);
};

const updateClient = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const company = req.user.company;

  const client = await clientsModel.findById(id);
  if (!client) return res.status(404).json({ error: 'Cliente no encontrado' });

  const allowed = client.createdBy.equals(userId) || (company && client.company?.equals(company));
  if (!allowed) return res.status(403).json({ error: 'No tienes acceso a este cliente' });

  Object.assign(client, req.body);
  await client.save();

  res.json(client);
};

const getAllClients = async (req, res) => {
  const userId = req.user._id;
  const company = req.user.company;

  const query = {
    deleted: false,
    $or: [
      { createdBy: userId },
      { company }
    ]
  };

  const clients = await clientsModel.find(query);
  res.json(clients);
};

const getOneClient = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const company = req.user.company;

  const client = await clientsModel.findOne({
    _id: id,
    deleted: false,
    $or: [{ createdBy: userId }, { company }]
  });

  if (!client) return res.status(404).json({ error: 'Cliente no encontrado' });
  res.json(client);
};

const deleteClient = async (req, res) => {
  const { id } = req.params;
  const soft = req.query.soft !== 'false';
  const userId = req.user._id;
  const company = req.user.company;

  const client = await clientsModel.findById(id);
  if (!client) return res.status(404).json({ error: 'Cliente no encontrado' });

  const allowed = client.createdBy.equals(userId) || (company && client.company?.equals(company));
  if (!allowed) return res.status(403).json({ error: 'No tienes acceso a este cliente' });

  if (soft) {
    client.deleted = true;
    await client.save();
    res.json({ message: 'Cliente archivado (soft delete)' });
  } else {
    await Client.findByIdAndDelete(id);
    res.json({ message: 'Cliente eliminado (hard delete)' });
  }
};

const getArchivedClients = async (req, res) => {
  const userId = req.user._id;
  const company = req.user.company;

  const archived = await clientsModel.find({
    deleted: true,
    $or: [{ createdBy: userId }, { company }]
  });

  res.json(archived);
};

const restoreClient = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const company = req.user.company;

  const client = await clientsModel.findOne({
    _id: id,
    deleted: true,
    $or: [{ createdBy: userId }, { company }]
  });

  if (!client) return res.status(404).json({ error: 'Cliente no encontrado o no archivado' });

  client.deleted = false;
  await client.save();

  res.json({ message: 'Cliente restaurado', client });
};

module.exports = { createClient, updateClient, getAllClients, getOneClient, deleteClient, getArchivedClients, restoreClient };
