// ★・・・・・・★・・・ KELLY VENTANIA FF ・・・★・・・・・・★
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';
import { getContentType, jidDecode } from '@whiskeysockets/baileys';
import { exec } from 'child_process';
import util from 'util';

import { iniciarConexao } from './connection.js';
import { menus } from './dono/menus.js';
import { msg, consoleErro, consoleAviso } from './export.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ★・・・・・・★・・・ CONFIGURAÇÕES KELLY VENTANIA FF ・・・★・・・・・・★
let prefixo = '!';
let botName = 'Kelly Ventania FF';
let donoName = 'Comandante';
let ownerNumber = '';
let ownerLid = '';
let fotomenu = '';
let owners = [];
let okarunsite = "";
let API_KEY_KELLY = "";


const comandosFixos = [
{ name: 'selo', category: 'sistema', description: 'Exibe o selo de autenticidade do bot.' },
{ name: 'setprefix', category: 'donos', description: 'Altera o prefixo do bot.', ownerOnly: true }
];

function carregarConfig() {
try {
const config = JSON.parse(fs.readFileSync('./dono/config.json', 'utf8'));
prefixo = config.prefixo || '!';
botName = config.botName || 'Kelly Ventania FF';
donoName = config.donoName || 'Comandante';
API_KEY_KELLY = config.API_KEY_KELLY || "Koba";
okarunsite = config.okarunsite || "https://okarun-api.com.br";
ownerNumber = config.ownernumber || '';
ownerLid = config.ownerLid || '';
fotomenu = config.fotomenu || '';

owners = [];
if (ownerNumber) owners.push(ownerNumber.split('@')[0]);
if (ownerLid) owners.push(ownerLid.split('@')[0]);
if (config.owners && Array.isArray(config.owners)) {
config.owners.forEach(o => owners.push(o.toString().split('@')[0]));
}
owners = [...new Set(owners)];
console.log(`[CONFIG] Donos configurados: ${owners.join(', ')}`);
} catch (e) {
consoleAviso('Arquivo config.json não encontrado ou inválido. Usando padrões.');
}
}
carregarConfig();

// ★・・・・・・★・・・ CARREGAMENTO DE PLUGINS POR PASTAS ・・・★・・・・・・★
const plugins = new Map();
async function carregarPlugins(dir = path.join(__dirname, 'plugins')) {
if (!fs.existsSync(dir)) return;
const files = fs.readdirSync(dir);
for (const file of files) {
const fullPath = path.join(dir, file);
const stat = fs.statSync(fullPath);
if (stat.isDirectory()) {
await carregarPlugins(fullPath);
} else if (file.endsWith('.js')) {
try {
const pluginPath = pathToFileURL(fullPath).href;
const plugin = (await import(pluginPath)).default;
if (plugin && plugin.name) {
if (!plugin.category) {
const pastaPai = path.basename(path.dirname(fullPath));
plugin.category = pastaPai === 'plugins' ? 'outros' : pastaPai;
}
plugins.set(plugin.name, plugin);
}
} catch (e) {
consoleErro(`Erro ao carregar plugin ${file}: ${e.message}`);
}
}
}
}

// ★・・・・・・★・・・ PARSE DE ARGUMENTOS ・・・★・・・・・・★
function parseArgs() {
const args = process.argv.slice(2);
const result = { method: null, number: null, reset: false };
for (let i = 0; i < args.length; i++) {
if (args[i] === '--method' && args[i + 1]) { result.method = args[i + 1]; i++; }
if (args[i] === '--number' && args[i + 1]) { result.number = args[i + 1]; i++; }
if (args[i] === '--reset') { result.reset = true; }
}
return result;
}

const cmdArgs = parseArgs();

if (cmdArgs.reset && fs.existsSync('./sessao')) {
try {
fs.rmSync('./sessao', { recursive: true, force: true });
consoleAviso('Sessão resetada!');
process.exit(0);
} catch (e) {
consoleErro(`Erro ao resetar sessão: ${e.message}`);
process.exit(1);
}
}

const decodeJid = (jid) => {
if (!jid) return jid;
if (/:\d+@/gi.test(jid)) {
const decode = jidDecode(jid) || {};
return (decode.user && decode.server && decode.user + '@' + decode.server) || jid;
}
return jid;
};

