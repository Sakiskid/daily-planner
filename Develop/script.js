var currentTimeEl = $("#currentTime");
var currentDayEl = $("#currentDay");
var timeblockTemplateEl = $("#timeblockTemplate");
var timeblockContainer = $("#timeblockContainer");

function init() {
    populateTimeblockWithTemplates();
    populateNavbarScrollspy();
    setInitTimes();
}

function setInitTimes() {
    let m = moment();
    currentDayEl.text(m.format("dddd, MMMM Do YYYY"));

    // Current second SetInterval
    setInterval(() => {
        m = moment();
        currentTimeEl.text(m.format("HH:mm:ss"));
    }, 1000);
    // Current minute SetInterval
    setInterval(() => {
        updateTheHour();
    }, 60000);

    updateTheHour();
}

function getTimeblockLocalstorage(key) {
    // See if the key exists, and return the value if so
    if (localStorage.getItem(key)) {
        return localStorage.getItem(key);
    }
    // Otherwise, create an empty key
    else {
        localStorage.setItem(key, "");
    }
}

function populateTimeblockWithTemplates() {
    // In this function, we should:
    // 1. Clone the timeblock template for each hour of the day
    // 2. Assign an individual ID for each hour in military time
    let m = moment();
    m.hour(0);
    for (let i = 0; i < 24; i++) {
        var newBlock = timeblockTemplateEl.clone();
        var currentHourString = "timeblockHour" + i;

        // Setting ID of newBlock
        newBlock.removeAttr("id");
        newBlock.attr("id", currentHourString);

        // Setting Hour
        var hourEl = newBlock.find(".hour");
        m.hour(i);
        hourEl.text(m.format("HH"));

        // Setting Input / Initializing localStorage
        newBlock.find("input").attr("value", getTimeblockLocalstorage(currentHourString));

        timeblockContainer.append(newBlock);
    }
    // Remove the initial timeblock Template
    timeblockTemplateEl.remove();
}

function populateNavbarScrollspy() {
    // For a better understanding of this function, look at populateTimeblockWithTemplates()
    var navItemTemplateEl = $("#navItemTemplate");
    var navEl = $(".nav");
    for (let i = 0; i < 24; i++) {
        // Set ID of new nav item
        var newNavItem = navItemTemplateEl.clone();
        var currentNavItemIDString = "navItem" + i;
        newNavItem.removeAttr("id");
        newNavItem.attr("id", currentNavItemIDString);

        // Add href attr for corresponding timeblock id
        var navItemButton = newNavItem.find("a");
        navItemButton.attr("href", "#timeblockHour" + i);
        navItemButton.text(i);

        navEl.append(newNavItem);
    }
    navItemTemplateEl.remove();
}

function updateTheHour() {
    var timeblocks = $(".timeblockRow");
    m = moment();

    for (let i = 0; i < 24; i++) {
        timeblocks.get(i).classList.remove("past");
        timeblocks.get(i).classList.remove("present");
        timeblocks.get(i).classList.remove("future");

        if (i < m.hour()) {
            // add past class
            timeblocks.get(i).classList.add("past");
        }
        else if (i === m.hour()) {
            // add present class
            timeblocks.get(i).classList.add("present");
        }
        else {
            // add future class
            timeblocks.get(i).classList.add("future");
        }
    }
}

init();