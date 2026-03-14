#!/bin/bash
# Kelly Ventania FF - Auto-restart com detecção de sessão

while :
do
  # Verifica se a pasta de sessão existe
  if [ ! -d "./sessao" ]; then
    echo ""
    echo "🔥 KELLY VENTANIA FF - ESCOLHA O MÉTODO DE CONEXÃO"
    echo ""
    echo "  [1] 📷 QR Code - Escanear com o WhatsApp"
    echo "  [2] 🔢 Pairing Code - Código de 8 dígitos"
    echo ""
    
    # Loop até receber uma opção válida
    while true; do
      read -p "👉 Digite 1 ou 2: " opcao
      
      if [ "$opcao" = "1" ]; then
        echo ""
        echo "⏳ Iniciando bot com QR Code..."
        echo ""
        node index.js --method qr
        break
      elif [ "$opcao" = "2" ]; then
        read -p "📱 Digite seu número com DDI e DDD (ex: 5511999999999): " numero
        
        # Validar se o número foi fornecido
        if [ -z "$numero" ]; then
          echo "❌ Número não pode estar vazio!"
          echo ""
          continue
        fi
        
        echo ""
        echo "⏳ Iniciando bot com Pairing Code..."
        echo ""
        node index.js --method pairing --number "$numero"
        break
      else
        echo "❌ Opção inválida! Digite apenas 1 ou 2."
        echo ""
      fi
    done
  else
    # Sessão já existe, inicia o bot direto
    echo ""
    echo "🚀 Sessão detectada! Iniciando Kelly Ventania FF..."
    echo ""
    node index.js
  fi
  
  sleep 2
done
