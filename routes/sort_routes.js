var express = require("express");
var router  = express.Router({mergeParams: true}),
Compareresult = require("../models/compareresult"),
Savedlist = require("../models/savedlist"),
Savedlistitem = require("../models/savedlistitem"),
Sortlist = require("../models/sortlist"),
Sorter  = require("../models/sorter"),
Sortlistitem = require("../models/sortlistitem"),
Supportcalls = require("./supportcalls"),
md5         = require('md5')
;
router.post("/createsortitem", function(req, res){

     if (res.locals.currentUser) 
    {
        var losortname = req.body.sortname;
        var losortproperty = req.body.sortproperty;
        var louserid = res.locals.currentUser.id; 
        var ordernumber = 0;

        var lolistname = Buffer.from(req.body.sortlistselected, 'hex').toString('utf8');
        var md5arrayvalue = "";
        var md5array = [];  




        Sorter.find({"userid": louserid, "listname": lolistname }).sort([["name", 1], ["image", 1], ["description", 1]]).exec(function(err3, md5generator) 
        {
            md5generator.forEach(function(md5item){
                md5array.push([md5item.name, md5item.image, md5item.description]);

            });

            md5arrayvalue = md5(JSON.stringify(md5array));
            var newSorter = {propertycompare : losortproperty , sortname : losortname , userid : louserid, percentcompleted : 0, listitems_md5 : md5arrayvalue };
        // Create a new campground and save to DB
        Sortlist.create(newSorter, function(err, newlyCreated){
            if(err){
                console.log(err);
            } else {
              //  console.log("userid = " + louserid + " listname = " + lolistname);
                Sorter.find({"userid": louserid, "listname": lolistname }, function(err, listitems){
                    listitems.forEach(function(listitem){
                //   console.log("creating a sortlistitem");
                        ordernumber++;
                        Sortlistitem.create({ordernum : ordernumber, name : listitem.name, image : listitem.image, description : listitem.description, sortlistid : newlyCreated.id}, function(err, newlyCreatedItem){
 



                        });
                        
        
                    }


                    );


                }
                );
                //redirect back to campgrounds page
                res.redirect('back');
            }

        });
    });
    } else 
    {
        res.render("landing");        
    }
    
});


