var express = require("express");
var router  = express.Router({mergeParams: true});
var multer      = require("multer");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/images/")
    },
    filename: function (req, file, cb) {
      cb(null, 'Image_' + Date.now() + file.originalname )
    }
  });

var upload = multer({ storage: storage, limits: { fileSize: 2000000 } }),
Sorter  = require("../models/sorter");

router.post("/additem/:id", upload.single('samplefile'), function(req, res){

    var name = req.body.name;
    var image = ""; 
    var desc = req.body.description;
     if (res.locals.currentUser) 
    {
        //console.log(req);
        if ( !(typeof req.file === typeof undefined) )
        {
            if ( !(typeof req.file.filename === typeof undefined) ) 
            {
                image = "/images/" + req.file.filename;

            }
            else
                console.log("no filename defined");
        }
        else
            console.log("no file defined");


        var newSorter = {name: name, image: image, description: desc, userid : res.locals.currentUser.id, listname : Buffer.from(req.params.id, 'hex').toString('utf8')}


        Sorter.create(newSorter, function(err, newlyCreated){
            if(err){
                console.log(err);
            } else {

                //redirect back to campgrounds page
                res.redirect('back');
            }
        });
    } else 
    {
        res.render("landing");        
    }
});

router.post("/edititem/:id", upload.single('samplefile'), function(req, res){

    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
   // var newSorter = {name: name, image: "/images/" + req.file.filename, description: desc, userid : res.locals.currentUser.id, listname : Buffer.from(req.params.id, 'hex').toString('utf8')}
    if (res.locals.currentUser) 
    {

        //console.log(req);
        if ( !(typeof req.file === typeof undefined) )
        {
            if ( !(typeof req.file.filename === typeof undefined) ) 
            {
             //   console.log(req.file.filename);
                Sorter.updateOne({"userid": res.locals.currentUser.id, "_id": req.params.id } ,{ image: "/images/" + req.file.filename  }, function(err, listitems)
                {
                
                    if(err)
                        console.log(err);

                });

            }
            else
                console.log("no filename defined");
        }
        else
            console.log("no file defined");
        //console.log(req.body);
        if (req.body.description != '') //update if not blank
        {
            Sorter.updateOne({"userid": res.locals.currentUser.id, "_id": req.params.id } ,{ description: req.body.description  }, function(err, listitems)
            {
            
                if(err) {
                    console.log(err);
                } else {
              //   res.redirect('back');
          //     console.log(listitems);
            }


            });
        }

        if (req.body.name != '') //update if not blank
        {
            Sorter.updateOne({"userid": res.locals.currentUser.id, "_id": req.params.id } ,{ name: req.body.name }, function(err, listitems)
            {
            
                if(err) {
                    console.log(err);
                }
                 else {
            //        console.log(listitems);
                }


            });
        }
        

        res.redirect('back');
    } else 
    {
        res.render("landing");        
    }
});

router.get("/getlist/:id", function(req, res){

    if (res.locals.currentUser) 
    {
        if ((req.params.id).length > 150) {
            res.send("list name cannot exceed 75 characters (had to draw the line somewhere)");

        }
        else
        {
                //console.log(res.locals.currentUser);
                //console.log(Buffer.from(req.params.id, 'hex').toString('utf8'));
                Sorter.find({"userid": res.locals.currentUser.id, "listname": Buffer.from(req.params.id, 'hex').toString('utf8') }, function(err, listitems){
                    
                    if(err){
                        console.log(err);
                    } else {
                        res.render("viewlist",{listitems:listitems, viewingListname : req.params.id});
                    }
                });
        }
    
    }
    else res.redirect("/");
});

router.get("/deletelist/:id", function(req, res){

    if (res.locals.currentUser) 
    {
        //console.log(res.locals.currentUser);
        //console.log(Buffer.from(req.params.id, 'hex').toString('utf8'));
        if (Buffer.from(req.params.id, 'hex').toString('utf8').length > 0)
        {
            Sorter.remove({"userid": res.locals.currentUser.id, "listname": Buffer.from(req.params.id, 'hex').toString('utf8') }, function(err, listitems){
            
                if(err){
                    console.log(err);
                } else {
                    res.redirect('back');
                }
                });
                }
            else res.render("landing");
        } else
        console.log("not a valid delete");
});

router.get("/deletelistitem/:id", function(req, res){

    if (res.locals.currentUser) 
    {
        //console.log(res.locals.currentUser);
        //console.log(Buffer.from(req.params.id, 'hex').toString('utf8'));
        Sorter.remove({"userid": res.locals.currentUser.id, "_id": req.params.id }, function(err, listitems){
            
       if(err){
           console.log(err);
       } else {
        res.redirect('back');
       }
    });
    }
    else res.render("landing");
});


module.exports = router;
