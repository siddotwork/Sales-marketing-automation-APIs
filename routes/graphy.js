const router = require('express').Router();

const{testGetLearnerDetails,testGetProductDetails, testGetCourseDetails,testGetCourseProgress,testGetUsage,testTransaction,getItemsCountController,testActiveLearners}=require('../controllers/graphy');

// const{activeLearners}=require('../utils/graphy');

router.get('/getLearnerDetails',testGetLearnerDetails)//route to learner details function
router.get('/getProductDetails',testGetProductDetails)//route to product details function
router.get('/getCourseDetails',testGetCourseDetails)
router.get('/getProgress',testGetCourseProgress)
router.get('/getUsage/:learnerId',testGetUsage)
router.get('/getTransactions',testTransaction)

router.get('/getactivelearners',testActiveLearners)

module.exports=router;