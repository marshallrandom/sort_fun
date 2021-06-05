var express = require("express");
var router  = express.Router({mergeParams: true}),
Savedlist = require("../models/savedlist"),
Savedlistitem = require("../models/savedlistitem"),
Sorter  = require("../models/sorter"),
Sortlist = require("../models/sortlist"),
Sortlistitem = require("../models/sortlistitem"),
Userrating = require("../models/userratings"),
Generalrating = require("../models/generalratings");

router.post("/sortpubliclist", function(req, res){
    if (res.locals.currentUser)
    {
        var losortname = req.body.sortname;
        var losortproperty = req.body.sortproperty;
        var losortlistselected = req.body.sortlistselected;


        Savedlistitem.find({"savedlistid":losortlistselected }, function(err, itemsfound) {
            if (err) {
               // res.status(500).send('Error looking up published list items');
            }
            else {


                        Sortlist.create({sortname : losortname, propertycompare : losortproperty, percentcompleted : 0,  userid : res.locals.currentUser.id}, function(err, newlyCreatedItem){
                            if (err) {
                               // res.status(500).send('Error creating sorting sort list on account');
                            }
                            else {
                                itemsfound.forEach(function(listitem){ 

    
                                    Sortlistitem.create({ordernum : listitem.ordernum, name : listitem.name, image : listitem.image, description : listitem.description, sortlistid : newlyCreatedItem._id } , function(err, newlyCreatedItem2){
                                    // console.log("item created");   
                                      //  if (err) {
                                          //  res.status(500).send('Error creating a list item');
                                       // } 
                                        
                                    } );                            


                                } ); 
                                res.redirect('/');   
                            };
                        });
                        
        
              


                };
            });
        





        
    } else {
        res.redirect('/'); //not logged in, redirect them
    }


});

router.post("/getpubliclist", function(req, res){
    if (res.locals.currentUser)
    {
        var lolistname = req.body.listname;
        var lolistselected = req.body.listselected;

        Sorter.countDocuments({"userid" : res.locals.currentUser.id, 
        "listname" : req.body.listname}, function (err, countresult){
             //   console.log(countresult);
                if (countresult == 0) { //they dont already have a list with that name
                    Savedlistitem.find({"savedlistid": req.body.listselected }, function(err, itemsfound) {
                        itemsfound.forEach(function(listitem){

                                    Sorter.create({name : listitem.name, image : listitem.image, description : listitem.description, listname : lolistname, userid : res.locals.currentUser.id}, function(err, newlyCreatedItem){
                                            
            
            
            
                                    });
                                    
                    
                                } );        
                                res.redirect('/');           


                    });



                } else {
                   // res.send("list with name already exists");
                   res.redirect('/'); 
                }


        });


        
    };

});

router.get("/viewpubliclist/:id", function(req, res){
    var distinctproperties = [];
    var showuserrating = false;
    var showgeneralrating = false;
    //var userratings = [];
    //var generalratings = [];
    
        Savedlist.find({"_id": req.params.id, "unpublished": { $ne: true }}, function(err, savedlist){
            if (!!savedlist && savedlist.length>0)
            {
                Savedlistitem.find({"savedlistid": savedlist[0].id}).sort([['ordernum', -1]]).exec( function(err2, savedlistitems) { 
                    if (!!savedlistitems)
                    {
    
                        Savedlist.aggregate([
                            {$addFields: {
                                convertedId: { $toObjectId: "$userid" }
                            }},
     
                            { $lookup: {from: 'users', localField: 'convertedId', foreignField: '_id', as: 'users' }}, { $match: { "listitems_md5":  savedlist[0].listitems_md5, "unpublished": { $ne: true } } }
                          ]).allowDiskUse(true).exec(function(err, listofothers) {
                             // if (err)
                             //   res.send(err);
                              if (!!listofothers)
                              {
                                listofothers.forEach(function(listofothersitems){ 
                                    if (distinctproperties.indexOf(listofothersitems.propertycompare.toUpperCase())< 0)
                                    {
                                        distinctproperties.push(listofothersitems.propertycompare.toUpperCase());
    
                                    }
                                    distinctproperties.sort();
                                   // console.log("distinctproperties");
                                   // console.log(distinctproperties);
    
                                
                                });
    
                              }
                              if (res.locals.currentUser) 
                              {  
                                 Generalrating.countDocuments({"userid" : res.locals.currentUser.id, 
                                "listid" : savedlist[0].listitems_md5}, function (err, countresult){
                                    if (countresult == 0) {
                                        showgeneralrating = true;
                                      //  console.log('0 equals true');
                                      //  console.log(showgeneralrating);
                                    }
                                    else
                                        showgeneralrating = false;
                                });
                                Userrating.countDocuments({"userid" : res.locals.currentUser.id, 
                                "listid" : req.params.id}, function (err, countresult){
                                  //  console.log(countresult);                   
                                   if (countresult == 0)
                                   {
                                        showuserrating = true;
    
                                   }
                                    else
                                        showuserrating = false;
                                });
    
                              }
    
                              Generalrating.aggregate([
                                {$addFields: {
                                    convertedId: { $toObjectId: "$userid" }
                                }},
         
                                { $lookup: {from: 'users', localField: 'convertedId', foreignField: '_id', as: 'users' }}, { $match: { "listid":  savedlist[0].listitems_md5 } }
                              ]).allowDiskUse(true).exec(function(err, generalratings) {
                               // console.log("general ratings found");
    
    
                                        Userrating.aggregate([
                                            {$addFields: {
                                                convertedId: { $toObjectId: "$userid" }
                                            }},
                    
                                            { $lookup: {from: 'users', localField: 'convertedId', foreignField: '_id', as: 'users' }}, { $match: { "listid":  req.params.id } }
                                        ]).allowDiskUse(true).exec(function(err, userratings) {
                                          /*  console.log("savedlist:savedlist");
                                            console.log(savedlist);
                                            console.log("savedlistitems:savedlistitems");
                                            console.log(savedlistitems);
                                            console.log("listofothers:listofothers");
                                            console.log(listofothers);
                                            console.log("distinctproperties:distinctproperties");
                                            console.log(distinctproperties);
                                            console.log("showgeneralrating:showgeneralrating");
                                            console.log(showgeneralrating);
                                            console.log("showuserrating:showuserrating");
                                            console.log(showuserrating);
                                            console.log("generalratings:generalratings");
                                            console.log(generalratings);
                                            console.log("userratings:userratings");
                                            console.log(userratings); */
                                                res.render("viewpubliclist",{savedlist:savedlist, 
                                                    savedlistitems:savedlistitems, 
                                                    listofothers:listofothers, 
                                                    distinctproperties:distinctproperties,
                                                    showgeneralrating:showgeneralrating,
                                                    showuserrating:showuserrating,
                                                    generalratings:generalratings,
                                                    userratings:userratings
                                                });
    
                                        
    
                                            
                                            });
    
                                });
    
    
    
    
    
                          });
    
    
    
    
                    }
                    
                });
    
    
    
    
    
    
    
    
    
    
                    }
                else {
                    res.redirect("/");
                }
    
    
        });
    
            
    
    
    });
    
    
    router.get("/unpublishsortlist/:id", function(req, res){
    
        if (res.locals.currentUser) 
        {
            Savedlist.updateOne({"userid": res.locals.currentUser.id, "_id": req.params.id }, { unpublished: true }, function(err, listitem){
                res.redirect('back');
                
            });    
        }
    
        
                
        
        
    });

    module.exports = router;
    