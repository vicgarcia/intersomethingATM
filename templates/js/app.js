define([
    'jquery',
], function($) {
    'use strict';

    var state = {
        key: function(value, registry) {},
        cancel: function(registry) {},
        cash: function(registry) {}
    };

    var ajax = {
        type: 'POST',
        url: '/account',
        dataType: 'json'
    };

    var initRegistry = function() {
        return {
            account: '',
            mode: 'accountEntry',
            balance: '',
            withdraw: '',
            pin: ''
        };
    }

    var accountEntry = $.extend({}, state, {
        key: function(value, registry) {
            if (value == '.')  return;  // ignore decimal keypress
            registry.account += value;
            $("#entry").text(registry.account);
            if (registry.account.length == 12) {
                // check backend for valid account number
                $.ajax($.extend({
                    data: {
                        account: registry.account
                    },
                    statusCode: {
                        403: function(response) {
                            registry.account = '';
                            $("#message").text('We can not process your card');
                            $("#entry").text('');
                        },
                        401: function(response) {
                            registry.mode = 'pinEntry';
                            $("#message").text('Enter Your Pin Number');
                            $("#entry").text('');
                        }
                    }
                }, ajax));
            }
        },
        cancel: function(registry) {
            registry.account = ''
        }
    });

    var pinEntry = $.extend({}, state, {
        key: function(value, registry) {
            if (value == '.')  return;  // ignore decimal keypress
            registry.pin += value;
            $("#entry").text( $("#entry").text() + '*' );
            if (registry.pin.length == 4) {
                // check backend for valid pin
                $.ajax({
                    type: 'POST',
                    url: '/account',
                    dataType: 'json',
                    data: {
                        account: registry.account,
                        pin: registry.pin
                    },
                    statusCode: {
                        401: function(response) {
                            registry.pin = '';
                            $("#message").text('Invalid Pin');
                            $("#entry").text('');
                        },
                        200: function(response) {
                            registry.mode = 'loggedIn';
                            registry.balance = parseFloat(response.balance).toFixed(2);
                            $("#message").text('Current Balance: $' + registry.balance);
                            $("#cancel").addClass('option-hidden');
                            $("#exit").removeClass('option-hidden');
                            $("#cash").removeClass('option-hidden');
                            $("#entry").text('');
                        }
                    }
                });
            }
        },
        cancel: function(registry) {
            registry.mode = 'accountEntry';
            registry.account = ''
            registry.pin = ''
            $("#message").text('Enter Your Account Number');
        }
    });

    var loggedIn = $.extend({}, state, {
        cash: function(registry) {
            registry.mode = 'cashEntry';
            $("#message").text('Enter Amount To Withdraw (w/ Decimal)');
            $("#cancel").removeClass('option-hidden');
            $("#cash").addClass('option-hidden');
        }
    });

    var cashEntry = $.extend({}, state, {
        key: function(value, registry) {
            registry.withdraw += value;
            $("#entry").text(registry.withdraw);
            if (isNaN(registry.withdraw)) {
                registry.withdraw = '';
                $("#entry").text(registry.withdraw);
                $("#message").text('Invalid Amount for Withdraw');
            }
            if (registry.withdraw == parseFloat(registry.withdraw).toFixed(2)) {
                // perform withdraw
                $.ajax($.extend({
                    data: {
                        account: registry.account,
                        pin: registry.pin,
                        withdraw: registry.withdraw
                    },
                    statusCode: {
                        200: function(response) {
                            registry.mode = 'loggedIn';
                            registry.withdraw = '';
                            registry.balance = parseFloat(response.balance).toFixed(2);
                            $("#message").text('Current Balance: $' + registry.balance);
                            $("#cancel").addClass('option-hidden');
                            $("#exit").removeClass('option-hidden');
                            $("#cash").removeClass('option-hidden');
                            $("#entry").text('');
                        },
                        400: function(response) {
                            registry.withdraw = '';
                            $("#entry").text(registry.withdraw);
                            $("#message").text('Invalid Amount for Withdraw');
                        }
                    }
                }, ajax));
            }
        },
        cancel: function(registry) {
            registry.mode = 'loggedIn';
            registry.withdraw = '';
            $("#message").text('Current Balance: $' + registry.balance);
            $("#cancel").addClass('option-hidden');
            $("#cash").removeClass('option-hidden');
        }
    });

    var run = function() {
        var registry = initRegistry(),
            states = {
                accountEntry: accountEntry,
                pinEntry: pinEntry,
                loggedIn: loggedIn,
                cashEntry: cashEntry
            };

        $(".keypad-key").each(function() {
            var key = $(this);
            key.click(function() {
                states[registry.mode].key(key.text(), registry);
            });
        });

        $("#cancel").click(function() {
            states[registry.mode].cancel(registry);
            $("#entry").text('');
        });

        $("#cash").click(function() {
            states[registry.mode].cash(registry);
        });

        $("#exit").click(function() {
            registry = initRegistry();
            $("#message").text('Enter Your Account Number');
            $("#cancel").removeClass('option-hidden');
            $("#cash").addClass('option-hidden');
            $("#exit").addClass('option-hidden');
            $("#entry").text('');
        });
    };

    return { run: run };
});
