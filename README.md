# 🔥 Kelly Ventania FF - Bot WhatsApp

Bot WhatsApp automatizado para Free Fire com suporte a QR Code e Pairing Code.

## 📋 Requisitos

- Node.js 16+
- npm ou yarn
- Número de telefone WhatsApp ativo

## 🚀 Instalação

```bash
# Instalar dependências
npm install

# Ou com yarn
yarn install
```

## 🎮 Como Usar

### Opção 1: Script Automático (Recomendado)

```bash
chmod +x start.sh
./start.sh
```

O script irá:
1. Verificar se há uma sessão salva
2. Se não houver, pedir para escolher entre QR Code ou Pairing Code
3. Gerar o QR Code ou Pairing Code
4. Conectar automaticamente

### Opção 2: Comando Manual

#### Com QR Code:
```bash
node index.js --method qr
```

#### Com Pairing Code:
```bash
node index.js --method pairing --number 5511999999999
```

Substitua `5511999999999` pelo seu número com DDI (55 para Brasil) + DDD + número.

## 🔧 Resolvendo Problemas

### ❌ QR Code não está sendo exibido

**Solução:**
1. Certifique-se de que o terminal suporta caracteres especiais
2. Verifique se a biblioteca `qrcode-terminal` está instalada: `npm install qrcode-terminal`
3. Tente aumentar o tamanho da janela do terminal
4. Use um terminal mais moderno (VS Code, iTerm2, Windows Terminal, etc.)

### ❌ Pairing Code não é gerado

**Solução:**
1. Verifique se o número foi digitado corretamente (com DDI 55 para Brasil)
2. Aguarde 5-10 segundos após iniciar o bot
3. Certifique-se de que o WhatsApp está aberto no seu telefone
4. Tente resetar a sessão: `node index.js --reset`

### ❌ Conexão vira "pairing" mas o código não funciona

**Solução:**
1. Verifique se o código exibido está correto
2. Vá em WhatsApp > Configurações > Dispositivos vinculados
3. Clique em "Vincular com número de telefone"
4. Digite o código exatamente como mostrado (sem espaços)
5. Se não funcionar, tente resetar: `node index.js --reset`

### ❌ "Sessão encerrada" ou "Não autenticado"

**Solução:**
```bash
# Resetar a sessão completamente
node index.js --reset

# Depois inicie novamente
./start.sh
```

## 🔄 Resetar Sessão

Se tiver problemas de conexão, você pode resetar a sessão:

```bash
node index.js --reset
```

Isso irá deletar a pasta `sessao/` e você poderá configurar novamente.

## 📁 Estrutura de Arquivos

```
Kelly-FF/
├── index.js              # Arquivo principal do bot
├── connection.js         # Módulo de conexão WhatsApp
├── export.js            # Funções e utilitários
├── start.sh             # Script de inicialização
├── package.json         # Dependências
├── dono/
│   ├── config.json      # Configurações do bot
│   └── menus.js         # Menus de comandos
└── sessao/              # Pasta de credenciais (criada automaticamente)
```

## ⚙️ Configuração

Edite o arquivo `dono/config.json`:

```json
{
  "prefixo": "!",
  "botName": "Kelly Ventania FF",
  "donoName": "Comandante",
  "ownernumber": "5511999999999",
  "ownerLid": "",
  "fotoM": "https://link-da-sua-foto.jpg"
}
```

## 📝 Comandos Disponíveis

- `!menu` - Exibir menu principal
- `!menudono` ou `!owner` - Menu do proprietário
- `!info` - Informações do usuário
- `!ping` - Testar latência
- `!selo` - Informações do bot
- `!setprefix [novo]` - Alterar prefixo (apenas dono)
- `!restart` - Reiniciar bot (apenas dono)

## 🐛 Debug

Para ver logs detalhados, edite `connection.js` e altere:

```javascript
logger: pino({ level: 'silent' })
```

Para:

```javascript
logger: pino({ level: 'debug' })
```

## 📞 Suporte

Se encontrar problemas:

1. Verifique se todas as dependências estão instaladas: `npm install`
2. Certifique-se de usar Node.js 16 ou superior
3. Tente resetar a sessão: `node index.js --reset`
4. Verifique a conexão com a internet
5. Tente usar um terminal diferente

## ⚠️ Aviso Importante

- Este bot é para uso pessoal
- Respeite os termos de serviço do WhatsApp
- Não use para spam ou atividades ilegais
- O WhatsApp pode banir contas que usam bots não autorizados

---

**Kelly Ventania FF** - Seu parceiro para a vitória! 🔥
