require('dotenv').config();
const amqp = require('amqplib');
const NotesService = require('./PlaylistsService');
const MailSender = require('./MailSender');
const Listener = require('./listener');

const init = async () => {
  const notesService = new NotesService();
  const mailSender = new MailSender();
  const listener = new Listener(notesService, mailSender);

  const queue = 'export:playlists';

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);

  const channel = await connection.createChannel();

  await channel.assertQueue(queue, {
    durable: true,
  });

  await channel.consume(queue, listener.listen, { noAck: true });
};

init();
