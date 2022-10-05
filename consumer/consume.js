require("dotenv").config();

const amqp = require("amqplib");
const PlayistsService = require("./src/PlayistsService");
const MailSender = require("./src/MailSender");
const Listener = require("./src/Listener");
const CacheControl = require("./src/cache/CacheControl");

const init = async () => {
  const cacheControl = new CacheControl();
  const playistsService = new PlayistsService(cacheControl);
  const mailSender = new MailSender();
  const listener = new Listener(playistsService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue("export:playlists", {
    durable: true,
  });

  channel.consume("export:playlists", listener.eventListener, { noAck: true });
};

init();
