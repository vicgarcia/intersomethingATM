<?php
namespace IntersomethingATM;

class Account
{
    public $number;

    protected $pin;

    public function __construct($accountNumber, $pin)
    {
        $this->number = $accountNumber;
        $this->pin = $pin;
    }

    public function validPin($pin)
    {
        return ($this->pin == $pin);
    }
}
