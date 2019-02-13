
  var signIn ="";
  var signInSuccess = "";
  var adminsArr = ["trentdavisinc@gmail.com","chandnibpatel@gmail.com"];

  $(document).ready(function(){
//Check url 
    if(isUserAuthenticated()){
        if (page=="index.html"){
         $("#userLogin").hide();
         $("#userGroupSelect").show();
        
        }
        $(".user-details").show();
        authNav(false);
         
     }
     else{
         console.log("in signup");
         if (page=="index.html"){
         $("#userLogin").show();
         $("#userGroupSelect").hide();
         $(".user-details").hide();
         }
         authNav(false);
     }
  });
//Provider default Google
  var provider = new firebase.auth.GoogleAuthProvider();
   $(document).on("click","#googleLogin",function(){
    signIn=Cookies.getJSON('userDetail');
    if (signIn==null)
    {
      console.log("in signup")
      provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/plus.login');
      webAuth();
    }
    
 })
// Facebook Authentication
 $(document).on("click","#facebookLogin",function(){
  signIn=Cookies.getJSON('userDetail');
    if (signIn==null)
    {   $("#userLogin").show();
        provider = new firebase.auth.FacebookAuthProvider();
        webAuth();
    }
    
 });
// Twitter Auth
 $(document).on("click","#twitterLogin",function(){
  signIn=Cookies.getJSON('userDetail');
    if (signIn==null)
    {   $("#userLogin").show();
      provider = new firebase.auth.TwitterAuthProvider();
      webAuth();
    }
    
 });

function webAuth() {
    if (!firebase.auth().currentUser) {
      // [START createprovider]
      // [END addscopes]
      // [START signin]
      firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        var userAdditionInfo=result.additionalUserInfo
        //For Twitter we are going to use username as ID
        if(user.providerData[0].providerId=="twitter.com")
        {
          user.providerData[0].userAuthId=userAdditionInfo.username;
        }
        else
        {
          user.providerData[0].userAuthId= user.providerData[0].email
      
        }
        // The signed-in user info.
        var date = new Date();
        var minutes = 30;
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        Cookies.set("userDetail", JSON.stringify(user), { expires: date });
       //Cookies.set Cookies.set('userDetail', JSON.stringify(user))
        // [START_EXCLUDE]
        console.log("user :", user);
        signInSuccess = "true";
        addGroupUser(true);
        authNav(true);
        // [END_EXCLUDE]
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential; 
        signInSuccess = "false";
        // [START_EXCLUDE]
        if (errorCode === 'auth/account-exists-with-different-credential') {
          alert("You have already signed up with a different auth provider for that email.");
          // If you are using multiple auth providers on your app you should handle linking
          // the user's accounts here.
        }
    else if (errorCode === 'auth/auth-domain-config-required') {
      alert("An auth domain configuration is required"); 
        }
        else if (errorCode === 'auth/cancelled-popup-request') {
            alert("Popup sign in was canceled");
        }
        else if (errorCode === 'auth/operation-not-allowed') {
            alert("Operation is not allowed");
        }
        else if (errorCode === 'auth/operation-not-supported-in-this-environment') {
            alert("Operation is not supported in this environment");
        }
        else if (errorCode === 'auth/popup-blocked') {
            alert("Sign in popup got blocked");
        }
        else if (errorCode === 'auth/popup-closed-by-user') {
            alert("The sign in popup got cancelled");
        }
        else if (errorCode === 'auth/unauthorized-domain') {
            alert("Unauthorized domain");
        }
         else {
          console.error(error);
        }
        // [END_EXCLUDE]
      });
      // [END signin]
    } else {
      // [START signout]
      firebase.auth().signOut();
      // [END signout]
    }
  
  }
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  });

function authNav(isFreshLogin){
    console.log("In AuthNav");
    var isCookie= setUsersFromCookies();
     if (isCookie==false) 
     {
          if (page=="index.html"){
            $("#userLogin").show();
            $("#userGroupSelect").hide();
            $(".user-details").hide();
        }
        else
        {
            window.location.replace( "../project-1/index.html");
        }
     }
     else {
       var isUserAdmin = signIn.providerData[0].userAuthId;
       console.log(isUserAdmin);
       if (adminsArr.indexOf(isUserAdmin) != -1)
       {
         console.log("signIn.providerData[0].userAuthId", signIn.providerData[0].userAuthId);
        if (page=="index.html" && isFreshLogin)
         window.location.replace( "../project-1/continueAs.html");
       }
       else{
         $("#userLogin").hide();
         $("#userGroupSelect").show();
         $(".user-details").show();
       }
     }
    }
 
 