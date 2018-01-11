String.prototype.shuffle = function () {
    var a = this.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {

    console.log("something happening from the extension");

    var words = document.body.innerText.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
    console.log(words);
    var walker = document.createTreeWalker(
        document.body,  // root node
        NodeFilter.SHOW_TEXT,  // filtering only text nodes
        null,
        false
    );
    while (walker.nextNode()) {
        var curr = walker.currentNode.nodeValue;
        if (curr.trim()){  // if it's not empty(whitespaced) node
            var words = curr.split(" ");
            curr = "";
            [].forEach.call(words, function(word) {
                if (/[-\/\\^$*+()|[\]{}]/.test(word))
                    curr += word;
                else if (word.length <= 1)
                    curr += word + " ";
                else {
                    var subword = word.slice(1, -1).shuffle();
                    var jumbledword = word.charAt(0) + subword + word.charAt(word.length - 1);
                    curr += jumbledword + " ";
                }
            });
            walker.currentNode.nodeValue = curr;
        }
    }
    sendResponse({data: {}, success: true});
});
