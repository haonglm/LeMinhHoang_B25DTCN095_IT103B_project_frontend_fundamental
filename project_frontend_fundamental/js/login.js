let users = JSON.parse(localStorage.getItem("users")) || [];

const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const rememberInput = document.getElementById("remember");

//clear lỗi
function clearError(){
    emailInput.style.border = "1px solid #ccc";
    passwordInput.style.border = "1px solid #ccc";
    emailError.innerText = "";
    passwordError.innerText = "";
}

// validate
function validate(){
    let isValid = true;
    clearError();

    const emailElement = emailInput.value.trim();
    const passwordElement = passwordInput.value.trim();

    // email
    if(emailElement === ""){
        isValid = false;
        emailInput.style.border = "1px solid red";
        emailError.innerText = "email không được để trống";
        emailError.style.color = "red";
    }

    // password
    if(passwordElement === ""){
        isValid = false;
        passwordInput.style.border = "1px solid red";
        passwordError.innerText = "mật khẩu không được để trống";
        passwordError.style.color = "red";
    }

    if(!isValid){
        return;
    }

    return {
        email: emailElement,
        password: passwordElement
    }
}

//submit
document.querySelector("form").addEventListener("submit", function(e){
    e.preventDefault();

    const data = validate();

    if(!data){
        return;
    }

    const user = users.find(u => u.email === data.email);

    if(!user){
        emailInput.style.border = "1px solid red";
        emailError.innerText = "email không đúng";
        return;
    }

    if(user.password !== data.password){
        passwordInput.style.border = "1px solid red";
        passwordError.innerText = "mật khẩu không đúng";
        return;
    }

    if(rememberInput.checked){
        localStorage.setItem("currentUser", JSON.stringify(user));
    }else{
        sessionStorage.setItem("currentUser", JSON.stringify(user));
    }

    window.location.href = "./subject-manager.html";
})