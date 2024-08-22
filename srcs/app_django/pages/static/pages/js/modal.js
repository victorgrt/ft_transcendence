function modalLogin()
{
    hidePongErrorModal()
    hideLoggoutErrorModal();
    zoomToPC();
    showElement(loginForm);
    showElement(registerForm);
}

function hideLoggoutErrorModal()
{
    $('#container-modal-error-loggout').modal('hide');
}

function showLoggoutErrorModal()
{
    $('#container-modal-error-loggout').modal('show');
}

function showWarningModal() {
    $('#container-modal-warning').modal('show');
}

function refuseWarningModal()
{
    $('#container-modal-warning').modal('hide');
    acceptModal = false;
}

function acceptWarningModal()
{
    $('#container-modal-warning').modal('hide');
    acceptedModal = true;
}

function showLoggedOutModal()
{
    console.log("showing loggout modal");
    $('#container-modal-log').modal('show');
    console.log("show :", $('#container-modal-log'));
}

function hideLoggedOutModal()
{
    const test = document.getElementById("container-modal-log");
    test.style.display = "none";
    document.querySelector("modal-backdrop fade show").remove();
}

function showPongErrorModal()
{
    $('#container-modal-error-pong').modal('show');
}

function hidePongErrorModal()
{
    $('#container-modal-error-pong').modal('hide');
}