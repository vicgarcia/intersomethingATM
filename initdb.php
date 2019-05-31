<?php

require_once 'bootstrap.php';

use \IntersomethingATM\Accounts;


$accounts = new Accounts('database.sqlite3');
$db = $accounts->getDb();

$db->query("
    drop table accounts
");

$db->query("
    create table accounts (
        number integer primary key,
        pin integer
    )
");

$db->query("
    drop table transactions
");

$db->query("
    create table transactions (
        number integer references accounts (number),
        info text,
        amount real,
        timestamp integer
    )
");

$timestamp = time();

$db->query("
    insert into accounts values ( '111222333444', '1234' )
");
$db->query("
    insert into transactions values ( '111222333444', 'deposit', '500.00', '{$timestamp}')
");

$db->query("
    insert into accounts values ( '587624387192', '8361' )
");
$db->query("
    insert into transactions values ( '587624387192', 'deposit', '1000.00', '{$timestamp}')
");

