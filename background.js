function domain(url) {
    //splice url at third '/'
    //index = url.indexOf('/', 8);
    //return url.slice(0, index);
    var site = str.split("/");
    return site[2];
}

/*
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.query({
        currentWindow: true
    },function(tab) {
	

	
        var tabList = [];
        for (var i in tabs) {
            var i_url = domain(i.url);
            if (!(i_url in tabList)) {
                var count = i.index;
                tabList.push(i_url);
                for (var x in tabs(i.index)) {
                    if(domain(x.url) == i_url) {
                        chrome.tabs.move(x.id, {index: count++});
                    }
                }
            }
        }
    }); // End of chrome.tabs.query); 
});
*/
