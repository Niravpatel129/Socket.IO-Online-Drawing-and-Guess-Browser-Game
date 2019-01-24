personname = "guest"
var ids = [];
var guessWord = "Dog"
var socket = io();
socket.on('draw', function (data) {
    ctx.beginPath();
    ctx.moveTo(data.prevX, data.prevY);
    ctx.lineTo(data.currX, data.currY);
    ctx.stroke()
    ctx.closePath();
})
var canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;

var x = "black",
    y = 2;

//DRAWING Function Below
function init() {
    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;

    //Decide who draws
    socket.emit('whodraws');
    socket.on('whodraws', function (data) {

        if (data[0] == socket.id) {
            console.log('You are allowed to draw stuff')
            letsDraw();
        } else {
            console.log('You will not be drawing today sir');
        }
    })


    function letsDraw() {
        canvas.addEventListener("mousemove", function (e) {
            findxy('move', e)
        }, false);
        canvas.addEventListener("mousedown", function (e) {
            findxy('down', e)
        }, false);
        canvas.addEventListener("mouseup", function (e) {
            findxy('up', e)
        }, false);
        canvas.addEventListener("mouseout", function (e) {
            findxy('out', e)
        }, false);
    }

    function draw() {
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currX, currY);
        ctx.strokeStyle = x;
        ctx.lineWidth = y;
        ctx.stroke();
        ctx.closePath();

    }

    function erase() {
        var m = confirm("Want to clear");
        if (m) {
            ctx.clearRect(0, 0, w, h);
            document.getElementById("canvasimg").style.display = "none";
        }
    }

    function save() {
        document.getElementById("canvasimg").style.border = "2px solid";
        var dataURL = canvas.toDataURL();
        document.getElementById("canvasimg").src = dataURL;
        document.getElementById("canvasimg").style.display = "inline";
    }

    function findxy(res, e) {
        if (res == 'down') {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;

            flag = true;
            dot_flag = true;
            if (dot_flag) {
                ctx.beginPath();
                ctx.fillStyle = x;
                ctx.fillRect(currX, currY, 2, 2);
                ctx.closePath();
                dot_flag = false;

            }

        }
        if (res == 'up' || res == "out") {
            flag = false;
        }
        if (res == 'move') {
            if (flag) {
                prevX = currX;
                prevY = currY;
                currX = e.clientX - canvas.offsetLeft;
                currY = e.clientY - canvas.offsetTop;
                draw();
            }

            socket.emit('draw', { currX, currY, prevX, prevY });

        }

    }
}



//
//


$(function () {
    person = 'bill';
    var person = prompt("Whats Your Name?");
    socket.emit('username', person);
    socket.on('username', function (value) {
        if (value == "") {
            person = "Guest"
        } else {
            person = value;
        }
    })
    $('form').submit(function (e) {
        e.preventDefault(); // prevents page reloading
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function (msg) {
        if(msg == '**CORRECT**'){
            $( "input" ).prop( "disabled", true ); //Disable Typing
            $("input").attr("placeholder", "YOU GOT IT RIGHT!!!!!");
            $("input").css("background-color", "yellow")
        }else{
            message2 = "<b>" + person + "</b>" + ": " + msg;
            $('#messages').append($('<ol>').html(message2));
        }

        
    });
});