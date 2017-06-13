$('#create-account').submit((event) => {
    event.preventDefault();
    const emailValue = $(event.currentTarget).find('#email').val();
    const passwordValue = $(event.currentTarget).find('#password').val();
    const username = $(event.currentTarget).find('#username');
    const confirmPassword = $(event.currentTarget).find('#confirm-password');

    if (confirmPassword.val() !== passwordValue) {
        confirmPassword.get(0).setCustomValidity('Password confirmation must match Password');
        event.currentTarget.reportValidity();
        return;
    }

    const poolData = {
        UserPoolId: 'eu-west-1_glh5cJUXe',
        ClientId: '3bhjjnm7njgijcjople3udrr67'
    };

    const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
    const userPool = new CognitoUserPool(poolData);
    const dataEmail = {
        Name: 'email',
        Value: emailValue
    };

    const email = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

    userPool.signUp(username.val(), passwordValue, [email], null, (err) => {
        if (err) {
            switch(err.code) {
                case 'UsernameExistsException':
                    username.get(0).setCustomValidity('Username already in use');
                    event.currentTarget.reportValidity();
                    break;
                default:
                    $(event.currentTarget).find('.error').removeClass("hidden").text(err.message);
            }
            return;
        }

        window.location.href = '/confirm-email.html?email=' + emailValue;
    });
});

$('#confirm-email').submit((event) => {
    event.preventDefault();
    const emailValue = $(event.currentTarget).find('#email').val();
    window.location.href = '/login.html?email=' + emailValue;
});

$('#verify-email').submit((event) => {
    event.preventDefault();
    const emailValue = $(event.currentTarget).find('#email').val();
    window.location.href = '/confirm-email.html?email=' + emailValue;
});

$('#username').on('input', (event) => {
    event.currentTarget.setCustomValidity('');
});

$('#confirm-password').on('input', (event) => {
    event.currentTarget.setCustomValidity('');
});



