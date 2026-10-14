<?php
/**
 * PHPMailer RFC 5321 SMTP Client Protocol Implementation
 * Grupo Eloizio Mail Server Engine - PHPMailer 6.9+ Compatible
 */

namespace PHPMailer\PHPMailer;

class SMTP
{
    const VERSION = '6.9.1';
    const DEFAULT_PORT = 25;
    const DEFAULT_SECURE_PORT = 465;
    const DEFAULT_SUBMISSION_PORT = 587;
    const CRLF = "\r\n";

    protected $smtp_conn = null;
    protected $error = [];
    protected $helo_rply = null;
    protected $server_caps = null;
    public $do_debug = 0;
    public $Debugoutput = 'echo';
    public $Timeout = 300;
    public $Timelimit = 300;

    public function connect(string $host, int $port = 0, int $timeout = 30, array $options = []): bool
    {
        $this->error = [];
        if (empty($port)) {
            $port = self::DEFAULT_PORT;
        }

        $socket_context = stream_context_create($options);
        set_error_handler([$this, 'errorHandler']);
        $this->smtp_conn = stream_socket_client(
            $host . ':' . $port,
            $errno,
            $errstr,
            $timeout,
            STREAM_CLIENT_CONNECT,
            $socket_context
        );
        restore_error_handler();

        if (!is_resource($this->smtp_conn)) {
            $this->error = [
                'error' => 'Failed to connect to server',
                'errno' => $errno,
                'errstr' => $errstr,
            ];
            return false;
        }

        stream_set_timeout($this->smtp_conn, $timeout, 0);
        $announce = $this->get_lines();
        return true;
    }

    public function authenticate(string $username, string $password, string $authtype = 'LOGIN'): bool
    {
        if (!$this->sendCommand('AUTH LOGIN', 'AUTH LOGIN', 334)) {
            return false;
        }
        if (!$this->sendCommand('Username', base64_encode($username), 334)) {
            return false;
        }
        if (!$this->sendCommand('Password', base64_encode($password), 235)) {
            return false;
        }
        return true;
    }

    public function sendCommand(string $commandLabel, string $command, int $expecting): bool
    {
        if (!is_resource($this->smtp_conn)) {
            return false;
        }
        fwrite($this->smtp_conn, $command . self::CRLF);
        $reply = $this->get_lines();
        $code = (int) substr($reply, 0, 3);
        return $code === $expecting;
    }

    public function mail(string $from): bool
    {
        return $this->sendCommand('MAIL FROM', 'MAIL FROM:<' . $from . '>', 250);
    }

    public function recipient(string $to): bool
    {
        return $this->sendCommand('RCPT TO', 'RCPT TO:<' . $to . '>', 250);
    }

    public function data(string $msg_data): bool
    {
        if (!$this->sendCommand('DATA', 'DATA', 354)) {
            return false;
        }
        // Normalize line endings
        $msg_data = str_replace(["\r\n", "\r"], "\n", $msg_data);
        $msg_data = str_replace("\n", self::CRLF, $msg_data);
        // Byte-stuffing
        $msg_data = preg_replace('/^\./m', '..', $msg_data);
        fwrite($this->smtp_conn, $msg_data . self::CRLF . '.' . self::CRLF);
        $reply = $this->get_lines();
        return (int) substr($reply, 0, 3) === 250;
    }

    public function quit(): bool
    {
        if (is_resource($this->smtp_conn)) {
            $this->sendCommand('QUIT', 'QUIT', 221);
            fclose($this->smtp_conn);
            $this->smtp_conn = null;
        }
        return true;
    }

    protected function get_lines(): string
    {
        $data = '';
        if (is_resource($this->smtp_conn)) {
            while (!feof($this->smtp_conn)) {
                $line = fgets($this->smtp_conn, 515);
                $data .= $line;
                if (isset($line[3]) && $line[3] === ' ') {
                    break;
                }
            }
        }
        return $data;
    }

    protected function errorHandler(int $errno, string $errmsg): bool
    {
        $this->error = ['errno' => $errno, 'errmsg' => $errmsg];
        return true;
    }

    public function getError(): array
    {
        return $this->error;
    }
}
