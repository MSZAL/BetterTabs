
document.addEventListener('DOMContentLoaded', function () {
    var link = document.getElementById("close_tabs");
    
    link.addEventListener('click', function () {
	getActiveTab(removeTabs);
    });
    
    var site = document.getElementById("merge_windows");
    
    link.addEventListener('click', function () {
	start();
    });
});
function domain (tab) {
    var x = tab.url.split("/");
    return x[2];
}

function getActiveTab(callback) {
    chrome.tabs.query({
	active: true,
	currentWindow: true
    }, function(tab) {
	callback(tab)
    });
}

function removeTabs(tab){
    chrome.tabs.query({
	currentWindow: true
    }, function (tabs) {
	//console.log(tab[0].url == tabs[1].url);
	var x = domain(tab[0]);

	for (var i = 0; i < tabs.length; i++){
	    if (x == domain(tabs[i])){
		chrome.tabs.remove(tabs[i].id);
	    }
	}
    });
}


/*
window.onload =  function() {
    document.getElementById("close_tabs").addEventListener("click", function() {
        alert("hello");
    });
    
    document.getElementById("combine_windows").addEventListener("click", function() {
        newWindow();
    });
};
*/
