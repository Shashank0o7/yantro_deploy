var express                   = require("express"),
    app                       = express(),
    bodyParser                = require("body-parser"),
    nodemailer                = require("nodemailer"),
    mongoose                  = require("mongoose"),
	  flash                     = require("connect-flash"),
	  passport                  = require("passport"),
	  bodyParser                = require("body-parser"),
	  LocalStrategy             = require("passport-local"),
    passportLocalMongoose     = require("passport-local-mongoose"), 
    methodOverride            = require("method-override"),   
    User                      = require("./models/user"),
    Message                   = require("./models/message"),
    Course                    = require("./models/courses"),
    Subject                   = require("./models/subject"),
    Chapters                  = require("./models/chapter"),
    Videos                    = require("./models/video"),
    Test                      = require("./models/test"),
    Question                  = require("./models/question"),
    Doubt                     = require("./models/doubt"),
    Yantro                    = require("./models/yantro"),
    Trans                    = require("./models/transaction_confirmation"),
    Answer                    = require("./models/answer"),
    Cart                      = require("./models/cart"),
    TT                        = require("./models/testtaken"),
    Notification              = require("./models/notification");
    cloudinary                = require('cloudinary').v2,
    path                      = require("path");
    var foundTest;
    var tt_id;
    var otp1;


    app.set("view engine","ejs");
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.static(`${__dirname}/public`));
    app.use(methodOverride("_method"));


    //========Mongoose Connection=========

    

    
    // mongoose.connect("mongodb://localhost:27017/yantromitra2",{useUnifiedTopology: true, useNewUrlParser: true}).then(()=>{
    //   console.log('connected to db');
    // }).catch(err=>{
    //     console.log('error'.err.message); });;
    // mongoose.set('useFindAndModify', false);
    // mongoose.set('useCreateIndex', true);

//     mongoose.connect("mongodb+srv://vansh7:Password12$@yantromitra-hkvgy.mongodb.net/test?retryWrites=true&w=majority",{useUnifiedTopology: true, useNewUrlParser: true});
//     //mongoose.connect("mongodb://localhost/yantromitra",{useUnifiedTopology: true, useNewUrlParser: true});
//     mongoose.set('useFindAndModify', false);
//     mongoose.set('useCreateIndex', true);
// >>>>>>> d5ae9928f9244383b8bfa95e22fe841c5268baa5
    //=====================================
    mongoose.connect('mongodb://yantro:U6ejeyK5GlM0DSlBDv29GSc0IvJpwG4DlCR8mvpUi47UpUbclTPwAu4BykQ2hJ5htsHmBnmDXdeMdUNqNu2Dsw==@yantro.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@yantro@',{
	useNewUrlParser:true, 
	useCreateIndex:true,
	useUnifiedTopology:true
}).then(()=>{
	console.log('connected to db');
}).catch(err=>{
	console.log('error'.err.message);
});


// mongoose.connect(process.env.mongoURL,{
// 	useNewUrlParser:true, 
// 	useCreateIndex:true,

// 	useUnifiedTopology:true
// }).then(()=>{
// 	console.log('connected to db');
// }).catch(err=>{
// 	console.log('error'.err.message);
// });



    app.use(require("express-session")({
      secret: "Blah Blah",
      resave: false,
      saveUninitialized: false
    }));

    //========Passport Configuration========
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    //========================================

    //========= flash message ==========
     app.use(flash());

     app.use(function(req, res, next){
      res.locals.currentUser = req.user;
      res.locals.error = req.flash("error");
      res.locals.success = req.flash("success");
      next();
    });


    //=================================
    //=======IMAGE CODE UPLOADS========
    //=================================

    var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})


cloudinary.config({ 
  cloud_name: 'ddlxlne6k', 
  api_key: '773777794947995', 
  api_secret: '8vOPCNy496bfbxWAOxBh6jauPE4'
});

//======================================
 //=======student dashboard========
 //======================================

app.get("/student_dashboard",function(req,res){
  var aassad=String("studentdash")
  console.log(req.user._id)
    res.render("parag/studentdash",{id:req.user._id});    
})
 app.get("/show_cart",function(req,res){
   Cart.findOne({user_id:req.user._id},function(err,result){
    // res.render("parag/cart",{cart:result})
    if(result){
      console.log("testing 123.......")
      console.log(result);
      res.render("parag/cart",{cart:result});
      }
      else{
        // res.render("error")
        res.send("YOU NEED TO ADD SOMETHING TO YOUR CART")
      }
   })
 })

// app.get("/your_final_courses",function(req,res){
//   Trans.findOne({user_id:req.user._id},function(err,result){
//     Cart.findOne({user_id:req.user._id},function(err,result1){
//     res.render("parag/coursesforyou",{course:result,cart:result1._id});
//     })
//   })
// })




app.get("/your_final_courses",function(req,res){
  if(String(req.user.isSchoolAdmin)==="true"||String(req.user.isAdmin)==="true"){
    console.log(req.body.userid);
    Trans.findOne({user_id:req.body.userid},function(err,result){
      // if(result){
      // console.log("testing 123.......")
      // console.log(result);
      res.render("parag/coursesforyou",{course:result});
      // }
      // else{
      //   res.render("error")
      // }
    })
  }
  else{
  Trans.findOne({user_id:req.user._id},function(err,result){
    if(result){
      res.render("parag/coursesforyou",{course:result});
      }
      else{
        res.send("YOU NEED TO BUY SOME COURSE TO GET YOUR DASHBOARD")
      }
    })
  }
  })


// i need to create get as well as post route for your_final_courses



app.post("/your_final_courses",function(req,res){
  if(String(req.user.isSchoolAdmin)==="true"||String(req.user.isAdmin)==="true"){
    console.log(req.body.userid);
    Trans.findOne({user_id:req.body.userid},function(err,result){
      // res.render("parag/coursesforyou",{course:result});
      if(result){
        console.log("testing 123.......")
        console.log(result);
        res.render("parag/coursesforyou",{course:result});
        }
        else{
          res.render("error")
        }
    })
  }
  else{
  Trans.findOne({user_id:req.user._id},function(err,result){
    if(result){
    res.render("parag/coursesforyou",{course:result});
    }
    else{
      res.send("YOU NEED TO BUY SOME COURSE TO GET YOUR DASHBOARD")
    }
    })
  }
  })


app.get("/course_by_yantro",function(req,res){
  Course.find({school_name:"none"}).populate("subjects").exec(function(err,foundYantroCourses){
    res.render("course_for_you_from_yantro",{yantroCourse:foundYantroCourses,message:req.flash("error")})
  })
})

//_____________________________________
// changes for courses
//_____________________________________
app.get("/go_to_nimcet",function(req,res){
  // Course.find({school_name:school_temp,classcode:class_temp}).populate("subjects").exec(function(err,foundCourses){
    Course.find({school_name:"none"}).populate("subjects").exec(function(err,foundYantroCourses){
    console.log(foundYantroCourses)
    Course.find({ school_name:"none","name": { "$regex": "Bank", "$options": "i" } }, function(err,docs) { 
      console.log("just testing ",docs);
    // res.render("parag/coursesforyou",{course:result});
    res.render("nimcet.ejs");
    } 
      );
    // res.render("course_for_you",{yantroCourse:foundYantroCourses,message:req.flash("error")})
    })
  // })
})




app.get("/go_to_cmat",function(req,res){
  // Course.find({school_name:school_temp,classcode:class_temp}).populate("subjects").exec(function(err,foundCourses){
    Course.find({school_name:"none"}).populate("subjects").exec(function(err,foundYantroCourses){
    console.log(foundYantroCourses)
    Course.find({ school_name:"none","name": { "$regex": "Bank", "$options": "i" } }, function(err,docs) { 
      console.log("just testing ",docs);
    // res.render("parag/coursesforyou",{course:result});
    res.render("cmat.ejs");
    } 
      );
    // res.render("course_for_you",{yantroCourse:foundYantroCourses,message:req.flash("error")})
    })
  // })
})



