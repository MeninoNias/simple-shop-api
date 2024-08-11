# E-commerce API

## Descrição

Este projeto é uma API REST simplificada para o gerenciamento de um sistema de e-commerce. A API gerencia clientes, produtos e pedidos, servindo como a base para uma aplicação de e-commerce mais complexa. A aplicação é responsável por gerenciar todas as interações entre o usuário e a gestão de produtos, armazenando e devolvendo os dados de um banco de dados conforme solicitado.

### Funcionalidades Principais

- **Gerenciamento de Clientes**: Criação, leitura, atualização e exclusão (CRUD) de informações de clientes.
- **Gerenciamento de Produtos**: CRUD de produtos disponíveis na loja.
- **Gerenciamento de Pedidos**: Criação, leitura e gestão dos pedidos realizados pelos clientes.

### Critérios Mínimos

- **Armazenamento de Dados**: Todos os dados devem ser armazenados em um banco de dados relacional.
- **API REST**: A aplicação deve seguir os princípios RESTful para a comunicação entre o cliente e o servidor.
- **Interações Seguras**: Implementação de autenticação e autorização para proteger as rotas e os dados sensíveis dos usuários.

### Tecnologias Utilizadas

- **Node.js**: Plataforma para executar o JavaScript no backend.
- **Express.js**: Framework web para Node.js.
- **PostgreSQL**: Banco de dados relacional utilizado para armazenar os dados.
- **Prisma ORM**: ORM (Object-Relational Mapping) utilizado para interagir com o banco de dados.
- **Docker**: Para containerização da aplicação e dos serviços associados.

## Como Rodar a Aplicação

### Pré-requisitos

- **Node.js** v18.x ou superior
- **Docker** e **Docker Compose** instalados