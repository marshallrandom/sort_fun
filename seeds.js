var mongoose = require("mongoose");
var Sorter = require("./models/sorter");

var data = [
    {
        name: "test item 1", 
        image: "item 1 link",
        description: "description 1",
        listname: "testlist",
        userid: "5f4a56d3c261b57124c86f1d"
    },
    {
        name: "test item 2", 
        image: "item 2 link",
        description: "description 2",
        listname: "testlist",
        userid: "5f4a56d3c261b57124c86f1d"
    },
    {
        name: "test item 3", 
        image: "item 3 link",
        description: "description 3",
        listname: "testlist",
        userid: "5f4a56d3c261b57124c86f1d"
    },
    {
        name: "test item 4", 
        image: "item 4 link",
        description: "description 4",
        listname: "testlist",
        userid: "5f4a56d3c261b57124c86f1d"
    },
    {
        name: "test item 5", 
        image: "item 5 link",
        description: "description 5",
        listname: "testlist",
        userid: "5f4a56d3c261b57124c86f1d"
    },
    {
        name: "test item 6", 
        image: "item 6 link",
        description: "description 6",
        listname: "testlist",
        userid: "5f4a56d3c261b57124c86f1d"
    },
    {
        name: "test item 5", 
        image: "item 5 link",
        description: "description 5",
        listname: "testlist2",
        userid: "5f4a56d3c261b57124c86f1d"
    },
    {
        name: "test item 6", 
        image: "item 6 link",
        description: "description 6",
        listname: "testlist2",
        userid: "5f4a56d3c261b57124c86f1d"
    }
]

function seedDB(){
   //Remove all campgrounds
   Sorter.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed sorter!");
         //add a few campgrounds
        data.forEach(function(seed){
            Sorter.create(seed, function(err, campground){
                if(err){
                    console.log(err)
                } else {
                    console.log("added an item");
                    //create a comment
 
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;
