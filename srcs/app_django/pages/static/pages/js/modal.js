
function modalLogin()
{
    hideErrorModal();
    zoomToPC();
    showElement(loginForm);
    showElement(registerForm);
}

function hideErrorModal()
{
    $('#container-modal-error').modal('hide');
}

function showErrorModal()
{
    $('#container-modal-error').modal('show');
}

function showModal() {
    $('#container-modal').modal('show');
}

function dontAcceptModal()
{
    $('#container-modal').modal('hide');
    acceptModal = false;
}

function acceptModal()
{
    $('#container-modal').modal('hide');
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
