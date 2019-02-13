//================================ SELECT SCREEN LOGIC ============================================
var selection1 = "";
var selection2 = "";
var selection3 = "";
var lie = "";
var userDataSet;

var optionsarr1 = [
    "I am a vegetarian",
    "I am a vegan",
    "I have never been outside the US",
    "I like to go camping",
    "I enjoy anime",
    "I prefer movies over TV",
    "I like to play video games",
    "My favorite color is blue",
    "I like to build computers",
    "I enjoy running"
];

var optionsarr2 = [
    "I have been skydiving",
    "I live on my own",
    "I know how to drive a manual transmission",
    "I enjoy lifting weights",
    "I was born outside the US",
    "I like to go hunting",
    "I play World of Warcraft",
    "I like to go to bars",
    "I have never had an alcoholic drink",
    "I enjoy hiking"
];

var optionsarr3 = [
    "I enjoy Javascript more than HTML",
    "I am more interested in front-end design than backend",
    "I prefer writing notes over typing them",
    "I can do my own vehicle maintanence",
    "I have a fear of water",
    "I wear glasses/contacts",
    "I prefer Marvel over DC",
    "I dislike horror movies",
    "I know how to ride a motorcycle"
];


function populateDropdown(){
    for (i = 0; i < optionsarr1.length; i++) {
        a = $("<option value='" + optionsarr1[i] + "'>" + optionsarr1[i] + "</option>");
        $("#option1").append(a);
     }
    for (i = 0; i < optionsarr1.length; i++) {
        b = $("<option value='" + optionsarr2[i] + "'>" + optionsarr2[i] + "</option>");
        $("#option2").append(b);
    }
    for (i = 0; i < optionsarr1.length; i++) {
        c = $("<option value='" + optionsarr3[i] + "'>" + optionsarr3[i] + "</option>");
        $("#option3").append(c);
    }
};


function lieDetector() {
    if ($("#radio1").is(":checked")) {
        lie = selection1;
    }else if ($("#radio2").is(":checked")) {
        lie = selection2;
    }else if ($("#radio3").is(":checked")) {
        lie = selection3;
    }
};

function compileResults() {
    if (selection1 == ""){
        selection1 = optionsarr1[0];
    }

    if (selection2 == ""){
        selection2 = optionsarr2[0];
    }

    if (selection3 == ""){
        selection3 = optionsarr3[0];
    }
    lieDetector();
    userDataSet = {
        first: selection1,
        second: selection2,
        third: selection3,
        lie: lie
    };

};

//============================ ACTUAL GAME LOGIC ==============================================
var firstRandom;
var secondRandom;
var thirdRandom;
var lie;
var card = $(".play-area");
var divId='';
var selectedUser = "";
var options = []

function loadGame() {
    
    selectedUser=  localStorage.getItem("selectedUser");
    console.log(selectedUser)
    db.ref('groupUsers/'+selectedUser+'/True-and-Lie').on("value", function (snap) {
          
        console.log("database reference call:")
        var i =0;
        snap.forEach(function (child) {      
            options[i] = child.val();  
            i++;  
        });    
            firstRandom = options[0];
            secondRandom = options[2];
            thirdRandom = options[3];;
            lie = options[1];
               
       
           $(".begin-game").hide();

           card.append("<labe><input type='radio' name='game-select' id ='radio1' value=" + firstRandom + ">" + firstRandom + "</label><br>");
           card.append("<labe><input type='radio' name='game-select' id ='radio2' value=" + secondRandom + ">" + secondRandom + "</label><br>");
           card.append("<labe><input type='radio' name='game-select' id ='radio3' value=" + thirdRandom + ">" + thirdRandom + "</label><br><br>");
           card.append("<button type='submit' class='btn btn-primary' id='end-game'>Make Selection</button>");
        })
};

// Populate All users
var getUsers=function(){
    db.ref('groupUsers').on("value", function(snap) { 
    // db.ref('groupUsers').orderByChild('group_id').equalTo(groupID).on("value", function (snap) {
     var i=0;
     $("#usersList").empty();    
     snap.forEach(function(child) {
        var name = child.key;
        var cv = child.val();

        divId = name;

        var userObj=$("<div>")
        userObj.addClass("userDiv col-3")
        userObj.css({'display': 'inline-block'})

        //user Iamge
        var selectuserImg = $("<img>");
        selectuserImg.addClass("userPic");
        selectuserImg.attr("src",cv.photoUrl);
        selectuserImg.attr("id",divId);
        selectuserImg.attr("data-image-id",name);
        selectuserImg.css({ 'height': '100px', 'width': '100px' });

        //Header part of the user object
        var userHeader =$("<div>");
        userHeader.addClass("content top");

        //user Name
        var userName=$("<h6>");
        userName.text(cv.displayName);
        userHeader.append(userName);
            
        //Adde to DIV
        userObj.append(userHeader);
        userObj.append(selectuserImg);
        
        //Add to Main Div
        $("#usersList").append(userObj);
            
        i++;
     });
  
    }); 
 
  }
//*********************
//Main Processing Area
//*********************
    populateDropdown();
    setUsersFromCookies();
    console.log("in Game logic");

    $("#option1").change(function(){
        selection1 = this.value;
        // console.log(this.value);
    })
    
    $("#option2").change(function(){
        selection2 = this.value;
        // console.log(this.value);
    })
    
    $("#option3").change(function(){
        selection3 = this.value;
        // console.log(this.value);
    })

    compileResults();
    
    $("#input-submit").click(function(){ 

        compileResults();
        if (lie == ""){
            alert("Please indicated which statement is a lie");
            return;
        }
        $("#input-submit").hide();
        getUsers();
        $("#truthOrLieSubmitBox").hide();
        $("#gameIns").hide();
        $("#gameHeading").text("Select any users to Play !!");
     
        console.log(userDataSet);
     
        console.log("user.userKe",user.userKey);
        db.ref('groupUsers').child(user.userKey).child('True-and-Lie' ).set(userDataSet)
         .then(function (snap) {
             console.log("Success!");
         }, function (err) {
             console.log(err + " error");
         });
    
   
    });

    
      
    
    // on click event to select user to play will redirect to twoTruthsGame
    $(document).on("click",".userPic",function(e){
    
        alert($(this).attr("data-image-id"));
        console.log("image click");
        selectedUser = $(this).attr("data-image-id");
        console.log(selectedUser);
        localStorage.setItem("selectedUser", selectedUser);

        window.location.replace( "../project-1/twoTruthsGame.html");
        

    });
    $(document).on("click","#end-game",function(){
        var userAns = '';
        console.log("end game");
        console.log(firstRandom);
        console.log(secondRandom);
        console.log(thirdRandom);
        console.log(lie);
        if ($("#radio1").is(":checked")) {
            userAns = firstRandom;
        }else if ($("#radio2").is(":checked")) {
            userAns = secondRandom;
        }else if ($("#radio3").is(":checked")) {
            userAns = thirdRandom;
        }
        if (userAns === lie)
        {
            console.log("Correct !!")
        }
    })

