const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const csv = require('csv-parser');

const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
  console.log('WhatsApp pronto 🚀');
  await delay(5000);
  enviarMensagens();
});

client.initialize();

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function enviarMensagens() {
  const contatos = [];

  fs.createReadStream('contatos.csv')
    .pipe(csv())
    .on('data', (row) => contatos.push(row))
    .on('end', async () => {

      const imagem = MessageMedia.fromFilePath('./image-floripa.jpg');

      const mensagem = `👋 Olá! Aqui é Vitor da Microsom Florianópolis.

Queremos convidar você para um Encontro Presencial promovido pela Cochlear e Politec Saúde.

✨ Cuidar para Escutar Sempre!

No evento, você poderá:

* 🎧 Fazer uma avaliação preventiva do seu processador (com agendamento)
* 🔧 Tirar dúvidas e receber orientações
* 🤝 Encontrar outros usuários Cochlear e partilhar experiências

Você gostaria de participar?`;

      let contador = 0;

      for (const c of contatos) {
        try {

          const numeroBase = String(c.numero).replace(/\D/g, '');

          let contato = await client.getNumberId(numeroBase);

          // tenta sem o 9
          if (!contato && numeroBase.length === 13) {
            const sem9 = numeroBase.slice(0,4) + numeroBase.slice(5);
            contato = await client.getNumberId(sem9);
          }

          if (!contato) {
            console.log('Não consegui resolver:', numeroBase);
            continue;
          }

          await client.sendMessage(contato._serialized, imagem, {
            caption: mensagem
          });

          console.log('Enviado pra', numeroBase);

          contador++;

          await delay(9000);

          if (contador % 20 === 0) {
            console.log('Pausa maior 😴');
            await delay(60000);
          }

        } catch (e) {
          console.log('Erro no número', c.numero, e.message);
        }
      }

      console.log('Finalizado ✅');
    });
}