router.get("/savecompletedsortlist/:id", function(req, res){

    var sortedresult = [];

    if (res.locals.currentUser) 
    {
        if ( res.locals.currentUser.id.length == 24 && req.params.id.length == 24) {
                Sortlist.find({"userid": res.locals.currentUser._id, "_id": req.params.id}, function(err, listitems){
                    
            if(err){
                console.log(err);
            } else {
                if ( listitems ) 
                {
                // Room.find({}).sort('-date').exec(function(err, docs) { ... });
                    // res.render("viewlist",{listitems:listitems, viewingListname : req.params.id});
                    Compareresult.find({"sortlistid": req.params.id}, function (err, compareresultlist){
                      //  console.log("sorlistid=");
                      //  console.log(req.params.id);
                        Sortlistitem.find({"sortlistid": req.params.id}).sort('ordernum').exec( function(err2, sortlistitems) {
                       //     console.log("calling mergesort");
                        //    console.log(sortlistitems);
                            totalcomparisons = 0;
                            try
                            {
                                pagesent = false;
                                sortedresult = Supportcalls.mergeSort(sortlistitems, res, req.params.id, compareresultlist, 0, 100);
                                if (!!sortedresult && sortedresult.length>0)
                                {
                                    var md5array = [];
                                    var md5arrayvalue = "";
                                    var md5sortedarray = [];
                                    var md5sortedarrayvalue = "";
                                    sortedresult.forEach(function(sortedresultitem){
                                        md5sortedarray.push([sortedresultitem.name, sortedresultitem.image, sortedresultitem.description]);

                                    });   
                                    md5sortedarrayvalue = md5(JSON.stringify(md5sortedarray));

                                    var dateTime = Supportcalls.getTimeStamp();
                                    Sortlist.find({"userid": res.locals.currentUser._id, "_id": req.params.id }, function(err, listitem)
                                    {
                                        if (!!listitem)
                                        {

                                        Sortlistitem.find({"sortlistid": req.params.id}).sort([["name", 1], ["image", 1], ["description", 1]]).exec(function(err3, md5generator) 
                                        {

                                            md5generator.forEach(function(md5item){
                                                md5array.push([md5item.name, md5item.image, md5item.description]);
                                
                                            });

                                            md5arrayvalue = md5(JSON.stringify(md5array));
                                          //  Savedlist = require("./models/savedlist"),
                                           // Savedlistitem = require("./models/savedlistitem"),   
                                            var newSaved = {propertycompare : listitem[0].propertycompare , 
                                                sortname : listitem[0].sortname , 
                                                userid : listitem[0].userid, 
                                                saveddate : dateTime, 
                                                listitems_md5: md5arrayvalue,
                                                sortedorder_md5: md5sortedarrayvalue
                                            };
                                            var newSaveditem = null;
                                            var loordernum = 1;
                                            md5array = [];
                                            md5arrayvalue = "";
                                            Savedlist.countDocuments({"userid" : newSaved.userid, 
                                                                    "listitems_md5" : newSaved.listitems_md5, 
                                                                    "sortedorder_md5" : newSaved.sortedorder_md5 }, function (err, countresult){
                                                 //   console.log(countresult);

                                                    if (countresult == 0)
                                                    {
                                                        Savedlist.create(newSaved, function(err, newlycreated){
                                                            sortedresult.forEach(function(sortedresultitem)
                                                            {
                                                                newSaveditem = {ordernum : loordernum, 
                                                                        name : sortedresultitem.name, 
                                                                        image : sortedresultitem.image, 
                                                                        description: sortedresultitem.description, 
                                                                        savedlistid: newlycreated._id
                                                                    };
                                                                Savedlistitem.create(newSaveditem, function(err2, newlycreated2) 
                                                                {
            
            
            
                                                                });
                                                                loordernum++;
                                                                
                                                                
            
                                                            });
            
            
                                                        });




                                                    }
                                                   // else
                                                    //res.send("this sort list has already been saved");

                                            }

                                            
                                            );


                            
                                        }); 
                                    }
                                    //else
                                       // res.send("list not found");
                                    });  

                                    res.redirect("/");

                                   // Sortlist.updateOne({"_id": req.params.id}, {"percentcompleted": 100});

                                }
                            } catch (err) {

                              //  res.send(err.message); // lalala is not defined
                                

                            }
    
                        });

                    });


                } else {
                //console.log("length was not greater than 0");
               // console.log(listitems);

                }
            }
            });
    }
    else { console.log("invalid objectid: currentuser.id = " + res.locals.currentUser.id + " req.params.id = " + req.params.id);   }
}
});



router.get("/getsortlist/:id", function(req, res){
    var sortedresult = [];

    if (res.locals.currentUser) 
    {
        if ( res.locals.currentUser.id.length == 24 && req.params.id.length == 24) {
                Sortlist.find({"userid": res.locals.currentUser.id, "_id": req.params.id}, function(err, listitems){
                    
            if(err){
                console.log(err);
            } else {
                if ( listitems ) 
                {
                // Room.find({}).sort('-date').exec(function(err, docs) { ... });
                    // res.render("viewlist",{listitems:listitems, viewingListname : req.params.id});
                    Compareresult.find({"sortlistid": req.params.id}, function (err, compareresultlist){
                      //  console.log("sorlistid=");
                      //  console.log(req.params.id);
                        Sortlistitem.find({"sortlistid": req.params.id}).sort('ordernum').exec( function(err2, sortlistitems) {
                       //     console.log("calling mergesort");
                        //    console.log(sortlistitems);
                            totalcomparisons = 0;
                            try
                            {
                                pagesent = false;

                                sortedresult = Supportcalls.mergeSort(sortlistitems, res, req.params.id, compareresultlist, 0, 100);

                                if (!!sortedresult && sortedresult.length>0)
                                {


                            Sortlist.findOneAndUpdate({ _id: req.params.id }, { percentcompleted : 100 }, function(err, result) {
                                /*if (err) {
                                  res.send(err);
                                } else {
                                  res.send(result);
                                } */
                              });

                                    res.render("sortedresult",{sortedresult:sortedresult, totalcomparisons});
                                    
                                   // Sortlist.updateOne({"_id": req.params.id}, {"percentcompleted": 100});

                                }
                            } catch (err) {
                                if (err !=0) //using throws to get out of the recursive function since that's the only thing that works apparently
                                    console.log("error here2");


                            }
    
                        });

                    });


                } else {
                //console.log("length was not greater than 0");
               // console.log(listitems);

                }
            }
            });
    }
    else { console.log("invalid objectid: currentuser.id = " + res.locals.currentUser.id + " req.params.id = " + req.params.id);   }
    //else res.render("landing");
}
});







