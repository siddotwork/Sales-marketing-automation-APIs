const { modifyUserTrait, sendDiscordNotification } = require('../utils/webhooks');
const{activeLearners}=require('../utils/graphy');

const webhook_url = 'https://discord.com/api/webhooks/1072392056028278835/TBNZ-Z5Gx6mgqPm0c39ylZw0G1cjJKTc-6NMqz_HEG-k7i6D8k3uFKBkN8-juMx6kgdX';
const interakt_url = 'https://api.interakt.ai/v1/public/track/users/';


const graphyNotify = async (req, res, next) => {
  // res.status(200).json({ data: 'Notification Received.', notific: req.body });

  // const data = req.params.order_id;
  const data = JSON.stringify(req.headers);
  // console.log(data);

  // after creating the order, it's the time for creating an event
  // you can pass in whatever data you want to send with the event
  try {
    result = await sendDiscordNotification(webhook_url, JSON.stringify(req.headers))
    result = await sendDiscordNotification(webhook_url, JSON.stringify(req.rawHeaders))
    result = await sendDiscordNotification(webhook_url, JSON.stringify(req.body))
    res.status(200).json({ message: 'Graphy Notif has been passed on successfully', data })
    // if (data.contains) 
  } catch (error) {
    console.log(error);
    res.status(error.status).json({ message: error.message });
  }

};

