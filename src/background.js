//utility function for exact regex matching
function matchExact(r, str) {
   var match = str.match(r);
   return match != null && str == match[0];
}

//utility function to get the points.
function getpoints(accepted_count)
{
    return (80/(40+accepted_count)).toFixed(2);
}

//get the url currently opened
var loc = $(location).attr('href');

//Regex for knowing where the user is
var prob_page = new RegExp("^http:\/\/www.spoj.com\/problems\/classical\/*.+$");
var spec_page = new RegExp("^http:\/\/www.spoj.com\/problems\/[A-Z0-9]+\/$");

//if the user is viewing classical problems
if(matchExact(prob_page,loc))
{
  var problem_table = $("table.problems")[0];
  if(problem_table.rows[1].cells.length == 6){ //user is logged in
    var prob_name_ind = 2; // Problem's name is on the 2nd column      
  }
  else{
    var prob_name_ind = 1;
  }
  var prob_users_ind = prob_name_ind + 2; //Problem's accepted user count is here

  //Number of rows of the problemset table
  num = problem_table.rows.length;
  //insert a whole new column - cell for each row
  for(var i = 0;i < num;i++)
    problem_table.rows[i].insertCell(4);

  //change the first normal cell to header cell
  problem_table.rows[0].cells[4].outerHTML = problem_table.rows[0].cells[4].outerHTML.replace("td", "th");
  
  //add attributes to the header cell to make it look as the adjacent cells
  problem_table.rows[0].cells[4].setAttribute("width", "50");
  problem_table.rows[0].cells[4].setAttribute("class", "text-center valign-middle");
  problem_table.rows[0].cells[4].innerHTML = problem_table.rows[0].cells[5].innerHTML;
  problem_table.rows[0].cells[4].getElementsByTagName("a")[0].innerHTML = "POINTS";
  problem_table.rows[0].cells[4].getElementsByTagName("a")[0].setAttribute("title", "The number of points you will get for solving this problem. Click here to sort.");
  
  //add the points to the new blank cells
  for(i = 1; i <= num-1 ; i++){
    //copy the cell to the right (Users)
    problem_table.rows[i].cells[4].outerHTML = problem_table.rows[i].cells[5].outerHTML;
    problem_table.rows[i].cells[4].innerHTML = problem_table.rows[i].cells[5].innerHTML;
    //get number of users who solved the problem
    prob_users = problem_table.rows[i].cells[4].getElementsByTagName("a")[0].innerHTML;
    //get points
    parsed_points = getpoints(parseInt(prob_users));
    //write the points into the cell of the newly created column
    problem_table.rows[i].cells[4].getElementsByTagName("a")[0].innerHTML = parsed_points.toString();
  }
}

//If user is viewing a particular problem
if(matchExact(spec_page,loc))
{
    //Get the problem code DOM element (Problem code can be parsed via the current page's url , but as we later need to modify the DOM element it we'll stick with the current method)
    //check, whether the problem is a classical problem or a challenge
    var atags = $("a");
    var challenge = false;
    for(var i = 0;i < atags.length;++i){
      if(atags[i].text === "challenge")
        challenge = true;
    }
    var code_obj = $("#problem-name");
    var code = "";
    var i = 0;
    //parse the problem code
    while(code_obj.html().toString().charAt(i) != "\ "){
      code += code_obj.html().toString().charAt(i);
      i++;
    }
    var page_code;

    //We need the number of accepted users in order to calculate the points.
    //But that data is not available on the current page, So we need to get the HTML data from the  'Best solutions' page for the current problem
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/ranks/"+code+"/", true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        page_code = String(xhr.responseText); //page_code now has the entire HTML code for this page(the 'Best Solutions' page)
        var zz = $(page_code); // Parse DOM
        //Get the Users Accepted DOM element
        var ranking_table = zz.find("table")[0];
        //Get the points and append them under the problem tags
        var points;
        if(challenge == false){
          points = getpoints(parseInt(ranking_table.rows[1].cells[0].innerText));
          $("#problem-tags").append("<br>" + points + " points");
        }
        else{
          points = ranking_table.rows[1].cells[0].innerText;
          $("#problem-tags").append("<br>" + points + " solvers");
        }   
      }
    }
    xhr.send();
}