app.get("/go_to_crt",function(req,res){
  // Course.find({school_name:school_temp,classcode:class_temp}).populate("subjects").exec(function(err,foundCourses){
    Course.find({school_name:"none"}).populate("subjects").exec(function(err,foundYantroCourses){
    console.log(foundYantroCourses)
    Course.find({ school_name:"none","name": { "$regex": "Bank", "$options": "i" } }, function(err,docs) { 
      console.log("just testing ",docs);
    // res.render("parag/coursesforyou",{course:result});
    res.render("crt.ejs");
    } 
      );
    // res.render("course_for_you",{yantroCourse:foundYantroCourses,message:req.flash("error")})
    })
  // })
})



app.get("/go_to_bank",function(req,res){
  // Course.find({school_name:school_temp,classcode:class_temp}).populate("subjects").exec(function(err,foundCourses){
    Course.find({school_name:"none"}).populate("subjects").exec(function(err,foundYantroCourses){
    console.log(foundYantroCourses)
    Course.find({ school_name:"none","name": { "$regex": "Bank", "$options": "i" } }, function(err,docs) { 
      console.log("just testing ",docs);
    // res.render("parag/coursesforyou",{course:result});
    res.render("bank.ejs");
    } 
      );
    // res.render("course_for_you",{yantroCourse:foundYantroCourses,message:req.flash("error")})
    })
  // })
})





app.get("/go_to_clat",function(req,res){
    // Course.find({school_name:school_temp,classcode:class_temp}).populate("subjects").exec(function(err,foundCourses){
      Course.find({school_name:"none"}).populate("subjects").exec(function(err,foundYantroCourses){
      console.log(foundYantroCourses)
      Course.find({ school_name:"none","name": { "$regex": "Bank", "$options": "i" } }, function(err,docs) { 
        console.log("just testing ",docs);
      // res.render("parag/coursesforyou",{course:result});
      res.render("clat.ejs");
      } 
        );
      // res.render("course_for_you",{yantroCourse:foundYantroCourses,message:req.flash("error")})
      })
    // })
})

app.post("/details_of_individualcourse",function(req,res){
var course=req.body.course_name;
console.log("course name",course)
Course.findOne({name:course},function(err,foundCourse){
  //Course.find({"name": { "$regex": course, "$options": "i" } }, function(err,docs) { 
  // console.log("just testing2 ",docs);
  // temp_course=docs[0]._id;
  // console.log(foundCourse);
  // temp_course=foundCourse._id;
  // res.json(foundCourse);
  // console.log(temp_course);
  // res.render("detail_page",{temp_course:temp_course});
  // res.redirect("/course/"+temp_course);
  if(foundCourse){
  console.log(foundCourse)
  temp_course=foundCourse._id;
console.log("hi 123",temp_course);
res.render(""+course,{temp_course:temp_course});
  }
  else{
    res.send("THIS IS AN UPCOMING COURSE. PLEASE WAIT FEW DAYS....")
  }
})
})









//======================================
 //=======dteails of course========
 //======================================

app.get("/particular_course_detail",function(req,res){
    Course.findById(temp_course).populate("subjects").populate("chapters").populate("videos").exec(function(err,result){
      // Course.findById(temp_course).populate({path:'Course',populate:}).exec(function(err,result){
        res.render("particular_course_detail",{result:result});
    })
})







 //======================================
 //=======IMAGE CODE UPLOADS Ends========
 //======================================


// courses for you

app.get("/course_for_u",function(req,res){
  Course.find({school_name:school_temp}).populate("subjects").exec(function(err,foundCourses){
    Course.find({school_name:"none"}).populate("subjects").exec(function(err,foundYantroCourses){
    console.log("course of particular class and school")
    console.log(foundCourses.subjects)
    console.log(foundYantroCourses)
    res.render("course_for_you",{course:foundCourses,yantroCourse:foundYantroCourses,message:req.flash("error")})
    })
  })
})

// CART OPERATION
app.post("/add_to_cart",isLoggedIn,function(req,res){
  var code=req.body.course_code;
  var c_name=req.body.course_name;
  var amount=req.body.course_price;
  var username=req.user.username;
  var userid=req.user._id;
  console.log("getting things done for cart")
  console.log(code,c_name,username,userid)
  // var amount=1050;
  Cart.findOne({user_id:userid}).exec(function(err,result){
    if(err)
    {
      console.log(err)
    }
    else if(result)
    {
      console.log("found")
        var temp_amount=Number(amount)+Number(result.total_amount);
        result.code.push(req.body.course_code)
        result.c_name.push(req.body.course_name)
        result.amount.push(amount)
        result.total_amount=(temp_amount)
        result.save();
        console.log(result)
        // res.json(result)
        // res.render("show_cart",{username:username,code:code,c_name:c_name,amount:amount,total_amount:temp_amount});
        Cart.countDocuments({},function(err,result2){
          res.render("parag/cart",{cart:result,count:result2,name:req.user.username,phone:req.user.phone})  
        })
        
    }
    else{
      var new_entry={code:code,c_name:c_name,username:username,user_id:userid,amount:amount,total_amount:amount}
      Cart.create({code:code,c_name:c_name,username:username,user_id:userid,amount:amount,total_amount:amount},function(err,newEntry){
        if(err)
        console.log(err)
        else
        {
          console.log("newEntry")
          // res.send("cart updated");
          res.render("parag/cart",{cart:newEntry,name:req.user.username,phone:req.user.phone}) 
        }
      })
    }
  })
})


app.post("/cart_delete",isLoggedIn,function(req,res){
  console.log("ready to delete")
  // Cart.findByIdAndUpdate(req.body.cart_id,{$pull:{code:req.params.code}},function(err,foundCart){
    
  // // })
	// // Cart.code.pull(req.params.code,function(err){
    Cart.findByIdAndDelete(req.body.cart_id,function(err,foundCart){
		if(err)
			res.redirect("back");
    else
    {
      foundCart.save();
      res.redirect("/student_dashboard")
    }
	});
});


// app.post("/details_of_course",function(req,res){
//       var course=req.body.course_code;
//       Course.findOne({code:course},function(err,foundCourse){
//         temp_course=foundCourse._id;
//         // res.json(foundCourse);
//         res.render("detail_page");
//       })
// })

app.post("/details_of_course",function(req,res){
  var course=req.body.course_code;
  console.log("testing last",course)
  Course.findOne({code:course},function(err,foundCourse){
    if(foundCourse){
    temp_course=foundCourse._id;
      console.log("testing las",temp_course)
    res.render(""+foundCourse.name,{temp_course:temp_course});
    }
    else{
      res.send("NO SUCH COURSE EXISTS CHECK THE NAME PROPERLY");
    }
    // console.log(temp_course);
    // res.render("detail_page",{temp_course:temp_course});
  })
})





// routes to fetch particular test from detail_page
// app.get("/",function(req,res){
//   Course.findById(temp_course).populate("subjects").exec(function(err,foundcourse){
//     res.redirect("/showtestforcourse/"+temp_course+"/subject/"+)
//   })
// })



global.school_temp="abc";
global.class_temp="abc2";
var temp_course;
var status_for_video="false";
var mail;
var temp_array=Array();

    app.get('/', function(req, res) {

      Course.find({},function(err,course){
        if(err)
        {
          console.log(err);
          res.render("error.ejs");
        }
        else
        {
          Notification.find({},function(err,not){
            if(err)
            {
              console.log(err);
              res.redirect("back");
            }
            else{
              res.render("parag/index1",{course:course,not:not});
            }
          });
        }
      });
    
     });



