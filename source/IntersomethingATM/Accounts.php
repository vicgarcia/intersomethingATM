<?php
namespace IntersomethingATM;

class Accounts
{
    protected
        $db;

    public function __construct($databasePath)
    {
        $this->db = new \SQLite3($databasePath);
    }

    public function lookup($accountNumber)
    {
        $sql = "select number, pin from accounts
                where number = {$accountNumber}";
        $result = $this->db->querySingle($sql, true);

        $account = null;
        if (!empty($result)) {
            $account = new Account($result['number'], $result['pin']);
        }

        return $account;
    }

    public function balance(Account $account)
    {
        $sql = "select sum(amount) from transactions
                where number = {$account->number}";
        $balance = $this->db->querySingle($sql);

        return $balance ?: 0;
    }

    public function withdraw(Account $account, $amount)
    {
        // check for and fail when withdraw exceeds balance
        if ($amount > $this->balance($account)) {
            return false;
        }

        // record withdraw
        $amount = $amount * -1;
        $timestamp = time();
        $sql = "
            insert into transactions values (
                {$account->number},
                'withdraw',
                $amount,
                {$timestamp}
            )
        ";
        $this->db->query($sql);
        return true;
    }

    public function getDb()
    {
        return $this->db;
    }
}
