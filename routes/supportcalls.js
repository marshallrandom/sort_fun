var Sortlist = require("../models/sortlist");
 
 function mergeSort(unsortedArray, res, sortlistid, compareresultlist, beginpercent, endpercent) {
    if (pagesent) 
    return [];

    if (!unsortedArray) 
        return [];
    // No need to sort the array if the array only has one element or empty
    if (unsortedArray.length <= 1) {
      return unsortedArray;
    }
    // In order to divide the array in half, we need to figure out the middle
    const middle = Math.floor(unsortedArray.length / 2);

    // This is where we will be dividing the array into left and right
    const left = unsortedArray.slice(0, middle);

    const right = unsortedArray.slice(middle);


    let leftresult = mergeSort(left, res, sortlistid, compareresultlist, beginpercent, beginpercent + (3*(endpercent-beginpercent)/8)), rightresult=null;
    if (!leftresult)
        leftresult = [];

    rightresult = mergeSort(right, res, sortlistid, compareresultlist, beginpercent+ (3*(endpercent-beginpercent)/8), beginpercent+(0.75*(endpercent-beginpercent)));
    if (!rightresult)
        rightresult = [];

    // Using recursion to combine the left and right
    return merge(
      leftresult, rightresult, res, sortlistid, compareresultlist, beginpercent+(0.75*(endpercent-beginpercent)), endpercent
    );


  };

 function sortitemcompare(first, second, sortlistid, compareresultlist) {

    var returnresult = 0;
    
    if (first && second) {
    compareresultlist.forEach(function(compareitem){
         if ((first._id == compareitem.firstitem) && (second._id == compareitem.seconditem)) {
       //     console.log( "returning " + compareitem.result);
            returnresult = compareitem.result;

        } else if ((first._id == compareitem.seconditem) && (second._id == compareitem.firstitem)) {
            returnresult = -1*compareitem.result;
        }
             

        });
    }

    return returnresult;
 


};

 // Merge the two arrays: left and right
 function merge (left, right, res, sortlistid, compareresultlist, beginpercent, endpercent) {
    if (pagesent) 
      return [];
   // console.log("merge " + beginpercent + " " + endpercent);
  let resultArray = [], leftIndex = 0, rightIndex = 0;
  var compareresultvalue = -2;

 // if (!left || !right)
 //     return null;
 if (!left)
  left = [];
 if (!right)
 right = [];
 var highestlength;
 if (left.length<right.length)
      highestlength = right.length;
 else
      highestlength = left.length;

  // We will concatenate values into the resultArray in order
  while (leftIndex < left.length && rightIndex < right.length && compareresultvalue != 0) {
    //  console.log("about to compare, left item is ");
    //  console.log(left[leftIndex]);
    //  console.log("about to compare, right item is ");
    //  console.log(right[rightIndex]);
    //  console.log("about to compare, sorrlistid is");
    //  console.log(sortlistid);
      totalcomparisons = totalcomparisons + 1;
      compareresultvalue = sortitemcompare(left[leftIndex], right[rightIndex], sortlistid, compareresultlist);

      //    console.log("compareresult value = " + compareresultvalue);

    if (compareresultvalue == -1) {
      resultArray.push(left[leftIndex]);
      leftIndex++; // move left array cursor
    } else if (compareresultvalue == 1) {
      resultArray.push(right[rightIndex]);
      rightIndex++; // move right array cursor
    } else if (compareresultvalue==0) {  

      //  console.log("calling sortlist.find userid=" + res.locals.currentUser.id + " _id = " + sortlistid );  
      //  console.log("left=");
      //  console.log(left[leftIndex]);
      //  console.log("right=");
      //  console.log(right[rightIndex]);
      //  console.log(sortlistid.length + " " + sortlistid);
          Sortlist.findById(sortlistid, function(err, sortitem){
              if (err)
                  console.log(err);
              else {
        //      console.log("sending question");
        //      console.log(sortitem);
              if ( !res.headersSent && !pagesent )
              {

                      //percentcomplete = beginpercent + Number(rightIndex * (endpercent - beginpercent)/highestlength);
                      if ( (rightIndex/right.length) > (leftIndex/left.length) ) 
                      {
                          sortitem.percentcompleted = beginpercent + Number((((rightIndex + (leftIndex/left.length))/right.length)) * (endpercent - beginpercent));
                          sortitem.save();

                          res.render("sortquestion",{firstitem:left[leftIndex], seconditem:right[rightIndex], sortitem:sortitem, percentcomplete: beginpercent + Number((((rightIndex + (leftIndex/left.length))/right.length)) * (endpercent - beginpercent))});

                      }
                          else
                      {
                          sortitem.percentcompleted = beginpercent + Number((((leftIndex + (rightIndex/right.length))/left.length)) * (endpercent - beginpercent));
                          sortitem.save();


                          res.render("sortquestion",{firstitem:left[leftIndex], seconditem:right[rightIndex], sortitem:sortitem, percentcomplete: beginpercent + Number((((leftIndex + (rightIndex/right.length))/left.length)) * (endpercent - beginpercent))});
                      }
                     // percentcomplete = beginpercent + Number(leftIndex * (endpercent - beginpercent)/highestlength);
                 //     res.render("sortquestion",{firstitem:left[leftIndex], seconditem:right[rightIndex], sortitem:sortitem, percentcomplete});
                  
                  pagesent = true;
              }


              //return null; 
              //break;
              };
          });
          throw 0;
          return [];    
    }
      else
      {
          console.log("else condition");
      };


  }
  //console.log("checking if compareresultvalue != 0: " + compareresultvalue);
  //console.log("left is (before concat)");
  //console.log(left);
  //console.log("right is (before concat)");
  //console.log(right);
  if (compareresultvalue != 0 && compareresultvalue != -2)
  // We need to concat to the resultArray because there will be one element left over after the while loop
  return resultArray
          .concat(left.slice(leftIndex))
          .concat(right.slice(rightIndex));
  else
      return [];
};


module.exports = {
    getTimeStamp:  function() {
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var lohour = today.getHours();
        var lominutes = today.getMinutes();
        var loseconds = today.getSeconds();
        if (lohour> 9)
            lohour = "0" + lohour;
        if (lominutes > 9)
            lominutes = "0" + lominutes;
        if (loseconds > 9)
            loseconds = "0" + loseconds;
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        return dateTime;
    
    
    }, 



    mergeSort:  function(unsortedArray, res, sortlistid, compareresultlist, beginpercent, endpercent) {
        return mergeSort(unsortedArray, res, sortlistid, compareresultlist, beginpercent, endpercent);
    
    
      }



};
