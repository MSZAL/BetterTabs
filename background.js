/*
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


Linked List Example
var linkedList = new LinkedList();
linkedList.first = new Node("hello");
linkedList.add(new Node("ready"));
alert(linkedList.first);
alert(linkedList.first.data);
linkedList.remove(new Node("ready"));
alert(linkedList.contains(new Node("hello")));
alert(linkedList.contains(new Node("ready")));


var data = new LinkedList();

function constructData (sites, tab, pinnedTabs) {

    for (var i = 0; i < sites.length; i++){
	var tmp = new Node([sites[i],new LinkedList()]);
	//console.log(tmp.data[0] + " " + tmp.data[1]);
	data.add(tmp);
    }

    var x = data.first;
    
    while (x != null) {

	var y = x.data[0];
	var z = x.data[1];
	alert(y);
	alert(z);
	
	for (var j = pinnedTabs; j < tab.length; j++){
	    if (y == domain(tab[j])
		z.add(tab[j]);
	}
        
	x = x.next;
    }
}


constructData(["google.com"],["tab1"]);
*/

function start(tab) {
  chrome.windows.getCurrent(getWindows);
}

function getWindows(win) {
  targetWindow = win;
  chrome.tabs.getAllInWindow(targetWindow.id, getTabs);
}

function getTabs(tabs) {
  tabCount = tabs.length;
  // We require all the tab information to be populated.
  chrome.windows.getAll({"populate" : true}, moveTabs);
}

function moveTabs(windows) {
  var numWindows = windows.length;
  var tabPosition = tabCount;

  for (var i = 0; i < numWindows; i++) {
    var win = windows[i];

    if (targetWindow.id != win.id) {
      var numTabs = win.tabs.length;

      for (var j = 0; j < numTabs; j++) {
        var tab = win.tabs[j];
        // Move the tab into the window that triggered the browser action.
        chrome.tabs.move(tab.id,
            {"windowId": targetWindow.id, "index": tabPosition});
        tabPosition++;
		// fix pinned tabs
		if(tab.pinned==true){chrome.tabs.update(tab.id, {"pinned":true});}
      }
    }
  }
}


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    chrome.storage.sync.get("data", function (items) {
        if (!chrome.runtime.error) {
            if (items.data){
                sort();
            }
        }
    });
});


function domain (tab) {
    var x = tab.url.split("/");
    return x[2];
}

var sites = [];

function sort () {
    var pinnedTabs = 0;
    
    chrome.tabs.query( {
	   currentWindow: true,
    }, function (tab) {
	   sites = [];
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


chrome.commands.onCommand.addListener(function(command) {
    console.log('Command:', command);
});


var tabsToMove = [];

function newWindow () {
    alert("TEST");
    chrome.tabs.query( {
        currentWindow: true
    }, function (tab) {
        var current;
        for (var l = 0; l < tab.length; l++){
            if (tab[l].active == true){
                current = domain(tab[l].url);
            }
        }
        for (var i = 0; i < tab.length; i++){
            if (!(tab[i].pinned)) {
                if (domain(tab[i].url) == current){
                    tabsToMove.push(tab[i]);
                }
            }
        }
        
        if (tabsToMove.length > 0) {
            /* Create a new window with the same
             * location and size as the original */
            chrome.windows.create({
                top: oldWin.top,
                left: oldWin.left,
                width: oldWin.width,
                height: oldWin.height,
                focused: false
            }, function(newWin) {
                /* Remove the new, empty tab created by default */
                chrome.tabs.query({
                    windowId: newWin.id
                }, function(tabsToClose) {
                    /* Update the window's state (e.g. "maximized") */
                    chrome.windows.update(newWin.id, { state: oldWin.state });

                    /* Move the tabs to the newly created window */
                    chrome.tabs.move(tabsToMove, {
                        windowId: newWin.id,
                        index: -1
                    }, function() {
                        /* Close any tabs that pre-existed (i.e. 1 empty tab)
                         * [Do not do this BEFORE moving the tabs,
                         *  or the window will be empty and will close] */
                        var lastIdx = tabsToClose.length - 1;
                        tabsToClose.forEach(function(t, idx) {
                            chrome.tabs.remove(t.id);
                            if (idx === lastIdx) {
                                chrome.windows.update(oldWin.id, {
                                    focused: true
                                });
                            }
                        });
                    });
                });
            });
        }
    });
}

