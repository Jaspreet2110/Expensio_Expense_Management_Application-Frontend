/*
 * Author: Nachiket Panchal
 */
export function getElement(id) {
    return document.getElementById(id);
}
export function dangerBox(m) {
    return '<div class="alert alert-danger" role="alert">' + m + "</div>";
}
export function successBox(m) {
    return '<div class="alert alert-success" role="alert">' + m + "</div>";
}
export function dissapear(el) {
    setTimeout(function () {
        if (getElement(el)) {
            getElement(el).innerHTML = "";
        }
    }, 3000);
}
export function delayedRoute(r, h) {
    setTimeout(function () {
        h.push(r);
    }, 3000);
}
