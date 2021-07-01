
const startShowDrawio = () => {
    // instead of making makeCall on meteor (backend) just display

    
    demo();
};

function demo() {
    var syncFetch = true;
    setTimeout(function() {
        var iframe = document.getElementById('draw-io-iframe').contentWindow;
        elements = iframe.document.getElementsByClassName("geButton");

        for (let i = 0; i < elements.length; i++) {
            if (elements[i].title == 'Online' || elements[i].title == 'Disconnected') {
                eTitle = elements[i];
                eTitle.click();
            }
        }
        if (syncFetch) {
            demo();
        }
    }, 3000)

    
}

export {
    startShowDrawio,
};