const fetch = require('node-fetch');
const retry = require('async-retry');
const axios = require('axios');

async function getLearnerDetails({ mid, key, skip, limit, courseInfo, query }) {
  let url = `https://api.ongraphy.com/public/v1/learners?mid=${mid}&key=${key}&limit=${limit}&courseInfo=${courseInfo}`;
  if (query && typeof query === "object") {
    url += `&query=${encodeURIComponent(JSON.stringify(query))}`;
  }

  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000
  };

  try {
    const data = await retry(async (bail) => {
      const response = await fetch(url, requestOptions);
      const responseData = await response.json();

      if (response.status >= 400) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      return responseData;
    }, {
      retries: 3, // retry 3 times
      onRetry: (error, attempt) => {
        console.log(`Retrying after attempt ${attempt}. Error: ${error.message}`);
      }
    });

    const result = {
      data: data.data.map(item => ({
        email: item.email,
        signupDeviceId: item.id,
        loginDevices: item.loginDevices && item.loginDevices.map(loginDevice => ({
          deviceId: loginDevice.deviceId,
          isMobile: loginDevice.isMobile,
          deviceModel: loginDevice.deviceModel,
          date: {
            $date: loginDevice.date.$date
          },
          count: loginDevice.count
        })),
        // token: {
        //   ANDROID: item.token.ANDROID
        // },
        id: item.id,
        name: item.name,
        mobile: item.mobile,
        active: item.active,
        'created date': item['created date'],
        'last login': item['last login'],
        Mobile: item.mobile,
        courses: item.courses && item.courses.map(course => ({
          id: course.id,
          Title: course.Title,
          'Assigned Date': course['Assigned Date'],
          'last access date': course['last access date'],
          'assessments score': course['assessments score']
        }))
      })),
      total: data.total,
      limit: data.limit,
      skip: data.skip
    };

    return result;


  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong");
  }
}


//function to get product details

async function getProductDetails({ mid, key, skip, limit, query }) {
  let url = `https://api.ongraphy.com/public/v1/products?mid=${mid}&key=${key}&limit=${limit}`;
  console.log("before encoding " + query);
  if (query && typeof query === "object") {
    url += `&query=${encodeURIComponent(JSON.stringify(query))}`;
  }
  console.log("after encoding" + query);
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  };

  try {
    const data = await retry(async (bail) => {
      const response = await fetch(url, requestOptions);
      const responseData = await response.json();

      if (response.status >= 400) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      return responseData;
    }, {
      retries: 3, // retry 3 times
      onRetry: (error, attempt) => {
        console.log(`Retrying after attempt ${attempt}. Error: ${error.message}`);
      },
    });

    const result = {
      data: data.data.map((course) => ({
        id: course.id,
        title: course.title,
        instructor: course.instructor,
        language: course.language,
        "created date": course["created date"],
        "modified date": course["modified date"],
        price: course.price,
        "discounted price": course["discounted price"],
        category: course.category,
        tags: course.tags,
      })),
      total: data.total,
      limit: data.limit,
      // skip: data.skip,
    };

    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong");
  }
}

//function to get course related learner details
async function getCourseDetails({ mid, key, limit, courseInfo, query }) {
  let url = `https://api.ongraphy.com/public/v2/learners?mid=${mid}&key=${key}&limit=${limit}&courseInfo=${courseInfo}`;

  if (query && typeof query === "object") {
    url += `&query=${encodeURIComponent(JSON.stringify(query))}`;
  }

  try {
    const response = await axios.get(url);
    const data = response.data.data;
    const result = {
      data: data.map((item) => ({
        email: item.email,
        token: {
          ANDROID: item.token.ANDROID || ""
        },
        id: item.id,
        name: item.name,
        mobile: item.mobile,
        active: item.active,
        "created date": item.created_date,
        state: item.state,
        "last login": item.last_login,
        courses: item.courses.map((course) => ({
          id: course.id,
          Title: course.Title,
          'Assigned Date': course['Assigned Date'],
          course_items: course['course items'] ? course['course items'].map((courseItem) => ({
            "totalTime": courseItem.totalTime,
            "completed": courseItem.completed || false,
            "type": courseItem.type || "",
            "title": courseItem.title || ""
          })) : []
        }))
      })),
      total: response.data.total,
      limit: response.data.limit,
    };
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong");
  }
}