//newly // working properly // use it for user panel
app.get('/new',function(req, res) {

  User.findById({_id:req.user._id},function(err,result){
    if(err)
    console.log(err)
    else{
      var school_name=result.school;
      school_temp=result.school;
      class_temp=result.education;
      console.log(school_temp);
      Course.find({school_name:result.school},function(err,foundcourse){
        if(err)
        {
          console.log(err);
          res.render("error.ejs");
        }
        else
        {
          Notification.find({},function(err,not){
            if(err)
            {
              console.log(err);
              res.redirect("back");
            }
            else{
              console.log(foundcourse);
              res.render("parag/index1",{course:foundcourse,not:not});
              }
          });
        }
      });
    
     
    }
  })
});





     //===============================================
     //===========TEST Routes=========================
     //===============================================
     app.get("/showforuser/:user_id",isLoggedIn,function(req,res){
       User.findById(req.params.user_id).populate("testtakens").exec(function(err,user){
         if(err)
         {
           console.log(err);
           res.render("error");
         }
         else
         {
         // console.log(user);
          //console.log("dbvvvvvvvvvvvvvvvvvvvv"+user.testtaken);
          user.testtaken.forEach(function(t){
            console.log(t.test.for);
          })
           res.render("admin/showtaken",{user:user});
           
         }
       })
     })

     app.get("/showtestforcourse/:course_id/subject/:id",isLoggedIn,function(req,res){ //important point

      Subject.find({"detail.id":req.body.course_id},function(err,sub){
        if(status_for_video==="true"){
          
       Test.find({"detail.subject_id":req.params.id},function(err,test){

        if(err){
          console.log(err);
          res.render("error");
        }
        else{
          Subject.findById(req.params.id,function(err,subject){

        res.render("courses/showtest",{test:test,sub:sub,subject:subject});
          });
        }
       });
      }
      else{
        Test.find({"detail.subject_id":req.params.id,test_type:"free"},function(err,test){

          if(err){
            console.log(err);
            res.render("error");
          }
          else{
            Subject.findById(req.params.id,function(err,subject){
  
          res.render("courses/showtest",{test:test,sub:sub,subject:subject});
            });
          }
         });
      }
      });
     });
     //showing test;
     var id;
     app.get("/subject/test/:id",function(req,res){
      /// console.log("here")

       Test.findById(req.params.id).populate("questions").exec(function(err,test)
       {
         if(err)
         {
           console.log(err);
           res.render("error");
         }
         else{
           id=req.params.id;
          // console.log(test);
           foundTest=test;
           res.redirect("/showpage");
         }

        });
     });

     app.get("/showpage",isLoggedIn,function(req,res){
       let flag=0;
      Test.findById(id,function(err,test)
      {
          User.findById(req.user._id,function(err,user){

            user.testtaken.forEach(function(t){
              if(t.test._id == id)
              {
               // flag=1;
                console.log("found");
              }
            });
            if(flag==0){
              res.render("test/testpage",{test:test});
              }
              else
              {
                req.flash("success","You have already given this test!")
                res.redirect("/solutions/"+id);
              }

          });
      });
    });
     

     //fetch
     app.get("/gettestdata",function(req,res)
     {
       console.log("here i found "+foundTest)
      res.send(JSON.stringify(foundTest));
     })

     /////===============================
     app.post("/savescorefortest/:test_id/user/:user_id",function(req,res)
     {
       var score=req.body.score;
       User.findById(req.params.user_id,function(err,user){
         if(err)
         {
           console.log(err);
           res.render("error");
         }
         else{
           Test.findById(req.params.test_id,function(err,test){

            var obj={
              test:req.params.test_id,
              title:test.title,
              score:score,
              fullmarks:req.body.fullmarks,
              percentage:req.body.percentage
            };
            user.testtaken.push(obj);
            user.save();
            console.log("user is "+user);
            //res.redirect("back");

           });           
         }
       })

     });

     //show solutions

     app.get("/solutions/:test_id",isLoggedIn,function(req,res)
     {
       Test.findById(req.params.test_id).populate("questions").exec(function(err,test){
         if(err)
         {
           console.log(err);
           res.render("error");
         }
         else
         {
           res.render("test/showsolutions",{test:test});
         }
       });
     });

     app.get("/showsolutionfor/:test_id/number/:no",isLoggedIn,function(req,res){

      var num=Number(req.params.no);
      console.log(num+1);
      Test.findById(req.params.test_id).populate("questions").exec(function(err,test){
        console.log("test is "+test);
        if(err)
        {
          console.log(err);
          res.render("error");
        }
        else
        {
          var len=test.questions.length;
          var ques=test.questions[num];
          console.log("ques is "+ques);
          if(num<len && num>-1){
            res.render("test/showsolutions2",{test:test,ques:ques,num:num});
          }
        }
      });
     });

     app.get("/choose_subject_for_test",function(req,res){
      Course.findById(temp_course).populate("subjects").exec(function(err,result){
         res.render("choose_subject_for_test",{result:result})
       })
     })







     //=================================
     //========notification route=======
     //=================================

     app.get("/createnotification",function(req,res)
     {
      //  res.render("admin/not");
      res.render("parag/createnotification")
     });

     app.post("/createnotification",function(req,res)
     {
       Notification.create(req.body.not,function(err,not){
         if(err)
         {
           console.log(err);
         }
         else{
           req.flash("success","Notification created!");
           res.redirect("back")
         }
       })
     });

     app.delete("/not/:id",function(req,res){
       Notification.findByIdAndRemove(req.params.id,function(err,not){
         if(err)
         {
           console.log(err);
           res.redirect("back");
         }
         else{
          req.flash("success","Notification deleted!");
          res.redirect("back")
         }

       });
     });


     app.get("/registeradmin",function(req,res){

      res.render("admin/registeradmin");
     });

     app.get("/school",function(req,res){

      res.render("admin/school");
     });


app.get("/course/:id",isLoggedIn,function(req,res){
  
  Course.find({},function(err,c){
  Course.findById(req.params.id).populate("subjects").exec(function(err,course)
  {
    if(err)
    {
      console.log(err);
      res.render("error");}
    
    else if(course)
    {
        Trans.findOne({user_id:req.user._id},function(err,result){
          console.log("getting detail abt status_for videos")
          console.log(result)
            if(result){
              for(var x of result.course_code)
              {
                // console.log("check 123 loading .....................")
                if(x===course.code)
                {
                  status_for_video="true";
                  // console.log("loading .....................")
                  console.log(x)  
                  break;
                }
                else{
                  // console.log("else loading2.......................")
                  status_for_video="false"
                }
              }
            }
          else{
            console.log("loading2.......................")
            status_for_video="false"
          }
        })
        // res.render("courses/subjects",{course:course,c:c});
        res.render("courses/subjects",{course:course});
    }
  });
});
});

app.get("/course/:id/subject/:subject_id",function(req,res){
  if(status_for_video==="true"){
  Subject.find({"detail.id":req.params.id},function(err,sub){
  Subject.findById(req.params.subject_id).populate("chapters").exec(function(err,subject)
  {
    if(err)
    {
      console.log(err);
      res.render("error");
    }
    else
    {
        
      res.render("courses/chapters",{subject:subject,sub:sub});
    }
  });

});
  }
  else{
    res.send("u r not allowed to this page first you need to make payment");
  }
});



//for showing videos
app.get("/subject/:subject_id/chapter/:id",isLoggedIn,function(req,res){
// jlklk
  Chapters.find({"detail.id":req.params.subject_id},function(err,chapter){
    console.log(chapter);
  Chapters.findById(req.params.id).populate("videos").exec(function(err,chap)
  {
    if(err)
    {
      console.log(err);
      res.render("error");
    }
    else
    {
      res.render("courses/videos",{chap:chap,chapter:chapter});
    }
  });
});
});

//show test for a particular subject


  app.get("/register",function(req,res){

     res.render("preregister",{message:req.flash("error")});

    Course.find({},function(err,course){
      if(err)
      {
        console.log(err);
      }
      else
      {
        res.render("register",{message:req.flash("error"),course:course});
      }
    });     

   });

//===========Admin===========

