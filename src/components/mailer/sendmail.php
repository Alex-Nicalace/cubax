<?php

$name = $_POST['name'];
$phone = $_POST['tel'];
$question = $_POST['question'];

require_once __DIR__ . '/vendor/autoload.php';
$settings = require_once __DIR__ . '/settings.php';
require_once __DIR__ . '/functions.php';

$body = '
    <h1>Пользователь оставил данные</h1><br>
    <strong>Имя</strong>: ' . $name . ' <br>
    <strong>Номер телефона</strong>: ' . $phone . '<br>
    <strong>Вопрос</strong>: ' . $question . '';


$attachments = [
//     __DIR__ . '/img/4.jpg',
//     __DIR__ . '/img/5.jpg',
];

echo send_mail($settings['mail_settings_prod'], ['anicalace@gmail.com'], 'Данные', $body, $attachments);
