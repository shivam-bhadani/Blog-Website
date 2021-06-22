
const form = document.getElementsByClassName("contact-form")[0];

let name = document.getElementById("name");
let email = document.getElementById("email");
let subject = document.getElementById("subject");
let message = document.getElementById("message");


form.addEventListener("submit", validateAndSubmit);

function validateAndSubmit(e) {
    e.preventDefault();

    // validation
    let { result, data } = validation();
    // console.log(result);
    // console.log(data);

    // if validation result is true then success message
    if (result)
        successMessage();

    // if validation result is true then sending data to data-base by calling ajax
    if (result)
        syncWithDb(data).then(result => console.log("Message sent successfully")).catch(err => console.log(`Fetch error : ${err}`));
}

function validation() {

    let nameVal = name.value.trim();
    let emailVal = email.value.trim();
    emailVal = emailVal.toLowerCase();
    let subjectVal = subject.value.trim();
    let messageVal = message.value.trim();

    result = true;

    if (nameVal === "") { sendError(name, "Name must be filled out"); result = false; }
    if (!isEmail(emailVal)) { sendError(email, "Invalid Email"); result = false; }
    if (emailVal === "") { sendError(email, "Email must be filled out"); result = false; }
    if (subjectVal === "") { sendError(subject, "Subject must be filled out"); result = false; }
    if (messageVal === "") { sendError(message, "Message must be filled out"); result = false; }

    return {
        result,
        data: {
            name: nameVal,
            email: emailVal,
            subject: subjectVal,
            message: messageVal
        }
    };

}

function sendError(field, message) {
    let parentfield = field.parentElement;
    let contactFormError = parentfield.querySelector(".contact-form-error")
    contactFormError.innerText = message;
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



function successMessage() {
    swal("Message Sent Successfully", "Thanks for Contacting me! I will be in touch with you very soon.", "success");
    name.value = "";
    email.value = "";
    subject.value = "";
    message.value = "";
    let contactFormError = document.querySelectorAll(".contact-form-error")

    var i;

    for (i = 0; i < 4; i++)
        contactFormError[i].innerText = "";
}




async function syncWithDb(data) {
    let response = await fetch("/contact", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
    })

    let result = await response.json();

    return result;
}