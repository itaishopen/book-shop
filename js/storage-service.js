function saveToLocalStorage(key, value) {
    var str = JSON.stringify(value);
    localStorage.setItem(key, str);
}
function loadFromLocalStorage(key) {
    var str = localStorage.getItem(key);
    if (!str) {
        return;
    }
    return JSON.parse(str);
}