app.get("/admin",isSubAdmin,function(req,res){
  if(req.user.school==="none"||req.user.school===[])
  {
    User.find({},function(err,users){
      if(err)
      {
        console.log(err);
        res.render("error.ejs");
      }
      else
      {
        //changes after parag file
        // User.findOne({username:req.user.username},function(err,users1){
        //   if(err)
        //    console.log("not happening")
        //      console.log("csvtdrtd rtbstr gerre",users1)
            // res.render("admin/admin",{users:users,users1:users1});
        // })
        // res.render("admin/admin",{users:users});
        // Trans.findOne({user_id:user})
      
        res.render("parag/registeruser",{users:users});
      } 
    })
  }
  else
  {
  User.find({school:req.user.school},function(err,users){
    if(err)
    {
      console.log(err);
      res.render("error.ejs");
    }
    else
    {
      // res.render("admin/admin",{users:users});
          res.render("parag/registeruser",{users:users});
    } 
  });
}
});
//====================================
//===============School Admin=========
//====================================
app.get("/schooladmin",isSubAdmin,function(req,res){
  User.find({school:req.user.school},function(err,users){
    if(err)
    {
      console.log(err);
      res.render("error.ejs");
    }
    else
    { 
      User.findOne({username:req.user.username},function(err,users1){
        if(err)
         console.log("not happening")
           console.log("csvtdrtd rtbstr gerre",users1)
          // res.render("admin/admin",{users:users,users1:users1});
          
            Message.find({school_name:req.user.school},function(err,message){ 
              res.render("parag/admindashboard",{message:message});
            });
          
          // res.render("parag/admindashboard",{users:users,users1:users1})
      })
    } 

  // Doubt.find({},function(err,doubt){
  //   if(err)
  //   {
  //     console.log(err);
  //     res.render("error.ejs");
  //   }
  //   else
  //   {
  //         res.render("admin/schooladmin",{doubt:doubt});
  //   } 
  });
});

app.get("/admin/message",function(req,res){
  User.findById({_id:req.user._id},function(err,foundUser){
    console.log(foundUser.school);
    if(foundUser.school==="none"){
      Message.find({},function(err,message){ 
        res.render("admin/admin1",{message:message});
      });
    }
    else 
  {
    console.log(foundUser.school);
    Message.find({school_name:foundUser.school},function(err,message){ 
      res.render("admin/admin1",{message:message});
    });
  }
  
  })
  
});



//=========Register User=============

app.post("/preregister",function(req,res){
  var email1=req.body.email;
  
  myFunction();
  function myFunction() {
   otp1 = Math.floor((Math.random() * 10000) + 1);
    // document.getElementById("demo").innerHTML = otp1;
  }
  var output=`<li>Your otp: ${otp1}</li><br>`;
      //  mail=String(user.username);
      // console.log(mail);
      sending1(output,"OTP:-",email1);
      // req.flash("success","Welcome to YantroMitra "+user.name);
      console.log(email1);
  function sending1(output,subject,email)
{
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'friendstwo631@gmail.com',
      pass: 'yteeoskpnbbgqhru' // naturally, replace both with your real credentials or an application-specific password
    }
    });
    console.log(email)
    var e=email;
    const mailOptions = {
    from: 'friendstwo631@gmail.com',
    to: e,
    subject: subject,
    html: output
    };
    
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
    console.log("error is that ",error);
    } else {
      console.log('Email sent: ' + info.response);
    }
    });
}
res.render("register",{message:req.flash("error")});
})











app.post("/register",function(req,res){
  //console.log(req.body);
  if(req.body.otp===String(otp1)){
  // var det={username:req.body.username,name:req.body.name,phone:req.body.phone,education:req.body.education,city:req.body.area,state:req.body.state};
 // console.log(det);
 var pass=req.body.password;// newly school added
  // User.register({username:req.body.username,name:req.body.name,code:req.body.code,admis_no:req.body.admis_no,school:req.body.school,phone:req.body.phone,education:req.body.education,city:req.body.area,state:req.body.state}, req.body.password,function(err, user){
    User.register({username:req.body.username,name:req.body.name,admis_no:req.body.admis_no,school:req.body.school,phone:req.body.phone,education:req.body.education,city:req.body.area,state:req.body.state}, req.body.password,function(err, user){
		if(err){
			console.log(err);
			wrong = true;
			req.flash("error",err.message);
			 res.redirect("/register");
			return;
    }
    console.log("User is "+user);
		passport.authenticate("local")(req,res,function(){
      var output=`<li>Email: ${user.username}</li><br>
      <li>Password: ${pass}</li><br>`;
       mail=String(user.username);
      console.log(mail);
      sending(output,"Login detais are:-",mail);
			req.flash("success","Welcome to YantroMitra "+user.name);
			res.redirect("/new");
		});
  });
}
else{
  res.send("your otp is not valid");
}
});
//==========================================

//=========Register User=============

app.post("/registerforadmin",function(req,res){
  //console.log(req.body);
  var det={username:req.body.username,name:req.body.name};
 // console.log(det);
 if(req.body.passcode === 'blahblah')
 {
   det.isAdmin=true;
 }
 var pass=req.body.password;
  User.register(det, req.body.password,function(err, user){
		if(err){
			console.log(err);
			wrong = true;
			req.flash("error",err.message);
			 res.redirect("/registerforadmin");
			return;
    }
    console.log("User is "+user);
		passport.authenticate("local")(req,res,function(){
      var output=`<li>Email: ${user.username}</li><br>
      <li>Password: ${pass}</li><br>`;
      var mail=String(user.username);
      console.log(mail);
      sending(output,"Login detais are:-",mail);
			req.flash("success","Welcome to YantroMitra "+user.name);
			res.redirect("/");
		});
	});
});
//==========================================

app.post("/registerforschool",function(req,res){
  //console.log(req.body);
  var det={username:req.body.username,school:req.body.school};
 // console.log(det);
 school_temp=req.body.school;
 if(req.body.passcode === 'blahblah')
 {
   det.isSchoolAdmin=true;
 }
 var pass=req.body.password;
  User.register(det, req.body.password,function(err, user){
		if(err){
			console.log(err);
			wrong = true;
			req.flash("error",err.message);
			 res.redirect("/registerforschool");
			return;
    }
    console.log("User is "+user);
		passport.authenticate("local")(req,res,function(){
      var output=`<li>Email: ${user.username}</li><br>
      <li>Password: ${pass}</li><br>`;
      var mail=String(user.username);
      console.log(mail);
      sending(output,"Login detais are:-",mail);
			req.flash("success","Welcome to YantroMitra "+user.school);
			res.redirect("/");
		});
	});
});


//====LOGIN======================
app.get("/login",function(req,res){
  res.render("login");
});


//======LOGIN===========
app.post("/login",passport.authenticate("local",{
  successRedirect: "/new",// newly
  failureRedirect: "/login",
    failureFlash: 'Invalid username or password.'
  }),function(req, res){
    // if(req.user.isAdmin == true || req.user.isSchoolAdmin == true)
    // res.redirect("/new");
    // else
    // res.render("parag/studentdash");
});


//=========User Registeration Ends====



//====== LOG OUT =========

app.get("/logout",function(req,res){
  req.logout();
    school_temp=null;
		req.flash("success","Successfully Logged Out!");
	res.redirect("/");
});

//=======LOG OUT ENDS======


