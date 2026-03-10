const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const csv = require('csv-parser');

const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', qr => {
  console.log('Escaneie o QR Code abaixo:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
  console.log('WhatsApp conectado 🚀');
  await delay(5000);
  enviarMensagens();
});

client.initialize();

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function delayAleatorio() {
  const min = 240000; // 4 minutos
  const max = 300000; // 5 minutos
  return Math.floor(Math.random() * (max - min) + min);
}

function enviarMensagens() {

  const contatos = [];

  fs.createReadStream('contatosCriciuma.csv')
    .pipe(csv())
    .on('data', (row) => contatos.push(row))
    .on('end', async () => {

      const imagem = MessageMedia.fromFilePath('./image-criciuma.jpg');

      const mensagem = `👋 Olá! Aqui é Vitor da Microsom Santa Catarina.

Queremos convidar você para um Encontro Presencial promovido pela Cochlear e Politec Saúde.

✨ Cuidar para Escutar Sempre!

No evento, você poderá:

🎧 Fazer uma avaliação preventiva do seu processador (com agendamento)
🔧 Tirar dúvidas e receber orientações
🤝 Encontrar outros usuários Cochlear e partilhar experiências

Você gostaria de participar?`;

      let enviados = 0;

      for (const c of contatos) {

        try {

          const numeroBase = String(c.numero).replace(/\D/g, '');

          let contato = await client.getNumberId(numeroBase);

          if (!contato && numeroBase.length === 13) {
            const sem9 = numeroBase.slice(0,4) + numeroBase.slice(5);
            contato = await client.getNumberId(sem9);
          }

          if (!contato) {
            console.log('Número inválido:', numeroBase);
            continue;
          }

          await client.sendMessage(contato._serialized, imagem, {
            caption: mensagem
          });

          enviados++;

          console.log(`Enviado (${enviados}) -> ${numeroBase}`);

          const tempo = delayAleatorio();

          const minutos = Math.floor(tempo / 60000);
          const segundos = Math.floor((tempo % 60000) / 1000);

          console.log(`Próximo envio em ${minutos}:${segundos.toString().padStart(2,'0')}`);

          await delay(tempo);

        } catch (erro) {

          console.log('Erro ao enviar para:', c.numero);

        }

      }

      console.log('Disparo finalizado ✅');

    });
}