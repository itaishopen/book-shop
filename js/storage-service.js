function saveToLocalStorage(key, value) {
    var str = encryptStr(JSON.stringify(value));
    localStorage.setItem(key, str);
}
function loadFromLocalStorage(key) {
    var str = localStorage.getItem(key);
    if (!str) {
        return;
    }
    return JSON.parse(decryptStr(str));
}

function saveToSessionStorage(key, value) {
    var str = encryptStr(JSON.stringify(value));
    sessionStorage.setItem(key, str);
}

function loadFromSessionStorage(key) {
    var str = sessionStorage.getItem(key);
    if (!str) {
        return;
    }
    return JSON.parse(decryptStr(str));
}

function credentials(str) {
    window.sessionStorage.setItem(str, 'true');
}

function revokeCredentials(str) {
    window.sessionStorage.removeItem(str);
}