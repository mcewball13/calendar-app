var tasks = {};
var loadDateTime = setInterval(() => {
    $("#currentDay").text(moment().format("dddd, MMMM Do h:mm:ss a"));
    auditTasks();
}, 1000);

// get current hour from moment in military time hour only
let currentTime = moment();
currentTime = moment().format("k");
// Check each block to see what color class it needs
var auditTasks = function () {
    $(".row").each(function () {
        let rowTime = $(this).attr("data-time-block").replace("time", "");
        if (rowTime < currentTime) {
            $(this).children(".description").addClass("past");
        } else if (rowTime > currentTime) {
            $(this).children(".description").addClass("future");
        } else {
            $(this).children(".description").addClass("present");
        }
    });
};
// initial call for coloring on page load
auditTasks();

// appply the text to the DOM 
var createTask = (timeBlock, taskText) => {
    $(`[data-time-block="${timeBlock}"] .description`).append(taskText);

};
// initial array check and load
var loadTasks = () => {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    if (!tasks) {
        tasks = {
            time07: "",
            time08: "",
            time09: "",
            time10: "",
            time11: "",
            time12: "",
            time13: "",
            time14: "",
            time15: "",
            time16: "",
            time17: "",
            time18: "",
        };
    }
    // loops through each array item and print them to the DOM 
    $.each(tasks, function (timeBlock, value) {
        createTask(timeBlock, value);
    });
};
// save to localstorage
var saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};
// click event listeners 
$(".container").on("click", ".description", function () {
    // when user clicks off of the clicked field
    $(".container").on("blur", "textarea", function () {
        // get data ID
        var dataId = $(this).closest(".row").attr("data-time-block");

        // get text content of form
        var taskText = $(this).val().trim();
        createTask(dataId, taskText);

        // recreate span element
        var descriptionEl = $("<span>").addClass("col-8 col-sm-9 description");
        $("textarea").replaceWith(descriptionEl);
        descriptionEl.textContent = taskText;

        // create task in DOM
        createTask(dataId, taskText);
        tasks[dataId] = taskText;
        auditTasks();
        return saveTasks();
    });
    // grab the text that is already present if any
    var text = $(this).text().trim();
    // create text area and use the text for it's value
    var textInput = $("<textarea>")
        .addClass("description form-control col-8 col-sm-9")
        .val(text);
    // replace the span with the text area
    $(this).replaceWith(textInput);
    textInput.trigger("focus");
});
// redundant listener for the save button included to meet requirements
$(".container").on("click", ".saveBtn", function () {
    // get data ID
    var dataId = $(this).closest(".row").attr("data-time-block");

    // get text content of form
    var taskText = $(`[data-time-block="${dataId}"] .description`).val();

    // recreate span element
    var descriptionEl = $("<span>").addClass("col-8 col-sm-9 description");
    $("textarea").replaceWith(descriptionEl);
    descriptionEl.textContent = taskText;

    // create task in DOM
    createTask(dataId, taskText);
    auditTasks();
    return saveTasks();
});
// initial call to load tasks
loadTasks();