//==========About us=======
app.get("/about_us",function(req,res){
  res.render("parag/about_us")
})
//===========Our team==========
app.get("/team",function(req,res){
  res.render("parag/team");
})
//========== Sending Mail==========
app.post("/contactus",isLoggedIn,function(req,res){

  var email=req.body.email;
  var name=req.body.name;
  var subject=req.body.subject;
  var message=req.body.message;

  var obj={name:name,email:email,subject:subject,message:message};
  
  Message.create(obj,function(err,message)
  {
    if(err){
      console.log(err);
      res.render("error.ejs");

    }
    else{
      User.findById(req.user._id,function(err,foundUser){
        // if(foundUser.isSchoolAdmin==false && foundUser.isAdmin==false && foundUser.admis_no!=="" && foundUser.admis_no!=="none" )
        // {
          console.log("yes it is a student");
          message.is_School_student=true;
          message.school_name=req.user.school;
        // }
        message.save();
      })
      console.log(message);
      
    }
  });

  var output = `<p> There you go..</p>
  <br>
  <br>
  <ul style="list-style:none">
  <li>Name: ${name}</li><br>
  <li>Email: ${email}</li><br>
  <li>Subject: ${subject}</li><br>
  <li>Message: ${message}</li>
  </ul>`;

  sending(output,"He/She wants us to contact him/her!","shashank19981213@gmail.com");

  req.flash("success","Formed filled successfully, will contact you soon! ");


res.redirect("/");
});

app.post("/yantrostava",function(req,res){


  Yantro.create(req.body.yantro,function(err,message)
  {
    if(err){
      console.log(err);
          res.render("error.ejs");

    }
    else{
      console.log(message);
    }
  });

  var message=req.body.yantro;

  output = `<p> There you go..</p>
  <br>
  <br>
  <ul style="list-style:none">
  <li>Del1: ${message.del1}</li><br>
  <li>Del2: ${message.del2}</li><br>
  <li>Del3: ${message.del3}</li><br>
  <li>Taluka: ${message.taluka}</li><br>
  <li>Subject: ${message.district}</li><br>
  <li>Phone No.: ${message.phno}</li><br>
  <li>School Name: ${message.schoolname}</li><br>
  <li>School Email: ${message.schoolemail}</li><br>
  </ul>`;

  sending(output,"YantroStava Form Details!","shashank19981213@gmail.com");
  req.flash("success","Formed filled successfully, will contact you soon! ");

res.redirect("/");

});



//=================function sending mail==========

function sending(output,subject,email)
{
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'friendstwo631@gmail.com',
      pass: 'yteeoskpnbbgqhru' // naturally, replace both with your real credentials or an application-specific password
    }
    });
    
    const mailOptions = {
    from: 'friendstwo631@gmail.com',
    to: 'friendstwo631@gmail.com',
    subject: subject,
    html: output
    };
    
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
    console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
    });
}


//============= MIDDLEWARE for logged In===============
function isLoggedIn(req,res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in!");
	res.redirect("/login");
}


//==============MIDDLEWARE FOR CHECKING OWNERSHIP=========
function checkingCourse(req,res ,next){
	// if user logged in?
	if(req.isAuthenticated()){
		Course.findById(req.params.id,function(err, course){
		if(err){
			console.log(err);
			req.flash("error","Course Not Found!")
			res.redirect("back");
		}
		else{
      // does user own the campground
      var x="admin";
			if(req.user.education==="none"||course.classcode === req.user.education || req.user.isAdmin == true || req.user.isSchoolAdmin == true){
				//console.log("hey");
				next();
				
			}else{
				req.flash("error","You don't have permission to access this page! :( ");
				res.redirect("back");
			}
		}
	});
		
	}else{
		req.flash("error","You need to be logged in!");
	res.redirect("/login");
		
	}
	
	
}

//==================================================

//==========Middle Ware for isAdmin=======

function isAdmin(req,res ,next){
	// if user logged in?
	if(req.isAuthenticated()){
   // console.log(req.user.username);
    if(req.user.isAdmin == true){
    next();
    }
    else{
      req.flash("error","You don't have permission to access this page!");
    res.redirect("/");
      
    }

	}else{
		req.flash("error","You don't have permission to access this page!");
	res.redirect("/");
		
	}
}

function isSubAdmin(req,res ,next){
	// if user logged in?
	if(req.isAuthenticated()){
   // console.log(req.user.username); 
  //  if(req.user.isSchoolAdmin == true){
    if(req.user.isAdmin == true || req.user.isSchoolAdmin == true){   //newly// orginal was this line
    next();
    }
    else{
      req.flash("error","You don't have permission to access this page!");
    res.redirect("/");
      
    }

	}else{
		req.flash("error","You don't have permission to access this page!");
	res.redirect("/");
		
	}
}


//===================================================
//==============Storing Data to Database=============
//===================================================


app.get("/dataentry",isSubAdmin,function(req,res){
  res.render("detailform/courseform.ejs");
});

//creating course
app.post("/createcourse",isSubAdmin,function(req,res){

  Course.findOne({name:req.body.course.name},function(err,foundcourse){
    if(foundcourse)
    {
      res.send("Course Name already exists, Try some other course name")
    }
    else if(!foundcourse)
    {
    //  console.log("something wrong") 
      Course.create(req.body.course,function(err,course){
        if(err)
        {
          console.log(err);
          // res.render("error.ejs");
          res.send("You are repeating the course code. Give the next code.");
        }
        else{
        console.log("Course is"+course);
        res.redirect("/subjectfor/"+course.id);
        }
      });
      
    }
  })
      // Course.create(req.body.course,function(err,course){
      //   if(err)
      //   {
      //     console.log(err);
      //     // res.render("error.ejs");
      //     res.send("You are repeating the course code. Give the next code.");
      //   }
      //   else{
          
      //   //  console.log("Course is"+course);
      //   //  res.redirect("/subjectfor/"+course.id);
      //   console.log("Course is"+course);
      // res.redirect("/subjectfor/"+course.id);
      //   }
      // });
});

//creating subject

app.get("/subjectfor/:id",isSubAdmin,function(req,res){
  
  Course.findById(req.params.id,function(err,course){
    console.log(req.params.id)

    if(err)
    {
      console.log(err);
          res.render("error.ejs");
    }
    else
    {
      res.render("detailform/subjectform.ejs",{course:course});
    }
  })

  
});

app.post("/subjectfor/:id",isSubAdmin,function(req,res){

  Course.findById(req.params.id,function(err,course){

    if(err)
    {
      console.log(err);
      res.render("error.ejs");
    }
    else
    {

      Subject.create({name:req.body.name,link:req.body.link},function(err,subject)
      {
        if(err)
        {
          console.log(err);
        }
        else
        {

          subject.detail.course=course.name;
          subject.detail.id=req.params.id;
          subject.save();
          console.log(subject);
          course.subjects.push(subject);
          course.save();
          console.log(subject);
          req.flash("success","Subject: "+subject.name+" added successfully!");

          res.redirect("/chapterfor/"+subject.id+"/course/"+course.id);

        }
      });
    }
  });
});

//Adding new subject to a particular course

app.get("/addnewsubject",isSubAdmin,function(req,res){
  console.log(school_temp);
  Course.find({school_name:school_temp},function(err,found){
    if(err){
    res.render("error.ejs");
    console.log(err);
    }
    else
    {
    //  console.log(found);
      res.render("detailform/newsubject",{course:found});
    }
  });
 
});
app.post("/newsubject",isSubAdmin,function(req,res){

  Course.findOne({code:req.body.course.code,classcode:req.body.course.classcode},function(err,found){
    // found.forEach(function(f){
    // //  console.log(f._id); 
    //   res.redirect("/subjectfor/"+f._id);
    // })
    console.log(found)
    res.redirect("/subjectfor/"+found._id);
  })

});

//creating chapter
app.get("/chapterfor/:subject_id/course/:course_id",isSubAdmin,function(req,res){


  Subject.findById(req.params.subject_id,function(err,subject){

    if(err)
    {
       console.log(err);
          res.render("error.ejs");
    }
    else
    {
      Course.findById(req.params.course_id,function(err,course){
        res.render("detailform/chapterform.ejs",{subject:subject,course:course})
      });
      
    }
  });
  
});

