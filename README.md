# PokeCapture

Este é um Teste técnico da empresa Monocard.

## Descrição

Uma aplicação onde o usuario pode interagir com pokémons. O usuário pode encontrar pokemons aleatoriamente, capturá-los, soltá-los e visualizar a lista de pokemons capturados.

## Tecnologias
- Front-end: [NextJS](https://nextjs.org/)
- Back-end: [NestJS](https://nestjs.com/) e [TypeORM](https://typeorm.io/)
- Banco de dados: [PostgreSQL](https://www.postgresql.org/)
- Containerização: [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

- ## Instalação e configuração

  ### Pré-requisitos

  Antes de começar, você precisa ter instalado em sua máquina:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

- ### Passo a passo para rodar o projeto

- ### 1. Clone o repositório:

   ```bash
   git clone https://github.com/lucasramosb/PokeCapture.git
   ```
- ### 2. Navegue até o reposotorio:

   ```bash
   cd PokeCapture
   ```
- ### 3. Na pasta raíz do projeto, use o seguinte comando para iniciar os containers da aplicação e do banco de dados:

   ```bash
   docker-compose up -d
   ```
   Isso irá construir a imagem da aplicação, iniciar o Frontend, backend e o PostgreSQL.

- ### 4. Acesse a aplicação:
  
  Após a contrução das imagens, a aplicação estará disponível em http://localhost:3000

- ### 5. Parar os containers
  Quando quiser parar os containers, execute:
  ```bash
  docker-compose down
  ```

## Endpoints da aplicação

  - ### GET /pokemon
   ```bash
    http://localhost:3001/pokemon
   ```
  Retorna a lista de todos os Pokémons capturados.

   - ### POST /pokemon/capture
  ```bash
    http://localhost:3001/pokemon/capture
  ```
  Captura um novo Pokémon. O payload de exemplo para capturar um Pokémon deve ser no seguinte formato:

  ```json
  {
    "name": "Pikachu",
    "pokemonId": 25,
    "photo": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    "types": "electric"
  }
  ```
  - ### DELETE /pokemon/release/:id
     ```bash
    http://localhost:3001/pokemon/release/:id
     ```
  Solta o Pokémon com o ID(do banco de dados) fornecido.

  ## Testes
  Para rodar os testes da aplicação, no diretorio backend-app utilize o comando:
  ```bash
  npm run test
  ou
  npm run test:e2e
  ``` 
