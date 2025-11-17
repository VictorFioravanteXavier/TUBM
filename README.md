# TUBM

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Status](https://img.shields.io/badge/status-active-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-1.0.0-orange)

![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-b4ca65?logo=ejs&logoColor=000)
![Webpack](https://img.shields.io/badge/Webpack-1C78C0?logo=webpack&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)

![MVC](https://img.shields.io/badge/MVC-4B0082?logoColor=white)

**TUBM** é uma aplicação web de código aberto desenvolvida por **Victor Fioravante Xavier**.
Ela funciona como um projeto-base modular, combinando **Node.js**, **Express**, **EJS** e **Webpack**, otimizado para uma estrutura limpa, escalabilidade e implantação via **Vercel**.

Live demo: **https://tubm-teste.vercel.app**

---

## 🚀 Overview

TUBM foi projetado para ser um gerenciador de vendas e compras simples e prático, proporcionando agilidade ao enviar contas pendentes de quem possui uma conta no sistema.

---

## 🧱 Project Structure

- **/frontend** → Código do frontend (EJS, CSS, JS)  
- **/public/assets/js** → Scripts públicos  
- **/src** → Scripts do lado do servidor (back-end)  
- **server.js** → Ponto de entrada principal do servidor  
- **routes.js** → Rotas da aplicação  
- **webpack.config.js** → Configuração de empacotamento (bundling) do Webpack  
- **package.json** → Scripts e dependências do projeto  
- **vercel.json** → Configuração de implantação

---

## 💻 Instalação & Configuração

### 1. Clonar o repositório
```bash
git clone https://github.com/VictorFioravanteXavier/TUBM.git
cd TUBM 
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
```bash
Create a .env file:

# URL de conexão com o banco de dados (MongoDB, por exemplo)
DATABASE_URL=mongodb://localhost:27017/tubm

# Email usado pelo sistema para envio de notificações
EMAIL_USER=seuemail@exemplo.com

# ID do cliente da conta de email usada para autenticação OAuth2
CLIENT_ID=seu_client_id

# Secret do cliente da conta de email
CLIENT_SECRET=seu_client_secret

# Token de atualização para autenticação OAuth2
REFRESH_TOKEN=seu_refresh_token

```

### 4. Iniciar o servidor de desenvolvimento
```bash
# Rodar o servidor em modo de desenvolvimento
npm run dev

# Iniciar o servidor normalmente
npm start

Acesse sua instância local em:
http://localhost:3000
```

## 🚀 Features Principais

- **Gerenciamento de contas de usuários** – Envio de emails automáticos com informações de contas e notificações.  
- **Controle de vendas** – Registrar, acompanhar e gerenciar todas as vendas realizadas.  
- **Controle de compras** – Acompanhar e gerenciar todas as compras realizadas.  
- **Gerenciamento de estoque** – Monitorar produtos, quantidades e status do estoque em tempo real.  
- **Rotas de servidor organizadas** – Estrutura limpa e modular para facilitar a manutenção.  
- **Renderização dinâmica com EJS** – Conteúdo dinâmico no frontend gerado pelo servidor.  
- **Arquitetura modular de frontend** – Frontend estruturado de forma escalável e fácil de manter.  
- **Empacotamento de assets com Webpack** – Atualizações automáticas durante o desenvolvimento.  
- **Implantação automática via Vercel** – Deploy simplificado e integração contínua.  
- **Suporte a módulos e extensões futuras** – Projeto pensado para crescer e se adaptar a novas funcionalidades.

## 🤝 Contribuindo

Contribuições são bem-vindas!  

### Passos para contribuir:

1. **Faça um fork do repositório**  

2. **Crie uma nova branch**:
```bash
git checkout -b feature/nova-funcionalidade
```

3. Faça commit das suas alterações:
```bash
git commit -m "Add new feature"
```

4. Envie e crie um Pull Request:
```bash
git push origin feature/nova-funcionalidade
```

## 📄 Licença

Este projeto está licenciado sob a **Licença MIT**.  
Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.


## 📬 Contato

- **Autor:** Victor Fioravante Xavier
- **[Email](mailto:victor.fx0910@gmail.com)**
- **[GitHub](https://github.com/VictorFioravanteXavier)** 
- **[LinkedIn](https://www.linkedin.com/in/victor-fior/)** 


## ⭐ Apoie o Projeto

Se você gosta deste projeto, considere dar uma **estrela no GitHub**!  
Isso ajuda na visibilidade e no desenvolvimento futuro.