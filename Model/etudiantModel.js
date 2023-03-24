const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const etudiantSchema = new Schema(
  {
    nom: {
      type: String,
    },
    prenom: {
      type: String,
    },
    sexe: {
      type: String,
    },
    telephone: {
      type: String,
    },
    email: {
      type: String,
    },
    parcours: {
      type: String,
    },
    typeFormation: {
      type: String,
    },
    mention: {
      type: String,
    },
    ecole: {
      type: String,
    },
    classe: [
      {
        niveau: {
          type: String,
        },
        anneEtude: {
          type: String,
        },
      },
    ],
    promotion: {
      type: String,
    },
    lettreConfirmation: {
      type: String,
    },
    lettreEngagement: {
      type: String,
    },
    ficheIndividuelle: {
      type: String,
    },
    photoIdentite: {
      type: String,
    },
    conventionInsription: {
      type: String,
    },
    recupaiement: {
      type: String,
    },
    quitus: {
      type: String,
    },
    ficheCorrection: {
      type: String,
    },
    ficheAttestation: {
      type: String,
    },
    demandeDiplome: {
      type: String,
    },
    quittance: {
      type: String,
    },
    procuration: {
      type: String,
    },
    releveNote: {
      type: String,
    },
    diplome: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Etudiant', etudiantSchema);