const interaktNotify = async (req, res, next) => {
  // res.status(200).json({ data: 'Notification Received.', notific: req.body });
  // const data = req.params.order_id;
  if(req.body !== null && req.body !== undefined){
    
    
    var result = {};
    var result_discord = {};
    

    // after creating the order, it's the time for creating an event
    // you can pass in whatever data you want to send with the event
    try {
      
      const data = JSON.stringify(req.body);
    
      const dataJ = JSON.parse(data);

      if (dataJ !== null && dataJ !== undefined && 
        dataJ.type !== null && dataJ.type !== undefined && dataJ.type === 'message_received'){

          res.status(200).json({ message: 'User Traits modified and Discord Notif passed.', interaktPayload })

          const now_date_time = new Date();

          var user_reply;
          var reply_id;
          var user_phone_number;
          var user_country_code;
          var first_time_active;
          var last_time_active;
          var last_user_activity;
          var repeat_enquiry;
          var day_3;

          var interaktPayload = {};

          if(dataJ.data !== null && dataJ.data !== undefined){
            
            if(dataJ.data.message !== null && dataJ.data.message !== undefined && 
            dataJ.data.message.message !== null && dataJ.data.message.message !== undefined){
              
              const mess = dataJ.data.message.message;

              if (mess !== null && mess !== undefined && 
                mess.type !== null && mess.type !== undefined){
                  if (mess.type === 'button_reply' &&
                  mess.button_reply !== null && mess.button_reply !== undefined ){
                    user_reply = mess.button_reply.title;
                    reply_id = mess.button_reply.id;
                  } else if (mess.type === 'list_reply' &&
                  mess.list_reply !== null && mess.list_reply !== undefined ){
                    user_reply = mess.list_reply.title;
                    reply_id = mess.list_reply.id;
                  }
              } else {

                function unicodeToChar(text) {
                  return text.replace(/\\u[\dA-F]{4}/gi, 
                         function (match) {
                              return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
                         });
               }
                user_reply = unicodeToChar(mess); 
              }
            }

            if(dataJ.data.customer !== null && dataJ.data.customer !== undefined){

              if(dataJ.data.customer.phone_number !== null && dataJ.data.customer.phone_number !== undefined){
                user_phone_number = dataJ.data.customer.phone_number;
              }
              if(dataJ.data.customer.country_code !== null && dataJ.data.customer.country_code !== undefined){
                user_country_code = dataJ.data.customer.country_code;
              }
              if(user_phone_number === null || user_phone_number === undefined ||
                user_country_code === null || user_country_code === undefined){
                  if(dataJ.data.customer.channel_phone_number !== null && 
                    dataJ.data.customer.channel_phone_number !== undefined){
                      const chphno = dataJ.data.customer.channel_phone_number;
                      user_country_code = chphno.substring(0, 2);
                      user_phone_number = chphno.substring(2);
                  }
              }

              if(dataJ.data.customer.traits !== null && dataJ.data.customer.traits !== undefined){

                // console.log(dataJ.data.customer.traits);
                // console.log(now_date_time);

                if(dataJ.data.customer.traits.first_time_active !== null && dataJ.data.customer.traits.first_time_active !== undefined){
                  first_time_active = new Date(dataJ.data.customer.traits.first_time_active.toString().replace(/\s/g, ""));
                }else{
                  first_time_active = now_date_time;
                }

                if(dataJ.data.customer.traits.last_time_active !== null && dataJ.data.customer.traits.last_time_active !== undefined){
                  last_time_active = new Date(dataJ.data.customer.traits.last_time_active.toString().replace(/\s/g, ""));
                }

                if(dataJ.data.customer.traits.last_user_activity !== null && dataJ.data.customer.traits.last_user_activity !== undefined){
                  last_user_activity = new Date(dataJ.data.customer.traits.last_user_activity.toString().replace(/\s/g, ""));
                }

                if(dataJ.data.customer.traits.repeat_enquiry !== null && dataJ.data.customer.traits.repeat_enquiry !== undefined){
                  repeat_enquiry = dataJ.data.customer.traits.repeat_enquiry;
                }else{
                  repeat_enquiry = "No";
                }

                if(dataJ.data.customer.traits.day_3 !== null && dataJ.data.customer.traits.day_3 !== undefined){
                  day_3 = new Date(dataJ.data.customer.traits.day_3.toString().replace(/\s/g, ""));
                }else{
                  day_3 = now_date_time;
                }

                

              }
            }
          }

          interaktPayload = {
            "phoneNumber": user_phone_number,
            "countryCode": user_country_code,
            "traits": {
              "day_1": user_reply,
              "day_3": day_3,
              "day_4": "",
              "first_time_active": first_time_active,
              "last_time_active": now_date_time,
            }
          };

          console.log(repeat_enquiry);

          if (last_time_active !== null && last_time_active !== undefined &&
                Math.abs(last_time_active.getTime() - now_date_time.getTime())/1000/3600 > 48){
            interaktPayload.traits.repeat_enquiry = "Yes";
            interaktPayload.traits.last_user_activity = now_date_time;
          } else if (!repeat_enquiry.includes('Yes')) {
            interaktPayload.traits.repeat_enquiry = "No";
            interaktPayload.traits.last_user_activity = first_time_active;
          }


        if(user_reply.includes('हिंदी')){
          interaktPayload.traits.Language = "Hindi";
        }else if(user_reply.includes('मराठी')){
          interaktPayload.traits.Language = "Marathi";

        }else if(user_reply.includes('बकरी पालन') ){
          interaktPayload.traits.Goat = "Low Potential";
        }else if(user_reply.includes('1. मुझे खरीदना है') ){
          interaktPayload.traits.Goat = "High Potential";
        }else if(user_reply.includes('DISCOUNT - GF')){
          interaktPayload.traits.Goat = "Medium Potential";
        }else if(user_reply.includes('2. नहीं चाहिए') ){
          interaktPayload.traits.Goat = "Not Interested";
        
        }else if(user_reply.includes('मशरुम खेती') ){
          interaktPayload.traits.Mushroom = "Low Potential";
        }else if(user_reply.includes('- मुझे खरीदना है')|| 
        user_reply.includes('- मला करायचे आहे') ){
          interaktPayload.traits.Mushroom = "High Potential";
        }else if(user_reply.includes('- नहीं चाहिए')  || 
        user_reply.includes('- नाही पाहिजे') ){
          interaktPayload.traits.Mushroom = "Not Interested";
        }else if(user_reply.includes('DISCOUNT - MF')){
          interaktPayload.traits.Mushroom = "Medium Potential";

        }else if(user_reply.includes('कुक्कुटपालन') ){
          interaktPayload.traits.Poultry = "Low Potential";
        }else if(user_reply.includes('o मुझे खरीदना है') ){
          interaktPayload.traits.Poultry = "High Potential";
        }else if(user_reply.includes('o नहीं चाहिए')){
          interaktPayload.traits.Poultry = "Not Interested";
        }else if(user_reply.includes('DISCOUNT - PF')){
          interaktPayload.traits.Poultry = "Medium Potential";

        }else if(user_reply.includes('मुझे बात करनी है')  || 
        user_reply.includes('मला बोलायचे आहे') ){
          interaktPayload.traits.day_2 = "Call";
        }else if(user_reply.includes('ट्रेनिंग नहीं लेनी')){
          interaktPayload.traits.day_2 = "Not Interested";
        }else if(user_reply.includes('हाँ, मुझे चाहिए') || 
        user_reply.includes('o हाँ, मुझे चाहिए') ){
          interaktPayload.traits.day_2 = "High Potential"; 

        }else{
          interaktPayload.traits.day_4 = "No Tag Applied";
        }


        console.log(interaktPayload);


        result = await modifyUserTrait(interakt_url, interaktPayload)
        await sendDiscordNotification(webhook_url, JSON.stringify(interaktPayload))
        await sendDiscordNotification(webhook_url, JSON.stringify(data))
      }else{
        // res.status(200).json({ message: 'Discord Notif has been passed on successfully.', data })
        // const gsres = await testUpdateSpreadSheetValues()
        
        result_discord = await sendDiscordNotification(webhook_url, JSON.stringify(data))

        res.status(200).json({ message: 'Discord Notif has been passed on and sheet updated successfully.', result_discord})
      }
    } catch (error) {
      console.log(error);
      res.status(error.status).json({ message: error.message });
    }
  }
};