//function to get course progress report
async function getCourseProgress({ mid, key, skip, limit, productIds }) {
  let url = `https://api.ongraphy.com/t/api/public/v3/products/courseprogressreports?mid=${mid}&key=${key}&skip=${skip}&productIds=${productIds}`
  try {
    const response = await axios.get(url)
    const data = response.data.data
    const result = {
      data: data.map((item) => ({
        productId: item.productId,
        totalTimeSpent: item.totalTimeSpent,
        averageCourseCompletion: item.averageCourseCompletion,
      })),
      count: data.length,
      skip: data.skip,
      limit: data.limit,
    };
    return result;
  }
  catch (error) {
    console.error(error)
    throw new Error('something went wrong')
  }
}

//function to get course time spent by user
async function getUsage(mid, key, productId, date, learnerId) {
  let url = `https://api.ongraphy.com/public/v1/learners/${learnerId}/usage?mid=${mid}&key=${key}&productId=${productId}`;

  if (date !== undefined) {
    url += `&date=${date}`;
  }

  try {
    const response = await axios.get(url);
    console.log(response);
    const data = response.data;
    console.log(data);
    const result = {
      "time spent in secs": data["time spent in secs"]
    };
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Something went wrong');
  }
}

//function to get transaction info
async function getTransactionInfo({ mid, key, skip, limit, startDate, endDate, status, channel, type }) {
  let url = "https://api.ongraphy.com/public/v1/transactions?mid=" + mid + "&key=" + key + "&limit=" + limit;
  //null checks
  if (startDate !== null && startDate !== undefined &&
    endDate !== null && endDate !== undefined &&
    status !== null && status !== undefined &&
    channel !== null && channel !== undefined &&
    type !== null && type !== undefined) {
    url += "&startDate=" + startDate + "&endDate=" + endDate + "&status=" + status + "&channel=" + channel + "&type=" + type;
  }
  try {
    const response = await axios.get(url)
    const data = response.data
    const result = {
      data: data.data.map(item => ({
        _id: item._id,
        TXNID: "NA",
        ORDERID: item.ORDERID,
        TXNAMOUNT: item.TXNAMOUNT,
        userId: item.userId || "",
        userEmail: item.userEmail || "",
        userPhone: item.userPhone || "",
        currencyCode: item.currencyCode,
        createdDate: item.createdDate,
        status: item.status,
        channel: item.channel,
        placeOfSupply: item.placeOfSupply || "",
        promoDiscount: item.promoDiscount || "",
        promocode: item.promocode || "",
        totalWOPromo: item.totalWOPromo || ""
      })),
      total: data.total,
      limit: data.limit,
      skip: data.skip
    };
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong");
  }
}

//get product by id
async function getItemsCount(productId, mid, key) {
  const url = `https://api.ongraphy.com/public/v1/products/${productId}?mid=${mid}&key=${key}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      const itemsCount = data.items.length;
      return itemsCount;
    } else {
      throw new Error('couldnt get data');
    }
  } catch (error) {
    console.error(error);
    throw new Error('error occured while fetching data');
  }
}



//integration code with parameters requested directly
// async function activeLearners(req, res) {
//   const { mid, key, skip, limit, productIds, dateFrom, dateTo } = req.query || {};

//   // Check if required parameters are provided
//   if (!mid || !key || !limit) {
//     return res.status(400).json({ message: 'Missing required parameters.' });
//   }

//   let url = `https://api.ongraphy.com/t/api/public/v3/products/activelearners?mid=${mid}&key=${key}&limit=${limit}`;

//   // Add optional parameters if provided
//   if (skip) {
//     url += '&skip=' + skip;
//   }

//   if (productIds && dateFrom && dateTo) {
//     url += `&productIds=${productIds}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
//   }

//   try {
//     const response = await fetch(url);
//     const data = await response.json();

//     // Check if the response is successful (status code 200)
//     if (response.ok) {
//       return res.json(data);
//     } else {
//       return res.status(response.status).json(data);
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Something went wrong' });
//   }
// }

//code to use with tag all 


async function activeLearners(skip, limit, productIds, dateFrom, dateTo) {
  // paramter fulfillment check
  // if (!mid || !key || !limit) {
  //   throw new Error('Missing required parameters.');
  // }

  const mid="agribuzz1126"//store safely on server
  const key="916f493a-418e-495f-abe3-c832f90d78ea"//store safely on server

  let url = `https://api.ongraphy.com/t/api/public/v3/products/activelearners?mid=${mid}&key=${key}&skip=${skip}&limit=${limit}`

  if (productIds && dateFrom && dateTo) {
    url += `&productIds=${productIds}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
  }

  try {
    const response = await fetch(url);

    const data = await response.json();

    // response check
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || 'Something went wrong');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Something went wrong');
  }
}

module.exports = {
  getLearnerDetails, getProductDetails, getCourseDetails, getCourseProgress, getUsage, getTransactionInfo, getItemsCount
  ,activeLearners
}