router.get("/deletesortlist/:id", function(req, res){
    if (res.locals.currentUser) 
    {
        Sortlist.countDocuments({"_id": req.params.id, "userid": res.locals.currentUser.id }, function (err, countresult){
            if (countresult > 0) //confirmed that the list belongs to the user logged in
            {
                Compareresult.remove({"sortlistid": req.params.id}, function(err, endresult) {
                    Sortlistitem.remove({"sortlistid": req.params.id}, function(err, endresult){
                        Sortlist.remove({"_id": req.params.id}, function(err, endresult){
                            res.redirect("/");
                        });                       

                    });

                });

            } else
            {
                res.redirect('back');
            }

        });

            
    }   else res.render("landing");


});


router.post("/sortlistdecision", function(req, res){
    //console.log("sort list decision received");
    //console.log(Date.now());

     if (res.locals.currentUser) 
    {
    //    console.log("calling 1");
        Sortlist.countDocuments({"_id" : req.body.sortitem, "userid" : res.locals.currentUser._id }, function(err, locount) {
            if (locount > 0) 
            { //list belongs to the user adding the decision
      //          console.log("calling 2");
                Sortlistitem.countDocuments({ "_id" : req.body.firstitem, "sortlistid" : req.body.sortitem  }, function(err, locount){
                    if (locount > 0) 
                    { //first item exists in the list
        //                console.log("calling 3");
                        Sortlistitem.countDocuments({ "_id" : req.body.seconditem, "sortlistid" : req.body.sortitem  }, function(err, locount)
                        {
                            if ((locount > 0) &&  ((req.body.firstitem == req.body.decisionitem) || (req.body.seconditem == req.body.decisionitem)   )) 
                            { // second item exists in the list, decision equals one or the other
          //                      console.log("calling 4");
                                Compareresult.countDocuments({"firstitem": req.body.firstitem, "seconditem": req.body.seconditem, "sortlistid": req.body.sortitem}, function(err, locount){
                                    if (locount == 0) {//decision doesn't already exist
            //                            console.log("calling 5");
                                        Compareresult.countDocuments({"firstitem": req.body.seconditem, "seconditem": req.body.firstitem, "sortlistid": req.body.sortitem}, function(err, locount){
                                            if (locount == 0) {//decision doesn't already exist
                                                    console.log("sending back to getsortlist");
                                                    console.log(Date.now());
                                                    if (req.body.firstitem == req.body.decisionitem) {
                                                        Compareresult.create({"firstitem" : req.body.firstitem, "seconditem" : req.body.seconditem, "sortlistid" : req.body.sortitem, "result" : 1, "reason": req.body.reason}, function(err, newlyCreatedItem){
                                                            res.redirect('/getsortlist/' + req.body.sortitem);
                                                        });
                                                    } else {
                                                        Compareresult.create({"firstitem" : req.body.firstitem, "seconditem" : req.body.seconditem, "sortlistid" : req.body.sortitem, "result" : -1, "reason": req.body.reason }, function(err, newlyCreatedItem){
                                                            res.redirect('/getsortlist/' + req.body.sortitem);
                                                        });
                                                        
                                                    }
 
                                                    
                                                } else {

              //                                      console.log("decision already recorded");
                                                }
                                            });
        
        
                                        } else {
                //                            console.log("decison already recorded")
                                        };

                                    });


                                } else {

                  //                  console.log("second item exists in the list and decision equals one of the 2 sent");
                                }
                                    



                                });

                            } else {

                    //            console.log("first item exists in the list");
                            }

                        });


                    } else {
                   //     console.log("item doesnt belong to user");
                    }


                });


            }
            else {
         //       console.log("user not logged in");
            }

        });


        router.get("/publishunsortedlist/:id", function(req, res){
            var sortedresult = [];
            var erroroccurred = false;
            var errortext = "";

            if (res.locals.currentUser) 
            {
                if ( res.locals.currentUser.id.length == 24 && req.params.id.length == 24) {
                        Sortlist.find({"userid": res.locals.currentUser._id, "_id": req.params.id}, function(err, listitems){
                            
                    if(err){
                        console.log(err);
                    } else {
                        if ( listitems ) 
                        {
                        // Room.find({}).sort('-date').exec(function(err, docs) { ... });
                            // res.render("viewlist",{listitems:listitems, viewingListname : req.params.id});
                          //  Compareresult.find({"sortlistid": req.params.id}, function (err, compareresultlist){
                              //  console.log("sorlistid=");
                              //  console.log(req.params.id);
                                Sortlistitem.find({"sortlistid": req.params.id}).sort([["name", 1], ["image", 1], ["description", 1]]).exec( function(err2, sortlistitems) {
                               //     console.log("calling mergesort");
                                //    console.log(sortlistitems);
                                    totalcomparisons = 0;
                                    try
                                    {
                                        pagesent = false;
                                        sortedresult = sortlistitems; //Supportcalls.mergeSort(sortlistitems, res, req.params.id, compareresultlist, 0, 100);
                                        if (!!sortedresult && sortedresult.length>0)
                                        {
                                            var md5array = [];
                                            var md5arrayvalue = "";
                                            var md5sortedarray = [];
                                            var md5sortedarrayvalue = "";
                                            sortedresult.forEach(function(sortedresultitem){
                                                md5sortedarray.push([sortedresultitem.name, sortedresultitem.image, sortedresultitem.description]);
        
                                            });   
                                            md5sortedarrayvalue = md5(JSON.stringify(md5sortedarray));
        
                                            var dateTime = Supportcalls.getTimeStamp();
                                            Sortlist.find({"userid": res.locals.currentUser._id, "_id": req.params.id }, function(err, listitem)
                                            {
                                                if (!!listitem)
                                                {
        
                                                Sortlistitem.find({"sortlistid": req.params.id}).sort([["name", 1], ["image", 1], ["description", 1]]).exec(function(err3, md5generator) 
                                                {
        
                                                    md5generator.forEach(function(md5item){
                                                        md5array.push([md5item.name, md5item.image, md5item.description]);
                                        
                                                    });
        
                                                    md5arrayvalue = md5(JSON.stringify(md5array));
                                                    md5sortedarrayvalue = md5(JSON.stringify(md5array));
                                                  //  Savedlist = require("./models/savedlist"),
                                                   // Savedlistitem = require("./models/savedlistitem"),   
                                                    var newSaved = {propertycompare : listitem[0].propertycompare , 
                                                        sortname : listitem[0].sortname , 
                                                        userid : listitem[0].userid, 
                                                        saveddate : dateTime, 
                                                        listitems_md5: md5arrayvalue,
                                                        sortedorder_md5: md5sortedarrayvalue
                                                    };
                                                    var newSaveditem = null;
                                                    var loordernum = 1;
                                                    md5array = [];
                                                    md5arrayvalue = "";
                                                    Savedlist.countDocuments({/*"userid" : newSaved.userid, */ 
                                                                            "listitems_md5" : newSaved.listitems_md5,
                                                                            "unpublished": { $ne: true } /*, 
                                                "sortedorder_md5" : newSaved.sortedorder_md5 */ }, function (err, countresult){
                                                         //   console.log(countresult);
        
                                                            if (countresult == 0)
                                                            {
                                                                Savedlist.create(newSaved, function(err, newlycreated){
                                                                    sortedresult.forEach(function(sortedresultitem)
                                                                    {
                                                                        newSaveditem = {ordernum : loordernum, 
                                                                                name : sortedresultitem.name, 
                                                                                image : sortedresultitem.image, 
                                                                                description: sortedresultitem.description, 
                                                                                savedlistid: newlycreated._id
                                                                            };
                                                                        Savedlistitem.create(newSaveditem, function(err2, newlycreated2) 
                                                                        {
                    
                    
                    
                                                                        });
                                                                        loordernum++;
                                                                        
                                                                        
                    
                                                                    });
                    
                    
                                                                });
        
        
        
        
                                                            }
                                                            else
                                                            {
                                                                erroroccurred = true;
                                                                errortext = "this sort list has already been saved";
                                                               // console.log("this sort list is already published");
                                                                

                                                            }
        
                                                    }
        
                                                    
                                                    );
        
        
                                    
                                                }); 
                                            }
                                            //else
                                               // res.send("list not found");
                                            });  
                                            if (!erroroccurred)
                                                res.redirect("/");
                                            else
                                                res.send(errortext);
        
                                           // Sortlist.updateOne({"_id": req.params.id}, {"percentcompleted": 100});
        
                                        }
                                    } catch (err) {
        
                                      //  res.send(err.message); // lalala is not defined
                                        
        
                                    }
            
                                });
        
                         //   });
        
        
                        } else {
                        //console.log("length was not greater than 0");
                       // console.log(listitems);
        
                        }
                    }
                    });
            }
            else { console.log("invalid objectid: currentuser.id = " + res.locals.currentUser.id + " req.params.id = " + req.params.id);   }
        }
        });

        module.exports = router;
