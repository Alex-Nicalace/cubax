<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Функция для отправки электронного письма
function send_mail(array $mail_settings, array $to, string $subject, string $body, array $attachments = [])
{
    $result = ['success' => false, 'message' => '']; // Инициализация результата

    // Создание объекта PHPMailer
    $mail = new PHPMailer(true);
    
    try {
        // Устанавливаем уровень отладочного вывода в 0 (выключено)
        $mail->SMTPDebug = 0;
        
        // Указываем, что используем SMTP для отправки письма
        $mail->isSMTP();
        
        // Устанавливаем настройки SMTP-сервера
        $mail->Host = $mail_settings['host'];
        $mail->SMTPAuth = $mail_settings['auth'];
        $mail->Username = $mail_settings['username'];
        $mail->Password = $mail_settings['password'];
        $mail->SMTPSecure = $mail_settings['secure'];
        $mail->Port = $mail_settings['port'];
        $mail->CharSet = $mail_settings['charset'];

        // Устанавливаем адрес отправителя и получателя
        $mail->setFrom($mail_settings['from_email'], $mail_settings['from_name']);
        foreach ($to as $email) {
            $mail->addAddress($email);
        }

        // Добавляем вложения, если они есть
        if ($attachments) {
            foreach ($attachments as $attachment) {
                $mail->addAttachment($attachment);
            }
        }

        // Устанавливаем формат письма (HTML или текст)
        $mail->isHTML($mail_settings['is_html']);

        // Устанавливаем тему и текст письма
        $mail->Subject = $subject;
        $mail->Body = $body;

        // Отправляем письмо и возвращаем результат
        // return $mail->send();

        if ($mail->send()) {
            $result['success'] = true; // Устанавливаем флаг успешной отправки
            $result['message'] = '';
        } else {
            $result['message'] = $mail->ErrorInfo;
        }
    } catch (Exception $e) {
        // В случае ошибки отправки, возвращаем false
        $result['message'] = $e;
    }

    // Возвращаем результат в виде JSON
    return json_encode($result);    
}