const interaktReplaceTrait = async (req, res, next) => {

    const{skip,limit,productIds,dateFrom,dateTo,reqStatus}=req.query||{}
    try {
        // const queryParams={mid,key,limit,productIds,dateFrom,dateTo}
        const response=await activeLearners(skip,limit,productIds,dateFrom,dateTo)
        var status = reqStatus;
        for (const item of response.data) {
           const user_country_code = item.mobile.substring(0, 3);
           const user_phone_number = item.mobile.substring(3);
            // const phoneNumber = item.mobile; // Assuming 'mobile' contains the phone number
          
            if (item.productId.includes('62e36fe30cf25672c5bbf59d')){
              status = "Paid_Mushroom_Hindi"; // 62e36fe30cf25672c5bbf59d
            }else if (item.productId.includes('62e3717e0cf2f463fe3e5563')){
              status = "Paid_Mushroom_Marathi"; // 62e3717e0cf2f463fe3e5563
            }else if (item.productId.includes('635212aee4b068926fe2cc07')){
              status = "Paid_Goat_Hindi"; // 635212aee4b068926fe2cc07
            }else if (item.productId.includes('63d80e46e4b0267b1a50f58c')){
              status = "Paid_Poultry_Marathi"; // 63d80e46e4b0267b1a50f58c
            }else if (item.productId.includes('62b5d5c10cf20c2f5a2d58d6')){
              status = "Paid_Polyhouse_Hindi"; // 62b5d5c10cf20c2f5a2d58d6
            }else if (item.productId.includes('635f8623e4b0713f0149316d')){
              status = "Paid_Lac_Hindi"; // 635f8623e4b0713f0149316d
            }

            const payload = {
              "phoneNumber": user_phone_number,
              "countryCode": user_country_code,
              "traits": {
                "Status": status,
              }
              
            };
          
            try {
              const result = await modifyUserTrait(interakt_url, payload);
              console.log(result);
              console.log("user modified:- "+user_phone_number+" with status "+status+ " and product "+item.productId);
            } catch (error) {
              console.error(error);
            }
          }
          console.log("finished tagging all "+response.total+" users");
          res.status(200).json({ message: 'Traits replaced successfully'});
        
    } catch (error) {
        console.log(error)
    }
};

const interaktModifyStatusTraitOnboarding = async (req, res, next) => {
  
  if(req.body !== null && req.body !== undefined){
    
    
  var result = {};
  
  try {
    
    const data = JSON.stringify(req.body);
  
    const dataJ = JSON.parse(data);

    if (dataJ !== null && dataJ !== undefined){

        var user_phone_number;
        var user_country_code;
        var interaktPayload = {};
        var paid_status;

        if(dataJ !== null && dataJ !== undefined){

            if(dataJ["Learner Mobile"] !== null && dataJ["Learner Mobile"] !== undefined){
              user_country_code = dataJ["Learner Mobile"].substring(0, 3);
              user_phone_number = dataJ["Learner Mobile"].substring(3);
            }else{
              throw new Error('Missing phone number from graphy course enrollment webhook request.');
            }

            if(dataJ["Course Name"] !== null && dataJ["Course Name"] !== undefined){
              
              var courseName = dataJ["Course Name"];
              // var courseLink = dataJ["Course Link"];
              
              if (courseName.includes('ऑयस्टर मशरूम खेती AtoZ Online ट्रैनिंग')){
                paid_status = "Paid_Mushroom_Hindi"; // 62e36fe30cf25672c5bbf59d
              }else if (courseName.includes('ऑयस्टर मशरूम शेती AtoZ Online ट्रैनिंग')){
                paid_status = "Paid_Mushroom_Marathi"; // 62e3717e0cf2f463fe3e5563
              }else if (courseName.includes('No. 1 बकरी पालन Online ट्रेनिंग')){
                paid_status = "Paid_Goat_Hindi"; // 635212aee4b068926fe2cc07
              }else if (courseName.includes('व्यावसायिक कुक्कुटपालन')){
                paid_status = "Paid_Poultry_Marathi"; // 63d80e46e4b0267b1a50f58c
              }else if (courseName.includes('पॉलीहाउस नर्सरी Online ट्रेनिंग')){
                paid_status = "Paid_Polyhouse_Hindi"; // 62b5d5c10cf20c2f5a2d58d6
              }else if (courseName.includes('रंगिनी लाख: तैयारी प्रशिक्षण')){
                paid_status = "Paid_Lac_Hindi"; // 635f8623e4b0713f0149316d
              }

            }
          
        }
      
        interaktPayload = {
          "phoneNumber": user_phone_number,
          "countryCode": user_country_code,
          "traits": {
            "Status": paid_status,
            "day1": new Date()
          }
        };

      result = await modifyUserTrait(interakt_url, interaktPayload)
      console.log(result);
      console.log("user modified:- "+user_phone_number+" with status "+paid_status);
      // await sendDiscordNotification(webhook_url, JSON.stringify(interaktPayload))
      // await sendDiscordNotification(webhook_url, JSON.stringify(data))
      res.status(200).json({ message: 'User Traits modified for onboarding and Discord Notif passed.', interaktPayload })
    }
  } catch (error) {
    console.log(error);
    res.status(error.status).json({ message: error.message });
  }
}
};

module.exports = {
  graphyNotify,
  interaktNotify,
  interaktReplaceTrait,
  interaktModifyStatusTraitOnboarding
};
