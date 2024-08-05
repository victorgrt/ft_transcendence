
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

function loggedOutModalShow()
{
    $('#container-modal-log').modal('show');
}

function loggedOutModalHide()
{
    $('#container-modal-log').modal('hide');
}

function showPongErrorModal()
{
    $('#container-modal-error-pong').modal('show');
}

function hidePongErrorModal()
{
    $('#container-modal-error-pong').modal('hide');
}