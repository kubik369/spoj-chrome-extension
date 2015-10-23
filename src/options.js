function loadOptions() {
	var form = document.getElementById("mainForm");
	console.log("LOAD", localStorage["problemNumber"], localStorage["problemPoints"], localStorage["pointsProblemSet"]);
	console.log(typeof(localStorage["pointsProblemSet"]) + " " + localStorage["pointsProblemSet"]);
	form.elements[0].checked = localStorage["problemNumber"] == "true" ? true : false;
	form.elements[1].checked = localStorage["problemPoints"] == "true" ? true : false;
	form.elements[2].checked = localStorage["pointsProblemSet"] == "true" ? true : false;
	console.log("settings loaded");
}

function saveOptions() {
	var form = document.getElementById("mainForm");
	localStorage["problemNumber"] = form.elements[0].checked == true ? "true" : "false";
	localStorage["problemPoints"] = form.elements[1].checked == true ? "true" : "false";
	localStorage["pointsProblemSet"] = form.elements[2].checked == true ? "true" : "false";
	console.log("SAVE", localStorage["problemNumber"], localStorage["problemPoints"], localStorage["pointsProblemSet"]);
	location.reload();
}

document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById("save").addEventListener('click', saveOptions);