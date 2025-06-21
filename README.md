# Oz Store - Venda de Scripts FiveM/SAMP/MTA
Este projeto é um painel administrativo para gerenciar produtos voltados para FiveM, SAMP e MTA. O site oferece cadastro, listagem, filtragem e exclusão de scripts e serviços.

## Funcionalidades
- Cadastro de produtos com: nome, descrição, preço, categoria (Bypass, Spoofer, Otimização, Cursos), estoque, status e imagem
- Listagem com busca por nome e filtro por status (Ativo/Inativo)
- Ordenação por nome, preço e estoque
- Exclusão de produtos
- Interface moderna com React e Material-UI
- Integração com Supabase para banco de dados e imagens
- Pronto para integração com app mobile

## Tecnologias
- React (hooks, functional components)
- Material-UI (componentes e estilos)
- Supabase (PostgreSQL, Storage)

## Como usar
1. Clone o repositório
2. Configure supaBaseClient.js com URL e chave do Supabase
3. Instale dependências:
```bash
npm install
```
4. Inicie o projeto:
```bash
npm start
```

## Estrutura do banco (tabela products)
- id (UUID)
- name (string)
- description (string)
- price (float)
- category (string)
- stock (integer)
- status (string: Ativo/Inativo)
- imageurl (string)

## Observações
- Painel para gerenciar produtos vendidos no site
- Futura integração com app mobile para compras
