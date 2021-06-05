var express = require("express");
var router  = express.Router({mergeParams: true}),
Compareresult = require("../models/compareresult"),
Sortlistitem = require("../models/sortlistitem"),
Sortlist = require("../models/sortlist");

router.get("/editsortlist/:id", function(req, res){

    if (res.locals.currentUser) 
    {
        if ( res.locals.currentUser.id.length == 24 && req.params.id.length == 24) {
            Sortlist.find({"userid": res.locals.currentUser.id, "_id": req.params.id}, function(err, listitem){
                Sortlistitem.find({"sortlistid": req.params.id}, function(err, listitems){
                    if (listitems) 
                    {
                        var sortitemindexes = [];
                        Compareresult.find({"sortlistid": req.params.id }, function(err, comparelist) {

                            if (err) {
                                console.log(err);
                            } else {
                                for (let i = 0; i <  listitems.length; i++) { 
                                    sortitemindexes.push(listitems[i]._id.toString());
                                }

                              
                                res.render("viewdecisionlist", {listitem:listitem, listitems:listitems, comparelist:comparelist, sortitemindexes:sortitemindexes});
                            }
                        });
                    };
                });

            });
        };
    }
    else res.render("landing");
});

//deletelistitem
router.get("/deletecomparelistitem/:id", function(req, res){

    if (res.locals.currentUser) 
    {
        //console.log(res.locals.currentUser);
        //console.log(Buffer.from(req.params.id, 'hex').toString('utf8'));
        Compareresult.remove({"_id": req.params.id }, function(err, listitems){
            
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