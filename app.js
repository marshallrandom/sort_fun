var express = require("express"),
    app = express(),
	path = require('path'), 
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    Sorter  = require("./models/sorter"),
    Sortlist = require("./models/sortlist"),
    User        = require("./models/user"),
    Savedlist = require("./models/savedlist"),
    seedDB      = require("./seeds"),
    multer      = require("multer"),
    md5         = require('md5'),
    compression = require('compression'),
    Supportcalls = require("./routes/supportcalls");
    fs = require('fs');

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, "public/images/")
        },
        filename: function (req, file, cb) {
          cb(null, 'Image_' + Date.now() + file.originalname )
        }
      });
      var totalcomparisons = 0;     
      var pagesent = false;
      var upload = multer({ storage: storage, limits: { fileSize: 2000000 } });
//var upload = multer({dest: "Public/images/", limits: { fileSize: 2000000 }});
//requiring routes
var indexRoutes      = require("./routes/index");
var decisionRoutes  = require("./routes/decision_routes"); 
var listRoutes = require("./routes/list_routes");
var publishedRoutes = require("./routes/published_routes");
var ratingRoutes = require("./routes/rating_routes");
var sortRoutes = require("./routes/sort_routes");
mongoose.set('debug', true);	
mongoose.connect("mongodb://localhost/sorter", { useNewUrlParser: true, useUnifiedTopology: true });
app.use(compression());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')))
///seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Hey what's up?  Testing Testing",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});



app.get("/", function(req, res){
    var countresult = 0;

    if (res.locals.currentUser) 
    {

    Sorter.distinct("listname", {"userid": res.locals.currentUser.id }, function(err, listnames)
        {
        var unschedulednotposted = [];
        var sortlistsearchitems = [];
       if(err){
           console.log(err);
           res.status(500).send('Error looking up lists');
       } else {

            Sortlist.find({"userid": res.locals.currentUser.id }, function(err2, sortlist) {
                Savedlist.find({"userid": res.locals.currentUser.id }, function(err3, savedlist) {
                    
                    sortlist.forEach(function(md5item){
                        if (!(md5item.listitems_md5 === typeof undefined)) {
                            if (sortlistsearchitems.indexOf(md5item.listitems_md5) < 0) {
                                sortlistsearchitems.push(md5item.listitems_md5);




                            };
                           /*  countresult = Savedlist.countDocuments({"listitems_md5" : md5item.listitems_md5 }).then(countresult => {
                                // you can only use data here
                                if (countresult > 0) {
                                    unschedulednotposted.push(md5item.listitems_md5);
                                    console.log("adding " + md5item.listitems_md5);
                                }
                              }).catch(err => {
                                // always handle errors
                              });; */








                        }


        
                    });
                    Savedlist.find().where('listitems_md5').in(sortlistsearchitems).exec((err, records) => {
                        records.forEach(function(md5item){
                            if (!(md5item.listitems_md5 === typeof undefined)) {
                                    if (unschedulednotposted.indexOf(md5item.listitems_md5)< 0) {
                                        unschedulednotposted.push(md5item.listitems_md5);

                                    }
                            }

                        });
                        User.find({"featured" : true}, function(err4, featuredusers) {
                            res.render("landing",{listnames:listnames, sortlist:sortlist, savedlist:savedlist, unschedulednotposted:unschedulednotposted, featuredusers:featuredusers});


                        });
                       // console.log("unschedulednotposted");
                       // console.log(unschedulednotposted);

                    });


                });

            });
            //console.log("out of if statement");
       
        }
    });
}
    else  {
        User.find({"featured" : true}, function(err4, featuredusers) {
            res.render("landing",{featuredusers:featuredusers});


        });

    }
});


app.get("/users/:id", function(req, res){


    Savedlist.find({"userid": req.params.id, "unpublished": { $ne: true }}, function(err3, savedlist) {
        if (err3) {
            res.status(500).send('Error user id not found');
        }
        else {
            User.find({"_id": req.params.id },  function(err2, userviewed) { 
                if (err2) {
                    res.status(500).send('Error looking up user');
                }
                else {
                    res.render("viewuser",{savedlist:savedlist, userviewed:userviewed});
                    
                }


            });
        }


    });

});


process.on('unhandledRejection', (error, promise) => {
    console.log(' Oh Lord! We forgot to handle a promise rejection here: ', promise);
    console.log(' The error was: ', error );
  });
 
  process.on('uncaughtException', (err, origin) => {
    console.log('uncaught exception');
    console.log(err);
  });



app.use("/", indexRoutes);
app.use("/", decisionRoutes);
app.use("/", listRoutes);
app.use("/", publishedRoutes);
app.use("/", ratingRoutes);
app.use("/", sortRoutes);

app.listen(80, function () {


    console.log("listening on port 80");
});