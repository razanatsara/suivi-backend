const express = require('express');
const etudiantController = require('../Controller/etudiantController');
const router = express.Router();
const upload = require('../middleware/upload.file');

// obtenir un etudiant
router.get('/:id', etudiantController.getOneEtudiant);

router.get('/search', etudiantController.searchEtudiant);

// obtenir listes des etudiants selon parcours
router.get('/', etudiantController.getAllEtudiant);

// creation de l'etudiant
router.post(
  '/inscription',
  upload.single('fichier'),
  etudiantController.createEtudiantExcle
);
// creation de l'etudiant
router.post('/', etudiantController.createEtudiant);
// mise à jour de dossier entrant de l'etudiant
router.patch(
  '/entrant/:id',
  upload.fields([
    { name: 'lettreConfirmation' },
    { name: 'lettreEngagement' },
    { name: 'ficheIndividuelle' },
    { name: 'photoIdentite' },
    { name: 'conventionInsription' },
    { name: 'recupaiement' },
  ]),
  etudiantController.updateEtudiantEntrant
);
// mise à jour de dossier sortant de l'etudiant
router.patch(
  '/sortant/:id',
  upload.fields([
    { name: 'quitus' },
    { name: 'ficheCorrection' },
    { name: 'ficheAttestation' },
    { name: 'demandeDiplome' },
    { name: 'quittance' },
    { name: 'procuration' },
    { name: 'releveNote' },
  ]),
  etudiantController.updateEtudiantSortant
);
// suppression de l'etudiant de l'etudiant
router.delete('/:id', etudiantController.deleteEtudiant);

module.exports = router;
