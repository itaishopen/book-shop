function saveToLocalStorage(key, value) {
    let str = JSON.stringify(value);
    localStorage.setItem(key, str);
}

function loadFromLocalStorage(key) {
    let str = localStorage.getItem(key);
    if (!str) return;
    return JSON.parse(str);
}