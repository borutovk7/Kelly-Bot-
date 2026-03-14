// ★・・・・・・★・・・ KELLY VENTANIA FF - MÓDULO DE CONEXÃO ・・・★・・・・・・★
// Versão 12.0 - Correção do Erro 515 e Estabilidade Total

import makeWASocket, {
useMultiFileAuthState,
fetchLatestBaileysVersion,
DisconnectReason,
Browsers
} from '@whiskeysockets/baileys';

import pino from 'pino';
import { Boom } from '@hapi/boom';
import QRCode from 'qrcode';
import { consoleSucesso, consoleErro, consoleAviso, consoleOnline } from './export.js';
import cfonts from 'cfonts';

// ★・・・ TRAVA GLOBAL DE SEGURANÇA ・・・★
let pairingOrQrHandled = false;

// ★・・・・・・★・・・ INICIAR CONEXÃO ・・・★・・・・・・★
export async function iniciarConexao(botName, metodo = null, numero = null) {
const { state, saveCreds } = await useMultiFileAuthState('./sessao');
const { version } = await fetchLatestBaileysVersion();

consoleOnline(`Iniciando ${botName} v${version.join('.')}`);

// ★・・・ FUNÇÃO PARA EXIBIR BANNERS ・・・★
const exibirBanners = () => {
try {
const banner2 = cfonts.render(
`Nao tenho nenhum talento especial. Apenas sou apaixonadamente curioso...\nby:@paulo_mod_domina`,
{
font: 'console',
align: 'center',
gradient: ['#4B0082', '#800080']
}
);


const banner3 = cfonts.render(('KELLY| SYSTEM'), {
font: 'block',
align: 'center',
colors: ['whiteBright'],
background: 'transparent',
letterSpacing: 1,
lineHeight: 1,
space: true,
maxLength: '0',
gradient: ['red', 'green'],
independentGradient: true,
transitionGradient: true,
env: 'node'
});
console.log(banner3.string);
console.log(banner2.string);
} catch (e) {
consoleAviso('Erro ao renderizar banners: ' + e.message);
}
}

const usePairingCode = metodo === 'pairing';
let phoneNumber = numero ? numero.replace(/\D/g, '') : '';

/* Validação de número para Pairing Code */
if (usePairingCode && phoneNumber) {
if (phoneNumber.length < 10 || phoneNumber.length > 15) {
consoleErro(`Número formatado (${phoneNumber}) parece inválido! Verifique se incluiu o DDI (55 para Brasil).`);
} else {
consoleSucesso(`Número formatado para conexão: ${phoneNumber}`);
}
}

const conn = makeWASocket({
logger: pino({ level: 'silent' }),
printQRInTerminal: false,
qrTimeout: 180000,
browser: Browsers.ubuntu('Chrome'), 
auth: state,
version,
markOnlineOnConnect: true,
generateHighQualityLinkPreview: true,
syncFullHistory: true,
shouldSyncHistoryMessage: () => true,
getMessage: async () => ({ conversation: 'Olá' }),
});

// ★・・・ SALVAR CREDENCIAIS AUTOMATICAMENTE ・・・★
conn.ev.on('creds.update', saveCreds);

// ★・・・ EVENTOS DE CONEXÃO ・・・★
conn.ev.on('connection.update', async (update) => {
const { connection, lastDisconnect, qr } = update;

/* Lógica para Pairing Code */
if (usePairingCode && phoneNumber && !conn.authState.creds.registered && !pairingOrQrHandled) {
if (connection === 'connecting' || !!qr) {
pairingOrQrHandled = true; 

setTimeout(async () => {
try {
consoleSucesso(`Solicitando código de pareamento para: ${phoneNumber}`);
const code = await conn.requestPairingCode(phoneNumber);
console.log('\n🔢 SEU CÓDIGO DE PAREAMENTO ÚNICO:\n');
console.log(` 👉 ${code} 👈\n`);
console.log('Abra o WhatsApp > Configurações > Dispositivos vinculados');
console.log('> Vincular com número de telefone > Digite este código\n');
console.log('⏳ Aguardando sua confirmação no celular...\n');
} catch (err) {
consoleErro(`Erro ao gerar Pairing Code: ${err.message}`);
pairingOrQrHandled = false; 
}
}, 5000); 
}
}

/* Lógica para QR Code */
if (qr && !usePairingCode && !pairingOrQrHandled) {
pairingOrQrHandled = true;
try {
consoleSucesso('QR Code gerado! Escaneie com o WhatsApp para conectar.');
console.log('\n📷 QR Code:\n');
const qrString = await QRCode.toString(qr, { type: 'terminal', width: 10 });
console.log(qrString);
console.log('\n📷 Instruções:\n1. Abra o WhatsApp\n2. Vá em Dispositivos vinculados\n3. Escaneie o código acima\n');
} catch (err) {
consoleErro(`Erro ao renderizar QR Code: ${err.message}`);
pairingOrQrHandled = false;
}
}

/* Conexão Aberta */
if (connection === 'open') {
consoleSucesso(`${botName} conectada! Booyah! 🔥`);
pairingOrQrHandled = false;
// ★・・・ EXIBIR BANNERS APÓS CONEXÃO ・・・★
exibirBanners();
}

// ★・・・ RECONEXÃO INTELIGENTE COM TRATAMENTO DO ERRO 515 ・・・★
if (connection === 'close') {
const reason = lastDisconnect?.error instanceof Boom
? lastDisconnect.error.output.statusCode
: undefined;

if (reason === DisconnectReason.loggedOut) {
consoleErro('Sessão encerrada. Delete a pasta sessao e reinicie o bot.');
process.exit();
} else if (reason === 515 || reason === DisconnectReason.restartRequired) {
/* ★ ERRO 515: Restart Required - Ignorar durante pareamento */
if (!conn.authState.creds.registered) {
consoleAviso('⏳ Sincronizando com o WhatsApp... Aguarde...');
pairingOrQrHandled = false; 
} else {
consoleAviso('Reiniciando conexão para sincronização...');
setTimeout(() => {
iniciarConexao(botName, metodo, numero);
}, 3000);
}
} else {
/* Outros motivos de desconexão */
if (!conn.authState.creds.registered) {
consoleAviso('Aguardando pareamento... Se o código não funcionar, reinicie o bot manualmente.');
pairingOrQrHandled = false;
} else {
consoleAviso(`Conexão fechada (Motivo: ${reason}). Reiniciando bot em 5 segundos...`);
setTimeout(() => {
iniciarConexao(botName, metodo, numero);
}, 5000);
}
}
}
});
return conn;
}
