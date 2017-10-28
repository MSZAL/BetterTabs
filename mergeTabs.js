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

document.addEventListener('DOMContentLoaded', function() {
    var butt = document.getElementById('');
    // onClick's logic below:
    butt.addEventListener('click', function() {
        start();
    });
});

// Set up a click handler so that we can merge all the windows.
//chrome.browserAction.onClicked.addListener(start);
//Change this listener to react to a button press.