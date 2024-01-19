const{getLearnerDetails,getProductDetails,getCourseDetails,getCourseProgress,getUsage,getTransactionInfo,getItemsCount,activeLearners}=require('../utils/graphy')
//testing learner details function
async function testGetLearnerDetails(req, res) {
  const { mid, key, skip, limit, courseInfo, query } = req.query || {};
  try {
    const queryParams = {
      mid,
      key,
      skip,
      limit,
      courseInfo,
      query: query ? JSON.parse(decodeURIComponent(query)) : null // decode JSON string if query is present
    };
    console.log(queryParams);
    const data = await getLearnerDetails(queryParams);    
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something wrong" });
  }
}
//testing product details function
async function testGetProductDetails(req, res) {
  const { mid, key, skip, limit, query } = req.query || {};
  console.log("query=" + query);
  try {
    const queryParams = {
      mid,
      key,
      skip,
      limit,
      query
    };

    const data = await getProductDetails(queryParams);    
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

//testing course realted details function
async function testGetCourseDetails(req, res) {
  const { mid, key, skip, limit, courseInfo, query } = req.query || {};
  try {
    const queryParams = {
      mid,
      key,
      skip,
      limit,
      courseInfo,
      query: query ? JSON.parse(decodeURIComponent(query)) : null // decode JSON string if query is present
    };
    const data = await getCourseDetails(queryParams);    
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something wrong" });
  }
}

//testing course progress related function
async function testGetCourseProgress(req, res) {
  const { mid, key, skip, limit, productId } = req.query || {};
  try {
    const queryParams = {
      mid,
      key,
      skip,
      limit,
      productId
    };
    const data = await getCourseProgress(queryParams);    
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something wrong" });
  }
}

//testinng usage realted function
async function testGetUsage(req, res) {
  const { mid, key, productId, date } = req.query || {};

  const { learnerId } = req.params;
  
  try {
    let data;
    if (date !== null) {
      data = await getUsage(mid, key, productId, date, learnerId);
    } else {
      data = await getUsage(mid, key, productId, learnerId);
    }
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

//testing transaction related function
async function testTransaction(req,res){
  const{mid,key,skip,limit,startDate,endDate,status,channel,type}=req.query||{}
  try{
    const queryParams={mid,key,skip,limit,startDate,endDate,status,channel,type}
    const data=await getTransactionInfo(queryParams)
    res.json(data)
  }catch(error){
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

//controller function for course items count function
function getItemsCountController(req, res) {
  const { productId, mid, key } = req.query;
  
  getItemsCount(productId, mid, key)
    .then(itemsCount => {
      res.json({ count: itemsCount });
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
}

async function testActiveLearners(req,res){
  const{ skip, limit, productIds, dateFrom, dateTo }=req.query||{}
  try {
    // const queryParams={}
    const data=await activeLearners(skip,limit,productIds,dateFrom,dateTo);
    console.log(data);
    res.json(data)
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}


module.exports={
    testGetLearnerDetails,testGetProductDetails,testGetCourseDetails,testGetCourseProgress,testGetUsage,testTransaction,getItemsCountController,testActiveLearners
}