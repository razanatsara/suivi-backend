const Etudiant = require('../Model/etudiantModel');
const mongoose = require('mongoose');
const getDataFromExcel = require('../getDataExcel');

// creation etudiant à partir de l'excel
module.exports.createEtudiantExcle = async (req, res) => {
  if (req.file) {
    try {
      const student = getDataFromExcel(req.file.path);
      await student.forEach((entree) => {
        entree.classe = [
          {
            anneEtude: req.body.anneEtude,
            niveau: req.body.niveau,
          },
        ];
      });
      const insertEtudiant = await Etudiant.insertMany(student);
      res.status(201).send(insertEtudiant);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};
// creation de l'etudiant
module.exports.createEtudiant = async (req, res) => {
  const {
    nom,
    prenom,
    parcours,
    typeFormation,
    telephone,
    ecole,
    niveau,
    anneEtude,
  } = req.body;
  console.log(req.body);
  // add to the database
  try {
    const etudiant = await Etudiant.create({
      nom,
      prenom,
      parcours,
      telephone,
      typeFormation,
      telephone,
      ecole,
      classe: [
        {
          anneEtude: anneEtude,
          niveau: niveau,
        },
      ],
    });
    res.status(200).send(etudiant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// obtention d'un seul etudiant
module.exports.getOneEtudiant = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "L'étudiant n'existe pas" });
  }
  const etudiant = await Etudiant.findById(id);
  if (!etudiant) {
    return res.status(404).json({ error: "L'étudiant n'existe pas" });
  }
  res.status(200).send(etudiant);
};
module.exports.searchEtudiant = async (req, res) => {
  let query = {};
  if (req.query.nom) {
    query.nom = { $regex: req.query.nom, $options: 'i' };
  }
  if (req.query.prenom) {
    query.prennom = { $regex: req.query.prenom, $options: 'i' };
  }
  if (req.query.parcours) {
    query.parcours = { $regex: req.query.parcours, $options: 'i' };
  }
  if (req.query.typeFormation) {
    query.typeFormation = { $regex: req.query.typeFormation, $options: 'i' };
  }
  if (req.query.anneEtude) {
    query.anneEtude = req.query.anneEtude;
  }

  await Etudiant.find(query, (err, etudiant) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(etudiant);
  });
};

module.exports.searchEtudiantParcours = async (req, res) => {
  const etudiant = await Etudiant.find({
    parcours: req.params.parcours,
    typeFormation: req.params.typeFormation,
    'classe.anneEtude': req.params.anneEtude,
  });
  if (!etudiant) {
    return res.status(404).json({ error: "L'étudiant n'existe pas" });
  }
  res.status(200).send(etudiant);
};

// réinscription des étudiants
module.exports.reinscription = async (req, res) => {
  for (let i = 0; i < req.body.etudiant.length; i++) {
    if (req.body.etudiant[i].admis === true) {
      const etudiant = await Etudiant.findByIdAndUpdate(
        { _id: req.body.etudiant[i]._id },
        {
          $push: {
            classe: {
              niveau: req.body.niveau,
              anneEtude: req.body.anneEtude,
            },
          },
        },
        { new: true }
      );
    } else {
      const etudiant = await Etudiant.findByIdAndUpdate(
        { _id: req.body.etudiant[i]._id },
        {
          $push: {
            classe: {
              niveau: req.body.niveau,
              anneEtude: req.body.anneEtude - 1,
            },
          },
        },
        { new: true }
      );
    }
  }
  res.status(200);
};

// ajout de liste des sortants
module.exports.addSortant = async (req, res) => {
  for (let i = 0; i < req.body.etudiant.length; i++) {
    if (req.body.etudiant[i].admis === true) {
      const etudiant = await Etudiant.findByIdAndUpdate(
        {
          _id: req.body.etudiant[i]._id,
          classe: {
            $elemMatch: {
              anneEtude: req.body.anneEtude,
            },
          },
        },
        {
          $set: {
            'classe.$.promotion': req.body.promotion,
          },
        }
      );
    }
  }
};

module.exports.searchEtudiant = async (req, res) => {
  let query = {};

  if (req.query.parcours) {
    query.parcours = { $regex: req.query.parcours, $options: 'i' };
  }
  if (req.query.typeFormation) {
    query.typeFormation = { $regex: req.query.typeFormation, $options: 'i' };
  }

  await Etudiant.find(query, (err, etudiant) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(etudiant);
  });
};

// obtention etudiant selon parcours
module.exports.getAllEtudiant = async (req, res) => {
  const etudiant = await Etudiant.find();
  if (!etudiant) {
    return res.status(404).json({ error: "L'étudiant n'existe pas" });
  }
  res.status(200).send(etudiant);
};

// mettre à jour étudiant entrant
module.exports.updateEtudiantEntrant = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "L'etudiant n'existe pas" });
  }
  const etudiant = await Etudiant.findOneAndUpdate(
    { _id: id },
    {
      lettreConfirmation: req.files['lettreConfirmation'][0].path,
      lettreEngagement: req.files['lettreEngagement'][0].path,
      ficheIndividuelle: req.files['ficheIndividuelle'][0].path,
      photoIdentite: req.files['photoIdentite'][0].path,
      conventionInsription: req.files['conventionInsription'][0].path,
      recupaiement: req.files['recupaiement'][0].path,
    },
    { new: true }
  );
  if (!etudiant) {
    return res.status(400).json({ error: "L'etudiant n'existe pas" });
  }

  res.status(200).json(etudiant);
};
// mettre à jour étudiant sortant
module.exports.updateEtudiantSortant = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "L'etudiant n'existe pas" });
  }
  const etudiant = await Etudiant.findOneAndUpdate(
    { _id: id },
    {
      quitus: req.files['quitus'][0].path,
      ficheCorrecction: req.files['ficheCorrection'][0].path,
      ficheAttestation: req.files['ficheAttestation'][0].path,
      demandeDiplome: req.files['demandeDiplome'][0].path,
      quittance: req.files['quittance'][0].path,
      procuration: req.files['procuration'][0].path,
      releveNote: req.files['releveNote'][0].path,
      diplome: req.body.diplome,
    }
  );
  if (!etudiant) {
    return res.status(400).json({ error: "L'etudiant n'existe pas" });
  }

  res.status(200).json(etudiant);
};

// effacer un étudiant
module.exports.deleteEtudiant = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "L'etudiant n'existe pas" });
  }

  const etudiant = await Etudiant.findOneAndDelete({ _id: id });

  if (!etudiant) {
    return res.status(400).json({ error: "L'etudiant n'existe pas" });
  }

  res.status(200).json(etudiant);
};
