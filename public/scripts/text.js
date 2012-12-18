var headerClasses = ['tasteful', 'shifted', 'echo', 'pulse'];

function rotateClass() {
    $("h1").removeClass(headerClasses.join(" "));
    $("h1").addClass(headerClasses[0]);
    headerClasses.unshift(headerClasses.pop());
}

window.setInterval(rotateClass, 5000);