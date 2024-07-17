const Model = require('../models/model');
const Brand = require('../models/brand');

// Listar todos los modelos
module.exports.list = async (req, res, next) => {

  try {
    const models = await Model.find().populate('brand').populate('createdBy');
    
    res.status(200).json({
      count: models.length,
      data: models
    });
   
  } catch (e) {
    res.status(400).json(e);
  }
};

// Agregar un nuevo modelo
module.exports.add = async (req, res, next) => {

  try {
    const { name, brand, createdBy } = req.body;
    
    const newModel = new Model({
      name: name,
      brand: brand,
      createdBy: createdBy,
      updatedOn: new Date() // Asegúrate de configurar `updatedOn` correctamente
    });
    
    await newModel.save(async (err, data) => {
      
      if (err)
        return res.status(400).json({ err: err });
      else { 
        let model = await Model.findOne({_id : data.id}).populate("brand");
        console.log({ data: model, message: "Model added correctly!" })
        return res.status(201).json({ data: model, message: "Model added correctly!" });
      }
    });
  } catch (e) {
    res.status(400).json(e);
  }
};

// Editar un modelo existente
module.exports.edit = async (req, res, next) => {
  try {
    const { name, brand, createdBy, _id } = req.body;
    
    Model.findByIdAndUpdate(_id, { $set: { name, brand, createdBy, updatedOn: new Date() } }, { new: true }, function (err, data) {
      if (err)
        res.status(400).json(err);
      else
        res.status(201).json({ data: data, message: "Model updated correctly!" });
    });
  } catch (e) {
    res.status(400).json(e);
  }
};

// Eliminar un modelo
module.exports.delete = async (req, res, next) => {
  let id = req.query.id;
  let deletedModel = await Model.deleteOne({ _id: id });

  if (deletedModel.deletedCount > 0) {
    res.status(200).json({
      data: deletedModel,
      message: "Model deleted successfully",
    });
  } else {
    res.status(404).json({
      message: "No model found",
      data: {},
    });
  }
};
