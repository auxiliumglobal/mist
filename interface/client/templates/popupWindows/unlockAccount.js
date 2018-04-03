/**
Template Controllers

@module Templates
*/

var setWindowSize = function (template) {
    Tracker.afterFlush(function () {
        ipc.send('backendAction_setWindowSize', 580, template.$('.popup-windows .inner-container').height() + 240);
    });
};


// var defaultEstimateGas = 50000000;

/**
The unlockAccount confirmation popup window template

@class [template] popupWindows_unlockAccount
@constructor
*/


/**
Takes a 4-byte function signature and does a best-effort conversion to a
human readable text signature.

@method (lookupFunctionSignature)
*/
var lookupFunctionSignature = function (data, remoteLookup) {
    return new Q(function (resolve, reject) {
        if (data && data.length > 8) {
            var bytesSignature = (data.substr(0, 2) === '0x')
                ? data.substr(0, 10)
                : '0x' + data.substr(0, 8);

            if (remoteLookup) {
                https.get('https://www.4byte.directory/api/v1/signatures/?hex_signature=' + bytesSignature, function (response) {
                    var body = '';

                    response.on('data', function (chunk) {
                        body += chunk;
                    });

                    response.on('end', function () {
                        var responseData = JSON.parse(body);
                        if (responseData.results.length) {
                            resolve(responseData.results[0].text_signature);
                        } else {
                            resolve(bytesSignature);
                        }
                    });
                }).on('error', function (error) {
                    console.warn('Error querying Function Signature Registry.', err);
                    reject(bytesSignature);
                });
            } else if (_.first(window.SIGNATURES[bytesSignature])) {
                    resolve(_.first(window.SIGNATURES[bytesSignature]));
                } else {
                    reject(bytesSignature);
                }
        } else {
            reject(undefined);
        }
    });
};

var localSignatureLookup = function (data) {
    return lookupFunctionSignature(data, false);
};

var remoteSignatureLookup = function (data) {
    return lookupFunctionSignature(data, true);
};

var signatureLookupCallback = function (textSignature) {
    // Clean version of function signature. Striping params
    TemplateVar.set(template, 'executionFunction', textSignature.replace(/\(.+$/g, ''));
    TemplateVar.set(template, 'hasSignature', true);

    var params = textSignature.match(/\((.+)\)/i);
    if (params) {
        console.log('params sent', params);
        TemplateVar.set(template, 'executionFunctionParamTypes', params);
        ipc.send('backendAction_decodeFunctionSignature', textSignature, data.data);
    }
};


Template['popupWindows_unlockAccount'].onCreated(function () {
    var template = this;

    // check inital data and gas estimates
    this.autorun(function () {
        // set window size
        setWindowSize(template);
    });
});

Template['popupWindows_unlockAccount'].onRendered(function () {
    var template = this;

    Meteor.setTimeout(function () {
        template.$('input[type="password"]').focus();
    }, 200);
});

Template['popupWindows_unlockAccount'].events({
    /**
    Cancel account unlocking and close the popup

    @event click .cancel
    */
    'click .cancel': function () {
        ipc.send('backendAction_unlockedAccount', 'Account remained unlocked');
        ipc.send('backendAction_closePopupWindow');
    },
    /**
    Confirm password

    @event submit form
    */
    'submit form': function (e, template) {
        e.preventDefault();

        var data = Session.get('data'),
        pw = template.find('input[type="password"]').value;

        TemplateVar.set('unlocking', true);

        const accounts = EthAccounts.find({}).fetch();
        if (accounts.length < 1) {
            TemplateVar.set(template, 'error', 'No accounts found');
        }
        const address = accounts[0].address;

        web3.personal.unlockAccount(address, pw || '', 0, function(e, res) {
            pw = null;
            TemplateVar.set(template, 'unlocking', false);
            if (e) {
                TemplateVar.set(template, 'error', 'Invalid password');
                ipc.send('backendAction_setWindowSize', 580, template.$('.popup-windows .inner-container').height() + 340);
            } else if (res) {
                ipc.send('backendAction_unlockedAccount', null, res);
            }
        });
    }
});
