

var socket;

var usersName = '';

var userChatfixed = {};

var userChat = [];

$(document).ready(function()
{
    socket = io.connect('http://localhost:8080');
    socket.on('connect', addUser);
    socket.on('updatechat', processMessage);
    socket.on('updateusers', updateUserChat);
    socket.on('base64 file', FileProcess);
    $('#datasend').click(sendMessage);
    $('#data').keypress(processEnterPress);
    $('#userquery').keyup(userquery);

    $('#uploadfile').bind('change', function(e)
    {
        var data = e.originalEvent.target.files[0];
        sendFile(data);
    });
});



function userquery(e) {
    if ($('#userquery').val() == '') {

        $('#userid').empty();

        $.each(userChatfixed, function(key, value) {
            $('#userid').append('<div>' + key + '</div>');
        });

    }
    else {

        var queryValue = $('#userquery').val();

        var queryBasedName = {};

        for (var l = 0; l < userChat.length; l++)
			{
            if (userChat[l].startsWith(queryValue) == true) 
			{
                queryBasedName[userChat[l]] = userChat[l];
            }
        }

        if ($.isEmptyObject(queryBasedName)) {

            $('#userid').empty();
            $.each(userChatfixed, function(key, value) {
                $('#userid').append('<div>' + key + '</div>');
            });

        }
        else {

            $('#userid').empty();
            $.each(queryBasedName, function(key, value) {
                $('#userid').append('<div>' + key + '</div>');
            });

        }

    }
}



function sendFile(data) {

    var reader = new FileReader();
    reader.onload = function(evt) {
        var msg = {};
        msg.username = usersName;
        msg.file = evt.target.result;
        msg.fileName = '          ' + data.name;
        socket.emit('base64 file', msg);
    };
    reader.readAsDataURL(data);
}


function isInArray(value, array) {
    return array.indexOf(value) > -1;
}

function FileProcess( msg)
{

    var fileExtension = msg.fileName.substr((msg.fileName.lastIndexOf('.') + 1));
    var allowedImage = ['jpg', 'jpeg', 'png', 'gif'];
    if (isInArray(fileExtension, allowedImage)) 
	{

        var canv = document.createElement("canvas");
        var randomNumber = Math.floor((Math.random() * 100000) + 1);
        canv.setAttribute("id", "can_" + randomNumber);
        var ctx = canv.getContext('2d');
        var img1 = new Image();
        img1.onload = function() 
		{
            ctx.drawImage(img1, 0, 0);
        }
		
        img1.src = msg.file;
		
		document.getElementById("conversation").insertBefore(canv, document.getElementById("conversation").firstChild); 
		
		var dElem = document.createElement('sr');
	
		
        dElem.innerHTML = ("<b>" + msg.username + " : </b> " + msg.fileName + '<br/>');
		
		document.getElementById("conversation").insertBefore(dElem, document.getElementById("conversation").firstChild);
    
    }
    else 
	{


        var aElem = document.createElement('a');
        aElem.href = msg.file;
        var aElemTN = document.createTextNode(msg.username + ' : ' +  msg.fileName);
        aElem.appendChild(aElemTN);
        document.getElementById("conversation").insertBefore(aElem, document.getElementById("conversation").firstChild);


    }


}


function addUser()
{
    usersName = prompt("Enter your name?");
    socket.emit('adduser', usersName );
}


function processMessage(username, data) 
{
	var dElem = document.createElement('sr');
	dElem.innerHTML = ('<br/>' + '<b>' + username + ' : </b> ' + '<i>' + data + '</i>' + '<br/>'); 
	document.getElementById("conversation").insertBefore(dElem, document.getElementById("conversation").firstChild);
	

}


function updateUserChat(data)
{
    $('#userid').empty();
    userChatfixed = {};
    userChat = [];
    var increment = 0;
    $.each(data, function(key, value) {
        $('#userid').append('<div>' + key + '</div>');
        userChatfixed[key] = key;
        userChat[increment] = key;
        increment = increment + 1;
    });
	
}


function sendMessage()
{
    var message = $('#data').val();
    $('#data').val('');
    socket.emit('sendchat', message);
	$('#data').focus();
}

function processEnterPress(e)
{
    if (e.which == 13) {
        e.preventDefault();
        $(this).blur();
        $('#datasend').focus().click();
    }
}


