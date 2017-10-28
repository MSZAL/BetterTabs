function domain (tab) {
    var x = tab.url.split("/");
    return x[2];
}


chrome.tabs.query( {
    currentWindow: true
}, function (tab) {
    var sites = [];
    for (var i = tab.length - 1; i > 0; i--){
	sites.push(domain(tab[i]));
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
/*	
	if (!(isInArray(domain,sites)){
	    sites.push(domain);
	}
*/
