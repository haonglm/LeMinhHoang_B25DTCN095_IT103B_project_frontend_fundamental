let user = JSON.parse(localStorage.getItem("user")) || [];

const middleNameInput = document.getElementById("middleName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const agreeInput = document.getElementById("agree").checked;

const middleNameError = document.getElementById("middleNameError");
const lastNameError = document.getElementById("lastNameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

function resetInput(){
    middleNameInput.value = "";
    lastNameInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";
    agree.checked = false;
}

function clearError(){
    middleNameError.innerText = "";
    lastNameError.innerText = "";
    emailError.innerText = "";
    passwordError.innerText = "";
}

function validate(){
    let isValid = true;
    clearError();

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
        alert("bạn phải đồng ý các điều khoản");
        isValid = false;
    }

    return isValid;
}

// submit
