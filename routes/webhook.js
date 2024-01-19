const router = require('express').Router();

const {graphyNotify, interaktNotify, interaktReplaceTrait, interaktModifyStatusTraitOnboarding } = require('../controllers/webhook');


router.post('/graphy/notify', graphyNotify);

router.post('/interakt/notify', interaktNotify);

router.post('/interakt/replace', interaktReplaceTrait);

router.post('/interakt/onboard', interaktModifyStatusTraitOnboarding);

module.exports = router;
