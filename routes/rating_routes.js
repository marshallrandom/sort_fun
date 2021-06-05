var express = require("express");
var router  = express.Router({mergeParams: true}),
Userrating = require("../models/userratings"),
Generalrating = require("../models/generalratings"), 
Supportcalls = require("../routes/supportcalls");

router.post("/senduserrating", function(req, res){

    if (res.locals.currentUser) 
    {      
        Userrating.countDocuments({"userid" : res.locals.currentUser.id, 
        "listid" : req.body.userlistid}, function (err, countresult){

            if (countresult == 0) {

                if (!!req.body.listratingstarsent)
                {
                    if (req.body.listratingstarsent > 0)
                    {
                        if (!!req.body.comparisonratingstarsent) 
                        {
                            if (req.body.comparisonratingstarsent > 0)
                            {
                                Userrating.create({"userid": res.locals.currentUser._id,
                                        "saveddate": Supportcalls.getTimeStamp(),
                                        "listid": req.body.userlistid,
                                        "listrating": req.body.listratingstarsent,
                                        "comparisonrating": req.body.comparisonratingstarsent,
                                        "ratingcomment": req.body.userratingcomment 
                                    }, function(err, createdresult) {
                                            res.redirect('back');

                                        });
                            }
                            else
                            {
                                res.send("not a valid comparison rating");
                            }
                        }
                        else 
                        {
                                res.send("no comparison rating sent");
                        }
                    }
                    else
                    {
                        res.send("not a valid list rating");

                    }
                } 
                else
                {
                    res.send("no list rating sent");
                }



            };
        });


    };
});

router.post("/sendgeneralrating", function(req, res){

    if (res.locals.currentUser) 
    {      
        Generalrating.countDocuments({"userid" : res.locals.currentUser.id, 
        "listid" : req.body.userlistid}, function (err, countresult){

            if (countresult == 0) {

                if (!!req.body.itemratingstarsent)
                {
                    if (req.body.itemratingstarsent > 0)
                    {
                        if (!!req.body.imageratingstarsent)
                        {
                            if (req.body.imageratingstarsent > 0)
                            {
                                if (!!req.body.itemdescripitonratingstarsent)
                                {
                                    if (req.body.itemdescripitonratingstarsent > 0)
                                    {
/*
   userid: String, 
   saveddate : String,
   listid : String,
   imagerating : Number,
   itemrating : Number,
   itemdescripitonrating : Number,
   ratingcomment : String */
                                //itemdescripitonratingstarsent
                                Generalrating.create({"userid": res.locals.currentUser._id,
                                        "saveddate": Supportcalls.getTimeStamp(),
                                        "listid": req.body.generallistid,
                                        "imagerating": req.body.imageratingstarsent,
                                        "itemrating": req.body.itemratingstarsent,
                                        "itemdescripitonrating": req.body.itemdescripitonratingstarsent,
                                        "ratingcomment": req.body.generalratingcomment                                  
                                    
                                    }, function(err, createdresult) {
                                            res.redirect('back');

                                        });
                                    } else
                                        res.send("no item description rating sent");
                                }
                            }
                            else
                            {
                                res.send("not a valid comparison rating");
                            }
                        }
                        else 
                        {
                                res.send("no comparison rating sent");
                        }
                    }
                    else
                    {
                        res.send("not a valid list rating");

                    }
                } 
                else
                {
                    res.send("no list rating sent");
                }



            };
        });


    };
});

module.exports = router;

