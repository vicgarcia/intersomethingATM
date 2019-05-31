<?php
require_once '../bootstrap.php';

use \Slim\Slim;
use \IntersomethingATM\Accounts;


// setup application
$app = new Slim([
    'templates.path'  => '../templates',
]);

$app->container->singleton('accounts', function() {
    return new Accounts('../database.sqlite3');
});


// distribute js app
$app->get('/', function() use ($app) {
    $app->render('main.html');
});


// account endpoint
$app->post('/account', function() use ($app) {
    // return 403 for bad account number
    $account = $app->accounts->lookup($app->request->post('account'));
    if (!$account) {
        $app->response->setStatus(403);
        return json_encode(array());
    }
    // return 401 for bad pin
    if (!$account->validPin($app->request->post('pin'))) {
        $app->response->setStatus(401);
        echo json_encode(array());
    }
    // handle a withdraw if present in request, 400 for error
    if ($app->request->post('withdraw')) {
        if (!$app->accounts->withdraw($account, $app->request->post('withdraw'))) {
            $app->response->setStatus(400);
        }
    }
    // return the balance
    echo json_encode(array('balance' => $app->accounts->balance($account)));
});


// return empty json array with 404
$app->notFound(function () use ($app) {
    $app->response->setStatus(404);
    echo json_encode(array());
});


// return empty json array on error
$app->error(function (\Exception $e) use ($app) {
    $app->response->setStatus(500);
    echo json_encode([]);
});


// run the app
$app->run();