// ★・・・・・・★・・・ HANDLER DE MENSAGENS ・・・★・・・・・・★
function criarHandlerMensagens(conn) {
return async (chatUpdate) => {
try {
const m = chatUpdate.messages[0];
if (!m.message) return;
if (m.key && m.key.remoteJid === 'status@broadcast') return;

const from = m.key.remoteJid;
const type = getContentType(m.message);
const sender = m.key.participant || m.key.remoteJid;
const decodedSender = decodeJid(sender);
const isGroup = from.endsWith('@g.us');

let userLid = '';
if (m.key.participant) {
if (m.key.participant.includes('@lid')) {
userLid = m.key.participant;
} else if (m.key.participant.includes(':')) {
userLid = m.key.participant.split(':')[0] + '@lid';
} else {
userLid = m.key.participant.split('@')[0] + '@lid';
}
} else if (m.senderLid) {
userLid = m.senderLid;
}

const pushname = m.pushName || 'Jogador';
const senderNumber = decodedSender.split('@')[0];
const lidNumber = userLid ? userLid.split('@')[0] : '';
const isOwner = owners.includes(senderNumber) || (lidNumber && owners.includes(lidNumber));

/* ★ Lógica de ADM ★ */
let groupMetadata = isGroup ? await conn.groupMetadata(from).catch(() => null) : null;
let participants = groupMetadata ? groupMetadata.participants : [];
let groupAdmins = participants.filter(v => v.admin !== null).map(v => v.id);
let isAdmin = groupAdmins.includes(sender);
let isBotAdmin = groupAdmins.includes(conn.user.id.split(':')[0] + '@s.whatsapp.net') || groupAdmins.includes(conn.user.id);

const body =
type === 'conversation' ? m.message.conversation :
type === 'extendedTextMessage' ? m.message.extendedTextMessage.text :
type === 'imageMessage' ? m.message.imageMessage.caption :
type === 'videoMessage' ? m.message.videoMessage.caption : '';

const isCmd = body.startsWith(prefixo);
const command = isCmd ? body.slice(prefixo.length).trim().split(/ +/).shift().toLowerCase() : null;
const args = body.trim().split(/ +/).slice(1);

const responder = (texto) => conn.sendMessage(from, { text: texto }, { quoted: m });
const reagir = (emoji) => conn.sendMessage(from, { react: { text: emoji, key: m.key } });

if (isCmd) {
console.log(`[${new Date().toLocaleTimeString()}] 🌬️ Comando: ${prefixo}${command} de ${pushname} | Dono: ${isOwner ? 'SIM ✅' : 'NÃO ❌'} | ADM: ${isAdmin ? 'SIM ✅' : 'NÃO ❌'}`);
}

/* Eval e Exec (Sem Prefixo) */
if (body.startsWith('>') && !body.startsWith('>>')) {
if (!isOwner) return responder('❌ Apenas o Comandante pode usar este comando!');
try {
const code = body.slice(1).trim();
const result = await eval(`(async () => { ${code} })()`);
await responder('```' + util.format(result) + '```');
} catch (e) {
await responder('```' + util.format(e) + '```');
}
return;
}

if (body.startsWith('$')) {
if (!isOwner) return responder('❌ Apenas o Comandante pode usar este comando!');
const cmd = body.slice(1).trim();
exec(cmd, (err, stdout) => {
if (err) return responder('```' + util.format(err) + '```');
if (stdout) responder('```' + stdout + '```');
});
return;
}

/* LÓGICA DE PLUGINS */
// Eduh dev ne Vida !
if (isCmd && plugins.has(command)) {
const plugin = plugins.get(command);
if (plugin.ownerOnly && !isOwner) return responder('❌ Este comando é exclusivo do Comandante!');
if (plugin.admOnly && !isAdmin && !isOwner) return responder('❌ Este comando é exclusivo para os ADMs do squad!');

try {
await plugin.execute({ 
conn, from, m, body, args, responder, reagir, isOwner, isAdmin, isBotAdmin, 
pushname, botName, decodedSender, userLid, prefixo, donoName, fotomenu, 
plugins, comandosFixos, isGroup, groupMetadata , API_KEY_KELLY, okarunsite
});
return;
} catch (e) {
consoleErro(`Erro no plugin ${command}: ${e.message}`);
responder('💔 Erro ao executar o comando.');
return;
}
}

/* LÓGICA DE CASE (SWITCH) */
if (isCmd) {
switch (command) {
case 'selo':
await responder(`🚀 *${botName}* está pronto para o Booyah!\n\n🌬️ Conexão segura para o campo de batalha.\n🔥 Kelly Ventania FF - Seu parceiro para a vitória!`);
break;

case 'setprefix':
if (!isOwner) return responder('❌ Comando restrito ao Comandante.');
if (!args[0]) return responder(`Uso: ${prefixo}setprefix [novo prefixo]`);
{
const newConfig = JSON.parse(fs.readFileSync('./dono/config.json', 'utf8'));
newConfig.prefixo = args[0];
fs.writeFileSync('./dono/config.json', JSON.stringify(newConfig, null, 2));
await responder(`✅ Prefixo alterado para: ${args[0]}\nReiniciando...`);
setTimeout(() => process.exit(), 1000);
}
break;

default:
if (!plugins.has(command)) {
responder('🎲 *Esse comando não existe no seu arsenal de batalha!* 🎲');
}
}
}
} catch (err) {
consoleErro(`Erro no processamento da mensagem: ${err.message}`);
}
};
}

async function iniciarBot() {
await carregarPlugins();
console.log(`[PLUGINS] ${plugins.size} plugins carregados.`);
const conn = await iniciarConexao(botName, cmdArgs.method, cmdArgs.number);
conn.ev.on('messages.upsert', criarHandlerMensagens(conn));
}

iniciarBot().catch((err) => consoleErro(`Erro ao iniciar a Kelly Ventania FF: ${err.message}`));

fs.watchFile(__filename, (curr, prev) => {
if (curr.mtime.getTime() !== prev.mtime.getTime()) {
consoleAviso('Arquivo principal alterado. Reiniciando...');
process.exit();
}
});
