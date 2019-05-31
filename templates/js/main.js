require.config({

    paths: {
        'jquery': '../../bower_components/jquery/dist/jquery',
    },

    shim: {
        'jquery': {
            exports: '$'
        }
    }

});

require(['app'], function(app) { app.run(); });
