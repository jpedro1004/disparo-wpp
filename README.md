# 📲 Disparo de WhatsApp com imagem (whatsapp-web.js)

Script simples em **Node.js** para envio automático de mensagens no WhatsApp utilizando **WhatsApp Web**.

Perfeito para campanhas pontuais como convites, avisos e comunicação com clientes.

---

## 🚀 O que ele faz

* Lê contatos a partir de um CSV
* Envia **imagem + mensagem** para cada contato
* Delay automático entre envios (comportamento humano)
* Pausa a cada 20 mensagens para evitar bloqueio
* Tenta número com e sem o 9 automaticamente
* Ignora números inválidos
* Mantém sessão salva (não precisa logar toda vez)

---

## 📁 Estrutura do projeto

```
index.js
contatos.csv
imagem.jpg
package.json
.gitignore
```

---

## 📄 Formato do CSV

Arquivo deve conter pelo menos:

```
numero,nome
5548999999999,Joao
5548988888888,Maria
```

Regras:

* Formato internacional (55 + DDD + número)
* Sem símbolos (script limpa automaticamente)
* Linhas vazias são ignoradas

---

## 🛠 Instalação

```bash
npm install
```

Dependências principais:

* whatsapp-web.js
* qrcode-terminal
* csv-parser

---

## ▶️ Como rodar

```bash
node index.js
```

Na primeira execução:

1. QR Code aparece no terminal
2. Escanear com o WhatsApp do número que fará o disparo
3. Script inicia automaticamente

Sessão fica salva para próximas execuções.

---

## ⚠️ Boas práticas (evitar bloqueio)

* Intervalo entre mensagens já configurado (≈9s)
* Pausa automática a cada 20 envios
* Não rodar múltiplas campanhas seguidas
* Usar com base de clientes real
* Responder quem interagir após disparo

---

## 🔒 Segurança

Itens que **não devem ser versionados**:

* `.wwebjs_auth` (sessão WhatsApp)
* `.wwebjs_cache`
* `contatos.csv` (dados sensíveis)

Já incluídos no `.gitignore`.

---

## 💡 Possíveis melhorias

* Painel web para campanhas
* Logs de entregas
* Relatório de inválidos
* Múltiplos números
* Agendamento
* Integração com CRM
* Dockerização

---

## 🧠 Stack

* Node.js
* whatsapp-web.js
* WhatsApp Web

---

## 📌 Observação

Ferramenta pensada para **uso pontual e legítimo**, não para spam em massa.

Use com responsabilidade.

---

Feito para facilitar comunicação real com clientes ❤️
