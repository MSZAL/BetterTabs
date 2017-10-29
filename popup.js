
document.addEventListener('DOMContentLoaded', function () {
    var link = document.getElementById("close_tabs");
    var link2 = document.getElementById("organize");
    
    link.addEventListener('click', function () {
	getActiveTab(removeTabs);
    });

    link2.addEventListener('click', function () {
	sort();
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


function sort () {
    var pinnedTabs = 0;
    
    chrome.tabs.query( {
	   currentWindow: true,
    }, function (tab) {
	   var sites = [];
	   for (var i = 0; i < tab.length; i++){
	       if (tab[i].pinned) {
               pinnedTabs++;
	       }
	       else {
               var d = domain(tab[i]);
               var inList = false;
		
               for (var l = 0; l < sites.length; l++){
                   if (sites[l] == d){
                       inList = true;
                   }
               }
               if (!inList) {
                   sites.push(domain(tab[i]));
               }
           }
       }

        var count = pinnedTabs;
	
        for (var k = 0; k < sites.length; k++){
            //alert(sites[k]);
            for (j = 0; j < tab.length; j++){   
                if (sites[k] == domain(tab[j])) {
                    chrome.tabs.move(tab[j].id,{index:count++});
                }
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