app.post("/chapterfor/:subject_id/course/:course_id",isSubAdmin,function(req,res)
{

Course.findById(req.params.course_id,function(err,course)
{
  //console.log("ADDED COURSE IS "+course);
  Subject.findById(req.params.subject_id,function(err,subject){

    Chapters.create({name:req.body.name,link:req.body.link},function(err,chap){

      chap.detail.id=subject.id;
      chap.detail.course=course.name;
      chap.detail.subject=subject.name;
      chap.save();
      subject.chapters.push(chap);
      subject.save();
      console.log(subject);

      req.flash("success","Chapter: "+chap.name+" added successfully!");
      res.redirect("/video/"+chap.id+"/subject/"+subject.id+"/course/"+course.id);
    });
  });
});

});

//Adding new chapter to a particular subject/course

// app.get("/addnewchapter",isSubAdmin,function(req,res){

//   Course.find({school_name:school_temp},function(err,foundcourse){
//     if(err){
//     res.render("error.ejs");
//     console.log(err);
//     }
//     else
//     {
//       Subject.find({},function(err,subject){
//       console.log(found);
//       res.render("detailform/newchapter",{course:found,subject:subject});
//       });
//       Class.findById(req.params.id).populate("students").populate("periods").exec(function(err,foundClass){
//         if(err){
//           console.log(err);
//         }
//         else{
//                 temp=foundClass;
//            console.log(temp._id);
//                // res.render("register_student",{class:foundClass});
//                res.redirect("/index");
//             //    res.render("login",{foundClass:foundClass})
//         }
//       });
//     }
//   });
 
// });


app.get("/addnewchapter",isSubAdmin,function(req,res){

  Course.find({school_name:school_temp}).populate("subjects").exec(function(err,foundcourse){
    if(err){
    res.render("error.ejs");
    console.log(err);
    }
    else
    {
      res.render("detailform/selectcourse",{course:foundcourse});
    }
  })
 
});

app.post("/selectsubject",isSubAdmin,function(req,res){
  console.log(req.body.coursecode)
  Course.findOne({code:req.body.coursecode},function(err,foundcourse){
            if(err){
              console.log(err);
            }
            else{
              console.log(foundcourse);
              Course.findOne({_id:foundcourse._id}).populate("subjects").exec(function(err,result){
                if(err){
                  console.log(err);
                }
                else{
                  console.log(result)
                  res.render("detailform/newchapter",{course:result});
                  }
              })
              // Subject.find({course:foundcourse.name},function())
              
            }
})
})





app.post("/newchapter",isSubAdmin,function(req,res){
 var course_id=req.body.course_id;
 var subject_id=req.body.subject_id;
 res.redirect("/chapterfor/"+subject_id+"/course/"+course_id);
  // Course.find({classcode:req.body.classcode},function(err,found){
  //   found.forEach(function(f){
  //     //console.log(f._id); 
  //     Subject.find({name:req.body.subject,"detail.course":f.name},function(err,sub){

  //       if(err)
  //       {
  //         console.log(err);
  //       }

  //       sub.forEach(function(s){
  //         console.log(s._id); 
  //         res.redirect("/chapterfor/"+subject_id+"/course/"+course_id);
  //       })

  //     })
      
  //   })
  // })

});

//creating videos
app.get("/video/:chap_id/subject/:subject_id/course/:course_id",isSubAdmin,function(req,res){

  Course.findById(req.params.course_id,function(err,course)
  {
   // console.log("Found "+course);
  Subject.findById(req.params.subject_id,function(err,subject){
    //console.log("Found "+subject);

    Chapters.findById(req.params.chap_id,function(err,chap){
     // console.log("Found "+chap);


     res.render("detailform/videoform.ejs",{course:course,subject:subject,chap:chap});

    });


  });
});

});

app.post("/video/:chap_id/subject/:subject_id/course/:course_id",isSubAdmin,function(req,res){
  Course.findById(req.params.course_id,function(err,course)
  {
  Subject.findById(req.params.subject_id,function(err,subject){

    Chapters.findById(req.params.chap_id,function(err,chap){

      Videos.create(req.body.video,function(err,video)
      {
        video.detail.id=chap.id;
        video.detail.course=course.name;
        video.detail.chapter=chap.name;
        video.detail.subject=subject.name;
        video.save();
        chap.videos.push(video);
        chap.save();
        console.log(chap);
        req.flash("success","Video: "+video.caption+" added successfully!");
        res.redirect("/video/"+chap.id+"/subject/"+subject.id+"/course/"+course.id)
      });

    });


  });
});

});

//Adding new video to a particular subject/course/chapter

app.get("/addnewvideo",isSubAdmin,function(req,res){
  Course.find({school_name:school_temp}).populate("subjects").exec(function(err,foundcourse){
    if(err){
    res.render("error.ejs");
    console.log(err);
    }
    else
    {
      res.render("detailform/selectcourse_forvideo",{course:foundcourse});
    }
  })
 
});
  
  
  
//   Course.find({},function(err,found){
//     if(err){
//     res.render("error.ejs");
//     console.log(err);
//     }
//     else
//     {
//       Subject.find({},function(err,subject){
//      // console.log(found);
//      Chapters.find({},function(err,chap){

//       res.render("detailform/newvideo",{course:found,subject:subject,chap:chap});
//      });
//     });
//     }
//   });
 
// });

app.post("/selectsubject_forvideo",isSubAdmin,function(req,res){
  // console.log(req.body.coursecode)
  console.log(req.body.course.code)
  // Course.findOne({code:req.body.coursecode},function(err,foundcourse){
    Course.findOne({code:req.body.course.code},function(err,foundcourse){
            if(err){
              console.log(err);
            }
            else{
              console.log(foundcourse);
              Course.findOne({_id:foundcourse._id}).populate("subjects").exec(function(err,result){
                if(err){
                  console.log(err);
                }
                else{
                  // console.log(result)
                  // console.log("subject found .................")
                  // console.log(result.subjects)
                  res.render("detailform/newchapter_forvideo",{course:result});
                  // res.render("detailform/newchapter_forvideo",{course:result.subjects});
                  }
              })
              // Subject.find({course:foundcourse.name},function())
              
            }
})
})

app.post("/selectchapter_forvideo",function(req,res){
  var subj_id=req.body.subject_id;
  var course_id=req.body.course_id;
  console.log(subj_id)
  Subject.findOne({_id:req.body.subject_id}).populate("chapters").exec(function(err,foundsubject){
    if(err){
      console.log(err);
    }
    else{
          res.render("detailform/selectchapter_forvideo",{subject:foundsubject,course_id:course_id});
          }
      })
      // Subject.find({course:foundcourse.name},function())
})





app.post("/newvideo",isSubAdmin,function(req,res){
  var subj_id=req.body.subject_id;
  var course_id=req.body.course_id;
  var chapter_id=req.body.chapter_id;
  res.redirect("/video/"+chapter_id+"/subject/"+subj_id+"/course/"+course_id);
  // Course.find({classcode:req.body.classcode},function(err,found){
  //   found.forEach(function(f){
  //     //console.log(f._id); 
  //     Subject.find({name:req.body.subject,"detail.course":f.name},function(err,sub){

  //       if(err)
  //       {
  //         console.log(err);
  //       }
  //       else
  //       {

  //       sub.forEach(function(s){
  //         console.log(s._id); 
  //         Chapters.find({name:req.body.chapter,"detail.subject":s.name,"detail.course":f.name},function(err,chap){

  //           chap.forEach(function(chap){
  //          res.redirect("/video/"+chap.id+"/subject/"+s._id+"/course/"+f._id);
 
  //           });


  //       });
  //     });
  //     }

  //     });
      
  //   });
  // });

});


//==========================================
//==========Done Adding to Database=========
//==========================================


app.get("/subject/:subject_id/chapter/:chap_id/edit",isSubAdmin,function(req, res){
	Chapters.findById(req.params.chap_id, function(err, chap){
		console.log(chap);
		if(err){
			res.redirect("back");
		}
		else{
			res.render("courses/editchapter",{chap: chap});
		}
	});
});

app.get("/chapter/:chapter_id/video/:video_id/edit",isSubAdmin,function(req, res){
	Videos.findById(req.params.video_id, function(err, video){
		console.log(video);
		if(err){
			res.redirect("back");
		}
		else{
			res.render("courses/editvideo",{video: video});
		}
	});
});


