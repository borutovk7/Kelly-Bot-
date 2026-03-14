import fs from 'fs';
import chalk from 'chalk';
import moment from 'moment-timezone';
import axios from 'axios';
import fetch from 'node-fetch';
import { readFileSync } from 'fs';

const configPath = './dono/config.json'; 
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const { prefixo, botName, donoName, fotomenu, okarunsite, API_KEY_KELLY } = config;

const msg = {
espere: "**🔥 Preparando o Drop! Aguarde um instante, Comandante. 🔥**",
dono: "**👑 Apenas o Comandante Supremo tem acesso a este arsenal! 👑**",
grupo: "**🎯 Este comando é exclusivo para o seu Squad! 🎯**",
premium: "⚡ Este é um comando de Elite! Que tal se tornar um jogador Premium e dominar o campo de batalha?",
query: "🤔 Ops! Parece que faltou um alvo. Por favor, adicione o valor ou nome após o comando. 🔫",
privado: "**💌 Este comando só funciona em mensagens privadas, Comandante! 💌**",
adm: "**🛡️ Acesso restrito aos Líderes de Squad! 🛡️**",
error: "**💔 Algo deu errado na zona segura. Tente novamente mais tarde! 💔**",
botadm: "**🤖 O bot precisa de permissões de Líder de Squad para garantir o Booyah! 🤖**",
}

//============( MENSAGENS DA API - KELLY VENTANIA FF )===========\\
const msgApi = {
erro: "Desculpe, ocorreu um erro na comunicação com o servidor. Tente novamente.",
paraQ: "Parece que falta um parâmetro essencial para a estratégia.",
esperar: "Aguarde um momento enquanto o bot traça a rota..."
}

const data = moment.tz('America/Sao_Paulo').format('DD/MM/YYYY');
const hora = moment.tz('America/Sao_Paulo').format('HH:mm:ss');

let timed = 'Boa Madrugada de Batalha 🌆';
if(hora > "05:30:00"){
timed = 'Bom Dia de Drop 🏙️' 
}
if(hora > "12:00:00"){
timed = 'Boa Tarde de Combate 🌇' 
}
if(hora > "19:00:00"){
timed = 'Boa Noite de Booyah 🌃' 
}   

const consoleVerde = (texto) => {console.log(chalk.green(texto))}
const consoleVerde2 = (texto, texto2) => {console.log(chalk.black(chalk.bgGreen(texto)), chalk.black(chalk.white(texto2)))}

const consoleVermelho = (texto) => {console.log(chalk.red(texto))}
const consoleVermelho2 = (texto, texto2) => {console.log(chalk.black(chalk.bgRed(texto)), chalk.black(chalk.white(texto2)))}

const consoleAmarelo = (texto) => {console.log(chalk.yellow(texto))}
const consoleAmarelo2 = (texto, texto2) => {console.log(chalk.black(chalk.bgYellow(texto)), chalk.black(chalk.white(texto2)))}

const consoleAzul = (texto) => {console.log(chalk.blue(texto))}
const consoleAzul2 = (texto, texto2) => {console.log(chalk.black(chalk.bgBlue(texto)), chalk.black(chalk.white(texto2)))}

const consoleErro = (texto) => {console.log(chalk.black(chalk.bgRed(`[ ERRO NO CAMPO DE BATALHA ]`)), chalk.black(chalk.white(`Erro: ${texto}`)))}

const consoleAviso = (texto) => {console.log(chalk.black(chalk.bgYellow(`[ ALERTA FF ]`)), chalk.black(chalk.white(texto)))}

const consoleSucesso = (texto) => {console.log(chalk.black(chalk.bgGreen(`[ BOOYAH! ]`)), chalk.black(chalk.white(texto)))}

const consoleOnline = (texto) => {console.log(chalk.black(chalk.bgGreen(`[ KELLY VENTANIA ONLINE ]`)), chalk.black(chalk.white(texto)))}

const getBuffer = async (url, options) => {
try {
options ? options : {}
const res = await axios({
method: "get",
url,
headers: {
'DNT': 1,
'Upgrade-Insecure-Request': 1
},
...options,
responseType: 'arraybuffer'
})
return res.data
} catch (err) {
return err
}
}

async function fetchJson (url, options) {
try {
options ? options : {}
const res = await axios({
method: 'GET',
url: url,
headers: {
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
},
...options
})
return res.data
} catch (err) {
return err
}
}


const selo = {key: {fromMe: false, participant: '0@s.whatsapp.net'}, message: { "extendedTextMessage": {"text": botName,"title": null,'thumbnailUrl': null}}}


const seloGpt = {"key": {"participant": "18002428478@s.whatsapp.net","remoteJid": "status@broadcast", "fromMe": false,},"message": {
"contactMessage": {
"displayName": "Chat GPT", "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:;Chat GPT;;;\nFN:Chat GPT\nitem1.TEL;waid=18002428478:18002428478\nitem1.X-ABLabel:Celular\nEND:VCARD`, "contextInfo": {"forwardingScore": 1,"isForwarded": true}}}};


const seloMeta = {"key": {"participant": "13135550002@s.whatsapp.net","remoteJid": "status@broadcast", "fromMe": false,},"message": {
"contactMessage": {
"displayName": "Meta IA", "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:;Chat GPT;;;\nFN:Meta IA\nitem1.TEL;waid=13135550002:13135550002\nitem1.X-ABLabel:Celular\nEND:VCARD`, "contextInfo": {"forwardingScore": 1,"isForwarded": true}}}};

const seloLuzia = {"key": {"participant": "5511972553036@s.whatsapp.net","remoteJid": "status@broadcast", "fromMe": false,},"message": {
"contactMessage": {
"displayName": "LuzIA", "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:;LuzIA;;;\nFN:LuzIA\nitem1.TEL;waid=5511972553036:5511972553036\nitem1.X-ABLabel:Celular\nEND:VCARD`, "contextInfo": {"forwardingScore": 1,"isForwarded": true}}}};

const seloLaura = {"key": {"participant": "556191969269@s.whatsapp.net","remoteJid": "status@broadcast", "fromMe": false,},"message": {
"contactMessage": {
"displayName": "Laura AI", "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:;Laura AI;;;\nFN:Laura AI\nitem1.TEL;waid=556191969269:556191969269\nitem1.X-ABLabel:Celular\nEND:VCARD`, "contextInfo": {"forwardingScore": 1,"isForwarded": true}}}};


const seloCopilot = {"key": {"participant": "18772241042@s.whatsapp.net","remoteJid": "status@broadcast", "fromMe": false,},"message": {
"contactMessage": {
"displayName": "Microsoft Copilot", "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:;Microsoft Copilot;;;\nFN:Microsoft Copilot\nitem1.TEL;waid=18772241042:18772241042\nitem1.X-ABLabel:Celular\nEND:VCARD`, "contextInfo": {"forwardingScore": 1,"isForwarded": true}}}};


export { msg, msgApi, consoleVerde, consoleVerde2, consoleVermelho, consoleVermelho2, consoleAmarelo, consoleAmarelo2, consoleAzul, consoleAzul2, consoleErro, consoleAviso, consoleOnline, consoleSucesso, fetchJson, getBuffer, timed, data, hora, selo, seloMeta, seloGpt, seloLuzia, seloLaura, seloCopilot };
