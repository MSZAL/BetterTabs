function domain (tab) {
    var x = tab.url.split("/");
    return x[2];
}

function sort () {
    chrome.tabs.query( {
	currentWindow: true
    }, function (tab) {
	var sites = [];
	for (var i = 0; i < tab.length; i++){
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

	    inList = false;
	}

	var count = 0;
	
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

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    sort();
});