//deleting and editing.......chapters




app.put("/subject/:subject_id/chapter/:chap_id",isSubAdmin,function(req, res){
	Chapters.findByIdAndUpdate(req.params.chap_id,{ name:req.body.name}, function(err, updated){
    console.log("Updated is "+updated);
		if(err){
			res.redirect("back");
		}
		else{
      Subject.findById(req.params.subject_id,function(err,sub){

			req.flash("success","Chapter Updated Successfully!");
      res.redirect("/course/"+sub.detail.id+"/subject/"+req.params.subject_id);
      });
		}
	});
	
});





app.delete("/subject/:subject_id/chapter/:chapter_id",isSubAdmin,function(req,res)
{

  Chapters.findByIdAndDelete(req.params.chapter_id,function(err,chap)
  {

    if(err){
			res.redirect("back");
		} else{
			
			Subject.findById(req.params.subject_id,function(err,sub){
        if(err)
        {
          res.render(error);
          console.log(err);
        }
        else{
          req.flash("success","Chapter Deleted Successfully!");
          res.redirect("/course/"+sub.detail.id+"/subject/"+req.params.subject_id);
        }
      });
		}

  });
});





//deleting and editing videos


app.put("/chapter/:chap_id/video/:video_id",isSubAdmin,function(req, res){
	Videos.findByIdAndUpdate(req.params.video_id,req.body.video, function(err, updated){
    console.log("Updated is "+updated);
		if(err){
			res.redirect("back");
		}
		else{
      Chapters.findById(req.params.chap_id,function(err,chap){

			req.flash("success","Chapter Updated Successfully!");
      res.redirect("/subject/"+chap.detail.id+"/chapter/"+req.params.chap_id);
      });
		}
	});
	
});

app.delete("/chapter/:chapter_id/video/:video_id",isSubAdmin,function(req,res){

  Videos.findByIdAndRemove(req.params.video_id,function(err,video){

    if(err)
    {
      console.log(err);
      res.redirect("back");
    }
    else{

      Chapters.findById(req.params.chapter_id,function(err,chap){

        if(err)
        {
          res.render(error);
          console.log(err);
        }
        else{
          req.flash("success","Video Deleted Successfully!");
          res.redirect("/subject/"+chap.detail.id+"/chapter/"+req.params.chapter_id);
        }

      });
    }
  });
});


//============creating test and saving ============= 
app.get("/createtest",isSubAdmin,function(req,res){    //createtest_select_course

  Course.find({school_name:req.user.school},function(err,course){

   
      res.render("detailform/selectcourse_fortest",{course:course});

    });
  });

  app.post("/selectsubject_fortest",isSubAdmin,function(req,res){
    console.log(req.body.coursecode)
    Course.findOne({code:req.body.coursecode},function(err,foundcourse){
              if(err){
                console.log(err);
              }
              else{
                console.log(foundcourse);
                Course.findOne({_id:foundcourse._id}).populate("subjects").exec(function(err,result){
                  if(err){
                    console.log(err);
                  }
                  else{
                    console.log(result)
                    res.render("detailform/newchapter_fortest",{course:result});
                    }
                })
                // Subject.find({course:foundcourse.name},function())
                
              }
  })
  })

  app.post("/selectchapter_fortest",function(req,res){
    var subj_id=req.body.subject_id;
    var course_id=req.body.course_id;
    console.log(subj_id)
    Subject.findOne({_id:req.body.subject_id}).populate("chapters").exec(function(err,foundsubject){
      if(err){
        console.log(err);
      }
      else{
            res.render("detailform/selectchapter_fortest",{subject:foundsubject,course_id:course_id});
            }
        })
        // Subject.find({course:foundcourse.name},function())
  })

app.post("/createtest1",isSubAdmin,function(req,res){

  Course.findById(req.body.course_id,function(err,course){

    Subject.findById(req.body.subject_id,function(err,subject){

      Chapters.findById(req.body.chapter_id,function(err,chapter){
        console.log(chapter.name);
      res.render("test/testfor_after_slecting_chapter",{course:course,subject:subject,chapter:chapter});// after choosing chapter

    });
  });
});
});



app.get("/code_for_student",isSubAdmin,function(req,res){
  res.render("admin/generate_code");
})

app.post("/code_for_student",isSubAdmin,function(req,res){
  console.log("");
  var admis_no=req.body.stud_admis_no
  var code=req.body.stud_code
  console.log(admis_no)
  console.log(code)
})

app.post("/createtest",isSubAdmin,function(req,res)
{
  
  // console.log("entered psot");
  // console.log(req.body.test.subject != 'none')
  //    if(req.body.test.subject != 'none'){
  // Course.find({name:req.body.test.course},function(err,course){
  //   console.log("enterd courses")

  //   course.forEach(function(c){
  //     console.log("enterd courses for each");
  //   Subject.find({name:req.body.test.subject,"detail.course":req.body.test.course},function(err,subject){// good
  //     console.log(subject);
  //     if(err)
  //     {
  //       console.log(err);
  //     }
  //     else{
  //       console.log("enterd subject")
  //       subject.forEach(function(sub){
  //         console.log("enterd subject for each")
        res.redirect("/testfor/course/"+req.body.test.course+"/subject/"+req.body.test.subject+"/chapter/"+req.body.test.chapter);
      });
//       }
      

   
//   });
// });
// });
//      }
     
//      else{

//       Course.find({classcode:req.body.test.course},function(err,course){

//         course.forEach(function(c){

//           res.redirect("/testfor/course/"+c._id);
//         });
//       });

//      }
// });

app.get("/testfor/course/:course_id/subject/:subject_id/chapter/:chapter_id",isSubAdmin,function(req,res){

  var a="/testfor/course/"+req.params.course_id+"/subject/"+req.params.subject_id;
  res.render('test/title',{a:a});
});

app.get("/testfor/course/:course_id",isSubAdmin,function(req,res){

  var a="/testfor/course/"+req.params.course_id;
  res.render('test/title',{a:a});
});

//======================CREATE TEST================
//=================================================

app.post("/testfor/course/:course_id/subject/:subject_id",isSubAdmin,function(req,res){
  console.log("entered");

  Course.findById(req.params.course_id,function(err,course)
  {
    Subject.findById(req.params.subject_id,function(err,subject){

      Test.create({title:req.body.test.title,for:"subject",test_type:req.body.test.test_type,time:req.body.test.time,positive:req.body.test.positive,negative:req.body.test.negative},function(err,test)
      {
        if(err)
        {
          console.log(err);
          res.render("error");
        }
        else{
          test.detail.course_id=req.params.course_id;
          test.detail.subject_id=req.params.subject_id;
          test.detail.subject=subject.name;
          test.detail.course=course.classcode;
          test.save();
          subject.tests.push(test);
          subject.save();
          console.log("Subject is "+subject);
          console.log("Test is "+test);
          req.flash("success","Test Created Successfully!");
          res.redirect("/questionsfortest/"+test._id);
        }
      });

    });
  });
});

app.post("/testfor/course/:course_id",isSubAdmin,function(req,res){
  console.log("entered");

  Course.findById(req.params.course_id,function(err,course)
  {
      Test.create({title:req.body.test.title,for:"course",time:req.body.test.time},function(err,test)
      {
        if(err)
        {
          console.log(err);
          res.render("error");
        }
        else{
          test.detail.course_id=req.params.course_id;
          test.detail.subject="none";
          test.detail.course=course.classcode;
          test.save();
          course.tests.push(test);
          course.save();
          console.log("Course is "+course);
          console.log("Test is "+test);
          req.flash("success","Test Created Successfully!");
          res.redirect("/questionsfortest/"+test._id);
        }
      });

    });
  });



app.get("/questionsfortest/:id",isSubAdmin,function(req,res){

  Test.findById(req.params.id,function(err,test){

    res.render("test/questionsfortest",{test:test});

  });

});

