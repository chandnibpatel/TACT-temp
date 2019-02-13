//Initialize Firebase
var db = firebase.database();
var signIn;
var signInSuccess = "";
// add new group modal functions 
var group={
  id:'',
  name:'',
  desc:'',
  Createdby:'',
  createdOn:'',
  questions:[],
  groupUser:[],
  
}
var question={
  qId:'',
  qText:'',
 }

 //Group Users
 var groupUser={
   id:'',
  name:'',
  emaidId:'',
  photoURL:'',
  userQuestions:[],
  userPlayedHistories:[]
 }
var userQuestion={
  qText:'',
  qAnswer:''
}
 var userPlayedHistory={
   playerEmailId:'',
   Name:'',
   score:''
 }



var addGroup =function(name,desc){
  console.log(name);
  var myRef = db.ref().push();
  var key = myRef.key;
  var data = { 
          group_id: key,                                 
          group_long_desc : desc,
          createdBy : user.emailId,
          createdOn : firebase.database.ServerValue.TIMESTAMP                  
             
  };
  db.ref('groups').child(name).set(data)
      .then(function (snap) {
          console.log("Success!");
      }, function (err) {
          console.log(err + " error");
      });

}
function isUserAuthenticated(){
    setUsersFromCookies()
     if(signIn==null || typeof signIn === "undefined"){
       return false;
     }
     else{
         return true;
     }
}

 var user={
   userKey:'',
 displayName:'',
  emailId:'',
  photoUrl:'',
  userAuthId:''
  
}

function setUsersFromCookies(){
  console.log("in SetUsersFromCookies")
  signIn=Cookies.getJSON('userDetail');

 if(signIn===null || typeof signIn === "undefined"){
   return false;
 }
 else{
 
 
 user.displayName=signIn.displayName;
 user.emailId=signIn.email;
 user.photoUrl=signIn.photoURL;
 user.userAuthId=signIn.providerData[0].userAuthId;
 var replaceSymb= user.userAuthId.replace("@", "-");
 var replaceSymb = replaceSymb.replace(".", "");
 var userKey = replaceSymb.replace(".", "");
 user.userKey = userKey;

 $("#userProfileName").text(user.displayName);
 $("#userProfilePic").attr("src",user.photoUrl);
}

return true;
}

//Add Users

var addGroupUser=function(){
    if (setUsersFromCookies())
    {
     var myRef = db.ref().push();
     var key = myRef.key;
     
     var replaceSymb= user.userAuthId.replace("@", "-");
     var replaceSymb = replaceSymb.replace(".", "");
     var userKey = replaceSymb.replace(".", "");
     console.log("userKey", userKey);

     var userData={
      displayName:user.displayName,
      emailId:user.emailId,
      photoUrl:user.photoUrl,
     userAuthId: userKey
    }
    db.ref('groupUsers').child(userKey).set(userData)
         .then(function (snap) {
             console.log("Success!");
         }, function (err) {
             console.log(err + " error");
         });
    
     }
   }

 // Populate All Groups
 var getGroups=function(){
   db.ref('groups').on("value", function(snap) { 
    var i=0;
    $("#myUserGroups").empty();    
    snap.forEach(function(child) {
         var name = child.key;
        var cv = child.val();
          //  console.log(cv.group_id);
    var groupHtml="<div id='group"+ i + "' class='user-group' data-group-id='"+ cv.group_id +"'>";
    groupHtml+="<img src='https://avatars3.githubusercontent.com/u/17503864?s=70&v=4'>";
    groupHtml+="<span>"+ name+ "</span></div>";
    $("#myUserGroups").append(groupHtml);
    i++;
 });
 
 }); 

 }








 