
let commentName = document.getElementById('commentName');
let commentEmail = document.getElementById('commentEmail');
let commentBody = document.getElementById('commentBody');
let leaveReply = document.getElementsByClassName('leave-reply')[0];



function validate() {
    console.log(commentBody.value);
    if (commentName.value == "" || commentBody.value == "" || commentEmail.value == "") {
        alert("All fields are requied");
        return false;
    }
    if (!isEmail(commentEmail.value)) {
        alert("Invalid Email");
        return false;
    }

    return true;
}


function isEmail(email) {
    let atSymbol = email.indexOf('@');
    let dot = email.lastIndexOf('.');

    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email)) return false;

    if (atSymbol < 1) return false;

    if (dot <= atSymbol + 2) return false;

    if (dot === email.length - 1) return false;

    return true;

}
