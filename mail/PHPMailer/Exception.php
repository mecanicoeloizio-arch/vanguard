<?php
/**
 * PHPMailer Exception Class
 * Grupo Eloizio Mail Server Engine - PHPMailer 6.9+ Compatible
 */

namespace PHPMailer\PHPMailer;

class Exception extends \Exception
{
    /**
     * Prettify the error message.
     *
     * @return string
     */
    public function errorMessage(): string
    {
        return '<strong>' . htmlspecialchars($this->getMessage()) . "</strong><br />\n";
    }
}