app.post("/questionsfortest/:id",isSubAdmin,upload.single('image'),function(req,res){

  Test.findById(req.params.id,function(err,test){

    if(err)
    {
      console.log(err);
      res.render("error");
    }
    else
    {

      console.log(req.body.ques);
      if(req.file != undefined){
        cloudinary.uploader.upload(req.file.path, function(err,result) {
          // add cloudinary url for the image to the campground object under image property
           req.body.ques.ques_image = result.secure_url;
         // add author to campground
        
        Question.create(req.body.ques,function(err,ques){
  
          if(err)
          {
            console.log(err);
            res.render("error");
          }
          else{
  
            ques.detail.id=test._id;
            ques.detail.test=test.title;
            ques.detail.subject=test.detail.subject;
            ques.detail.course=test.detail.course;
            ques.save();
            console.log("Ques is "+ques);
            test.questions.push(ques);
            test.save();
            console.log("Test is "+test);
            req.flash("success","Question for "+test.title+" Created Successfully!");
            res.redirect("/questionsfortest/"+test._id);
          }
        });
      });
      }
      else{
        Question.create(req.body.ques,function(err,ques){
  
          if(err)
          {
            console.log(err);
            res.render("error");
          }
          else{
  
            ques.detail.id=test._id;
            ques.detail.test=test.title;
            ques.detail.subject=test.detail.subject;
            ques.detail.course=test.detail.course;
            ques.save();
            console.log("Ques is "+ques);
            test.questions.push(ques);
            test.save();
            console.log("Test is "+test);
            req.flash("success","Question for "+test.title+" Created Successfully!");
            res.redirect("/questionsfortest/"+test._id);
          }
        });
      }
    }
      
  });

});

//====================================================================
//==========route after transaction completed=============
//=====================================================================

app.get("/after_transaction/:id",function(req,res){
  var id=req.params.id;
  // var id2=req.params.id2;
  // var id_for_mail=String(id)
  var userid=req.user._id;
  console.log(id);
  // console.log(id2);
  
  Trans.findOne({user_id:userid}).exec(function(err,foundTrans){
    if(err)
    {
      console.log(err)
    }
    else if(foundTrans)
    {
      console.log("found trans")
      Cart.findOne({user_id:userid}).exec(function(err,result1){
        foundTrans.Transaction_id.push(id);
        foundTrans.course_code.push(...result1.code);
        foundTrans.course_name.push(...result1.c_name);
        foundTrans.save();
        // var name_for_mail=String(result1.c_name)
        var output=`<li>Email: ${req.user.username}</li><br>
        <li>transaction id: ${id}</li><br>
        <li>course: ${result1.c_name}</li><br>`;
        mail=String(req.user.username);
        console.log(mail);
        sending(output,"transaction details are:-",mail);
        console.log("buysdvuyv",foundTrans.course_code);
        
        // var i=0;
        // for(var x of foundTrans.course_code)
        // {
        //   Course.findOne({code:x},function(err,foundCourse)
        //   {
        //     if(foundCourse){
        //     console.log(foundCourse)
        //     console.log(foundCourse.name)
        //     temp_array[i++]=(foundCourse.name);

        //   }
        //   })
        // }
        // res.render("your_courses",{course_code:foundTrans.course_code,course:foundTrans.course_name,cart:result1._id});
        res.render("your_courses",{course_code:foundTrans.course_code,course:foundTrans.course_name,cart:result1._id});
        // res.render("parag/coursesforyou",{course:foundTrans});
        // res.redirect("cart_delete");
      })    
    }
    else{
      // var new_entry={code:code,c_name:c_name,username:username,user_id:userid,amount:amount,total_amount:amount}
      Trans.create({user_id:userid},function(err,newEntry){
        if(err)
        console.log(err)
        else
        {
          Cart.findOne({user_id:userid}).exec(function(err,result){
          newEntry.Transaction_id.push(id);
          newEntry.course_code.push(...result.code);
          newEntry.course_name.push(...result.c_name);
          // Array.prototype.push.apply(newEntry.course_code, result.code) // we can't use this because it was not updating the array in real...it was working on array considering it as an object
          newEntry.save();
          var output=`<li>Email: ${req.user.username}</li><br>
          <li>transaction id: ${id}</li><br>
          <li>course: ${result.c_name}</li><br>`;
          mail=String(req.user.username);
          console.log(mail);
          sending(output,"transaction details are:-",mail);
          
          console.log("go go go",newEntry.course_code);
          // var i=0;
          // for(var x of result.code)
          // {
          //   Course.findOne({code:x},function(err,foundCourse)
          //   {
          //     if(foundCourse){
          //     console.log(foundCourse)
          //     console.log(foundCourse.name)
          //     temp_array[i++]=(foundCourse.name);

          //   }
          //   })
          // }
          res.render("your_courses",{course_code:newEntry.course_code,course:newEntry.course_name,cart:result._id});
          // res.render("parag/coursesforyou",{course:newEntry});
      //     Course.find({},function(err,foundcourses){
        // res.redirect("/cart_delete");
      //       res.render("your_courses",{course_code:newEntry.course_code,course:foundcourses});
      //  })
        })
        }
      })
    }
  })
})











//====================================================================
//==========create doubts and send to admin and receive it=============
//=====================================================================
app.get("/senddoubt/:chap_id/user/:user_id",isLoggedIn,function(req,res){
  res.redirect("/senddoubt/"+req.params.chap_id+"/user/"+req.params.user_id)
})

app.post("/senddoubt/:chap_id/user/:user_id",isLoggedIn,function(req,res){

  Chapters.findById(req.params.chap_id,function(err,chap){

    if(err)
    {
      console.log(err);
    }
    else
    {
      Doubt.create({doubt:req.body.doubt,school_name:school_temp,chapter:chap.name,subject:chap.detail.subject,course:chap.detail.course},function(err,doubt){
        if(err)
        {
          console.log("h1",chap.name,chap.detail.course)
          console.log(err);
          res.render("error");
        }
        else
        {
          console.log("h1",chap.name,chap.detail.course)
          User.findById(req.params.user_id,function(err,user){
            if(err)
            {
              console.log(err);
            }
            else
            {
              doubt.username=user.name;
              doubt.save();
              user.doubts.push(doubt);
              console.log("Doubt is "+doubt);

              user.save();
              console.log("user is "+user);
              res.redirect("back");
            }
          });
        }
      });
    }
  });
});

app.get("/showdoubtadmin",isSubAdmin,function(req,res){
  if(req.user.isAdmin == true){
    Doubt.find({},function(err,doubt){
      if(err)
      {
        console.log(err);
      }
      else{
        res.render("admin/showdoubtadmin",{doubt:doubt});
      }
    });
  }
  else{
  Doubt.find({school_name:school_temp},function(err,doubt){
    if(err)
    {
      console.log(err);
    }
    else{
      res.render("admin/showdoubtadmin",{doubt:doubt});
    }
  });
}
});



app.post("/addanswertodoubt/:doubt_id",isSubAdmin,function(req,res){

  Doubt.findByIdAndUpdate(req.params.doubt_id,{answer:req.body.answer,isAnswered:true},function(err,doubt){
    if(err)
    {
      console.log(err);
    }
    else
    {
      console.log("doubt issssssssssss "+doubt);
      req.flash("success","Answer Posted Successfully!");
      res.redirect("back");
    }
  });
});

app.get("/seedoubtsforuser/:user_id",isLoggedIn,function(req,res){
  User.findById(req.params.user_id).populate("doubts").exec( function(err,user){
    if(err)
    {
      console.log(err);
      res.render("error");
    }
    else
    {
      console.log("User is =========== "+user);
      console.log("User is =========== "+user.doubts);
      res.render("courses/showdoubtuser",{user:user});
    }

  });
});


app.listen(process.env.CUSTOMCONNSTR_MyConnectionString || 3000,function(){
  console.log("Yeah I am connected");
});