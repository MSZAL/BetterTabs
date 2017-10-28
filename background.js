
function Node () {
    this.data = null;
    this.next = null;
}


function Node (data) {
    this.data = data;
    this.next = null;
}


function Node (data,next) {
    this.data = data;
    this.next = next;
}


function LinkedList () {
    this.first = null;

    this.add = function (node) {
	if (this.first == null) {
	    this.first = node;
	}
	else {
	    
	    var x = this.first;
	    
	    while (x.next != null){
		x = x.next;
	    }
	    
	    x.next = node;
	}
    };

    this.remove = function (node) {
	if (this.first != null) {
	    var past = null;
	    var current = this.first;
	    while (current != null) {
		if (current.data == node.data) {

		    if (past == null) {
			current = null;
		    }
		    else {
			past.next = current.next;
			return true;
		    }
		}
		
		past = current;
		current = current.next;
	    }

	    return false;
	}
	return false;
    };

    this.contains = function (node) {
	var x = this.first;
	
	while (x != null){
	    if (x.data == node.data){
		return true;
	    }
	    x = x.next;
	}
	return false;
    };
}


/* Linked List Example
var linkedList = new LinkedList();
linkedList.first = new Node("hello");
linkedList.add(new Node("ready"));
alert(linkedList.first);
alert(linkedList.first.data);
linkedList.remove(new Node("ready"));
alert(linkedList.contains(new Node("hello")));
alert(linkedList.contains(new Node("ready")));
*/

var data = new LinkedList();

function constructData (sites, tab) {

    for (var i = 0; i < sites.length; i++){
	var tmp = new Node([sites[i],new LinkedList()]);
	data.add(tmp);
    }

    var x = data.first;

    alert(x);

    while (x != null) {

	var y = x.data[1];
	
	for (var j = 0; j < tab.length; j++){
	    y.add(tab[j]);
	}
	x = x.next;
    }
}

function domain (tab) {
    var x = tab.url.split("/");
    return x[2];
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

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    sort();
});
