var currentTimeEl = $("#currentTime");
var currentDayEl = $("#currentDay");
var timeblockTemplateEl = $("#timeblockTemplate");
var timeblockContainer = $("#timeblockContainer");

function init() {
    setInitTimes();
    populateTimeblockWithTemplates();
}

function setInitTimes() {
    let m = moment();
    currentDayEl.text(m.format("dddd, MMMM Do YYYY"));
    // Current second SetInterval
    setInterval(() => {
        m = moment();
        currentTimeEl.text(m.format("HH:mm:ss"));
    }, 1000);
}

function populateTimeblockWithTemplates() {
    // In this function, we should:
    // 1. Clone the timeblock template for each hour of the day
    // 2. Assign an individual ID for each hour in military time
    let m = moment();
    m.hour(0);
    for(let i = 0; i < 24; i++) {
        var newBlock = timeblockTemplateEl.clone();

        // Setting ID of newBlock
        newBlock.removeAttr("id");
        newBlock.
        // Manipulation of newBlock
        var hourEl = newBlock.find(".hour");
        hourEl.text(m.format("HH"));
        m.hour(m.hour() + 1);


        timeblockContainer.append(newBlock);
    }
    // Remove the initial timeblock Template
    timeblockTemplateEl.remove();
}

init();