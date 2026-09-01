function browserDetect() {
    var a = navigator.userAgent;
    //alert(a);
    if (a.search("Edge") >= 0) {
        return "Edge";
    } else if (a.search("Chrome") >= 0) {
        return "Chrome";
    } else if (a.search("Firefox") >= 0) {
        return "Firefox";
    } else if (a.search("Opera") >= 0) {
        return "Opera";
    } else if (a.search("Safari") >= 0) {
        return "Safari";
    }
}
