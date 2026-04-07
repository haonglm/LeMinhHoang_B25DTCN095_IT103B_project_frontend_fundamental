let users = JSON.parse(localStorage.getItem("users")) || [];

const middleNameInput = document.getElementById("middleName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const agreeInput = document.getElementById("agree");


const middleNameError = document.getElementById("middleNameError");
const lastNameError = document.getElementById("lastNameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const agreeError = document.getElementById("agreeError");



function validate(){
    let isValid = true;

    const middleNameElement = middleNameInput.value.trim();
    const lastNameElement = lastNameInput.value.trim();
    const emailElement = emailInput.value.trim();
    const passwordElement = passwordInput.value.trim();

    // tên họ
    if(middleNameElement === ""){
        isValid = false;
        middleNameInput.style.border = "1px solid red";
        middleNameError.innerText = "họ không được để trống";
        middleNameError.style.color = "red";
    }

    // tên chính
    if(lastNameElement === ""){
        isValid = false;
        lastNameInput.style.border = "1px solid red";
        lastNameError.innerText = "tên không được để trống";
        lastNameError.style.color = "red";
    }

    // email
    if(emailElement === ""){
        isValid = false;
        emailInput.style.border = "1px solid red";
        emailError.innerText = "email không được để trống";
        emailError.style.color = "red";
    }else{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(emailElement)){
            isValid = false;
            emailInput.style.border = "1px solid red";
            emailError.innerText = "email không đúng định dạng";
            emailError.style.color = "red";
        }
    }

    // password
    if(passwordElement === ""){
        isValid = false;
        passwordInput.style.border = "1px solid red";
        passwordError.innerText = "mật khẩu không được để trống";
        passwordError.style.color = "red";
    }else if(passwordElement.length < 8){
        isValid = false;
        passwordInput.style.border = "1px solid red";
        passwordError.innerText = "mật khẩu phải có ít nhất 8 ký tự";
        passwordError.style.color = "red";
    }

    // checkbox
    if(!agreeInput.checked){
        isValid = false;
        agreeError.innerText = "vui lòng đồng ý các chính sách";
        agreeError.style.color = "red";
    }

    if(!isValid){
        return;
    }

    return {
        middleNameElement,
        lastNameElement,
        emailElement,
        passwordElement
    }
}

middleNameInput.addEventListener("input", function(){
    middleNameInput.style.border = "1px solid #ccc";
    middleNameError.innerText = "";
});

lastNameInput.addEventListener("input", function(){
    lastNameInput.style.border = "1px solid #ccc";
    lastNameError.innerText = "";
});

emailInput.addEventListener("input", function(){
    emailInput.style.border = "1px solid #ccc";
    emailError.innerText = "";
});

passwordInput.addEventListener("input", function(){
    passwordInput.style.border = "1px solid #ccc";
    passwordError.innerText = "";
});

agreeInput.addEventListener("change", function(){
    agreeError.innerText = "";
});

// submit
document.querySelector("form").addEventListener("submit", function(e){
    e.preventDefault();

    if(!validate()){
        return;
    }

    const email = emailInput.value.trim();
    const isExist = users.find(u => u.email === email);

    if(isExist){
        emailInput.style.border = "1px solid red";
        emailError.innerText = "email đã tồn tại";
        emailError.style.color = "red";
        return;
    }

    const user = {
        fullName: `${middleNameInput.value.trim()} ${lastNameInput.value.trim()}`,
        email: email,
        password: passwordInput.value
    }

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    window.location.href = "./index.html";
})