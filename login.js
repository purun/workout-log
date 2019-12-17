const loginBtn = document.querySelector("#gDrive");

function handleGdriveBtnClk(event) {
    console.log(event);
}

if (loginBtn) {
    loginBtn.addEventListener('click', handleGdriveBtnClk);
}