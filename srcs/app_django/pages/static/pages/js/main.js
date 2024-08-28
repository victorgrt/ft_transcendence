

dontClick = false;
var isZoomed = localStorage.getItem('isZoomed') === 'true'; // Pour suivre l'état de zoom;
var isZooming = false;
var couchZoomed = false;

 // Point vers lequel la caméra regarde initialement
duration = 2000; //Duree du zoom

function goToLogin() {
    if (isZoomed === false && isZooming === false)
        zoomToPC();
    if (registerVisible === true)
    {   
        registerForm.style.visibility = 'hidden';
        registerForm.style.opacity = '0';
        resetStyleForms();
        registerVisible = false;
    }    
    loginVisible = true;
    centerLoginForm();
    showElement(loginForm);
}

function goToRegister() {
    if (isZoomed === false && isZooming === false)
        zoomToPC();
    if (loginVisible === true)
    {
        loginForm.style.visibility = 'hidden';
        loginForm.style.opacity = '0';
        resetStyleForms();
        loginVisible = false;
    }
    registerVisible = true;
    centerRegisterForm();
    registerForm.style.opacity = '1';
    registerForm.style.visibility = 'visible';
    registerForm.style.z_index = '2';
}