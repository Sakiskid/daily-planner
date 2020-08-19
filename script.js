var currentTimeEl = $("#currentTime");
var currentDayEl = $("#currentDay");
var timeblockTemplateEl = $("#timeblockTemplate");
var timeblockContainer = $("#timeblockContainer");

var usingMilitaryTime = false;
var showingPastTasks = true;

function init() {
    initializeSettingsCheckboxes();
    populateTimeblockWithTemplates();
    populateNavbarScrollspy();
    setInitTimes();
    hideOrShowPastTasks();
}

function setInitTimes() {
    let m = moment();
    currentDayEl.text(m.format("dddd, MMMM Do YYYY"));

    // Current second SetInterval
    setInterval(() => {
        m = moment();
        if (usingMilitaryTime) { currentTimeEl.text(m.format("HH:mm:ss")); }
        else { currentTimeEl.text(m.format("hh:mm:ss")); }
    }, 1000);
    // Current minute SetInterval
    setInterval(() => {
        updateTheHour();
    }, 60000);

    updateTheHour();
}

function getLocalStorage(key, value) {
    // See if the key exists, and return the value if so
    if (localStorage.getItem(key)) {
        return localStorage.getItem(key);
    }
    // Otherwise, create an empty key
    else {
        localStorage.setItem(key, value || "");
        return localStorage.getItem(key);
    }
}

function initializeSettingsCheckboxes() {
    usingMilitaryTime = JSON.parse(getLocalStorage("usingMilitaryTime", true));
    document.getElementById("militaryTimeCheckbox").checked = usingMilitaryTime;

    showingPastTasks = JSON.parse(getLocalStorage("showingPastTasks", true));
    document.getElementById("showPastTasksCheckbox").checked = showingPastTasks;
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

        // DEPRECATED Setting Hour
        var hourEl = newBlock.find(".hour");
        m.hour(i);
        
        // Setting Input / Initializing localStorage
        newBlock.find("input").attr("value", getLocalStorage(currentHourString));
        
        // Display
        hourEl.text(getHourInCurrentTimeFormat(i));
        timeblockContainer.append(newBlock);
    }
    // Remove the initial timeblock Template
    timeblockTemplateEl.remove();
}

function populateNavbarScrollspy() {
    // For a better understanding of this function, look at populateTimeblockWithTemplates()
    var navItemTemplateEl = $("#navItemTemplate");
    var navEl = $(".nav");
    let m = moment();
    for (let i = 0; i < 24; i++) {
        // Set ID of new nav item
        var newNavItem = navItemTemplateEl.clone();
        var currentNavItemIDString = "navItem" + i;
        newNavItem.removeAttr("id");
        newNavItem.attr("id", currentNavItemIDString);

        // DEPRECATED Using moment here to populate using military time
        // m.hour(i);
        // let newText = m.format("HH");

        // Add href attr for corresponding timeblock id
        var navItemButton = newNavItem.find("a");
        navItemButton.attr("href", "#timeblockHour" + i);
        
        // Display
        navItemButton.text(getHourInCurrentTimeFormat(i));
        navEl.append(newNavItem);
    }
    navItemTemplateEl.remove();
}

function updateTimeFormatInNavbarAndTimeblock() {
    $(".timeblockRow .hour").text(getHourInCurrentTimeFormat);
    $("nav a").text(getHourInCurrentTimeFormat);
}

function hideOrShowPastTasks() {
    var scrollspyLists = document.getElementsByClassName("nav-item");

    if(!showingPastTasks) {
        $(".past").css("display", "none");

        for (let i = 0; i < scrollspyLists.length; i++) {
            if (i < moment().hour()) { 
                scrollspyLists[i].style.display = "none";
            }
        }
    }
    else if (showingPastTasks) {
        $(".past").css("display", "flex");
        $(scrollspyLists).css("display", "flex");
    }
}

function getHourInCurrentTimeFormat(hourIndex){
    // hour index is 0-23
    let m = moment();
    m.hour(hourIndex);

    if(usingMilitaryTime){
        return m.format("HH");
    }
    else if (!usingMilitaryTime){
        return m.format("ha");
    }
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
    hideOrShowPastTasks();
}

function saveTimeblockToLocalStorage() {
    // console.log("Saving timeblock to local storage. Button pressed: ", this);
    var thisTimeblock = $(this).parents(".timeblockRow")[0];
    var thisTimeblockID = $(thisTimeblock).attr("id");
    var input = $(thisTimeblock).find("input").val();
    localStorage.setItem(thisTimeblockID, input);
}

// Using the event listener on Document, then selecting .saveBtn
// This way it catches dynamically added elements
$(document).on("click", ".saveBtn i", saveTimeblockToLocalStorage);

$("#militaryTimeCheckbox").click(function () {
    usingMilitaryTime = this.checked;
    localStorage.setItem("usingMilitaryTime", usingMilitaryTime);
    updateTimeFormatInNavbarAndTimeblock();
});

$("#showPastTasksCheckbox").click(function () {
    showingPastTasks = this.checked;
    localStorage.setItem("showingPastTasks", showingPastTasks);
    hideOrShowPastTasks();
});

init();