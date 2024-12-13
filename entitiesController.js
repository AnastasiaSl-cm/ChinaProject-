const Entity = require('../models/entityModel');

exports.getAllEntities = async (req, res, next) => {
  try {
    const { sort, filter } = req.query;
    let query = {};
    if (filter) query = JSON.parse(filter);

    const entities = await Entity.find(query).sort(sort);
    res.json(entities);
  } catch (error) {
    next(error);
  }
};

exports.getEntityById = async (req, res, next) => {
  try {
    const entity = await Entity.findById(req.params.id);
    if (!entity) return res.status(404).json({ message: 'Entity not found' });
    res.json(entity);
  } catch (error) {
    next(error);
  }
};

exports.createEntity = async (req, res, next) => {
  try {
    const newEntity = new Entity(req.body);
    const savedEntity = await newEntity.save();
    res.status(201).json(savedEntity);
  } catch (error) {
    if (error.code === 11000)
      return res.status(409).json({ message: 'Entity name already exists' });
    next(error);
  }
};

exports.updateEntity = async (req, res, next) => {
  try {
    const updatedEntity = await Entity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEntity)
      return res.status(404).json({ message: 'Entity not found' });
    res.json(updatedEntity);
  } catch (error) {
    next(error);
  }
};

exports.deleteEntity = async (req, res, next) => {
  try {
    const deletedEntity = await Entity.findByIdAndDelete(req.params.id);
    if (!deletedEntity)
      return res.status(404).json({ message: 'Entity not found' });
    res.json(deletedEntity);
  } catch (error) {
    next(error);
  }
};
