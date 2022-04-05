var axios = require('axios');
var qs = require('qs');

class GmailApi {

  accessToken="";
  constructor(){
    this.accessToken=this.getAccesstoken();
  }
    getAccesstoken = async()=>{
        var data = qs.stringify({
            'client_id': '995058308001-utcq87eos3jabbvpadhk4pfg8hkk8gd3.apps.googleusercontent.com',
            'client_secret': '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',
            'refresh_token': '1//0gBgEPxVA6HNlCgYIARAAGBASNwF-L9IrrtUYTHd5NcRZEVHw2DOUan2mtl9eloON8WG4yTE4Glc3vi53e_B8qUdx63QSMtgVTkc',
            'grant_type': 'refresh_token' 
          });
          var config = {
            method: 'post',
            url: 'https://accounts.google.com/o/oauth2/token',
            headers: { 
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
          };
          
          
          var accessToken = "";
          await axios(config)
          .then(async function (response) {
            console.log(JSON.stringify(response.data));
             accessToken = await response.data.access_token;
            console.log("access token:-",accessToken);
          })
          .catch(function (error) {
            console.log(error);
          });
          return accessToken;
    }
    searchGmail = async(searchItem)=>{
      var config1 = {
        method: 'get',
        url: 'https://gmail.googleapis.com/gmail/v1/users/me/messages?q='+searchItem,
        headers: { 
            Authorization:`Bearer ${await this.accessToken}`
        }
      };
      
    
    var threadid = "";
      await axios(config1)
      .then(async function (response) {
        console.log("search result, -->",JSON.stringify(response.data));
        threadid = await response.data["messages"][0].id;
        console.log("threadid-->",threadid)
      })
      .catch(function (error) {
        console.log(error);
      });
      return threadid;
    }



    readGmailContent = async (messageId)=>{
var axios = require('axios');

var config = {
  method: 'get',
  url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
  headers: {
    Authorization:`Bearer ${await this.accessToken}`
   }
};
var data = {};

await axios(config)
.then(async function (response) {
  
  data = await response.data;
  console.log(JSON.stringify(data));
})
.catch(function (error) {
  console.log(error);
});

return data;
    }


    readInboxContent = async (searchText)=>{
 const threadId = await this.searchGmail(searchText);
 const message = await this.readGmailContent(threadId);
  const encodedMessage = await  message.payload["parts"][0].body.data;
  const decodedStr = Buffer.from(encodedMessage,"base64").toString("ascii");
  console.log("decoded str --->",decodedStr)
  return decodedStr; 
    }
}

module.exports = new GmailApi();