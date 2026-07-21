# PostgreSQL no EasyPanel

O projeto usa a variável `DATABASE_URL` para se conectar ao PostgreSQL.

## 1. Criar o serviço

No EasyPanel, crie um serviço PostgreSQL e defina:

- banco: `ortofernandes`
- usuário exclusivo para a aplicação
- senha longa e aleatória
- backups automáticos

Não reutilize o usuário administrador do PostgreSQL na aplicação.

## 2. Escolher o tipo de acesso

### Aplicação também hospedada no EasyPanel

Use o nome interno do serviço como host e mantenha a porta restrita à rede privada. Nesse caso:

```env
DATABASE_URL=postgresql://usuario:senha@nome-do-servico:5432/ortofernandes
DATABASE_SSL=disable
```

### Aplicação hospedada na Vercel

O endereço interno do EasyPanel não é acessível pela Vercel. Crie um endpoint TCP externo com TLS, use um domínio próprio e restrinja o acesso tanto quanto a infraestrutura permitir.

```env
DATABASE_URL=postgresql://usuario:senha@postgres.seudominio.com:5432/ortofernandes
DATABASE_SSL=require
DATABASE_POOL_MAX=5
```

Não exponha o PostgreSQL publicamente sem senha forte, TLS, firewall e backups. Se a política da VPS exigir IP fixo, use saída estática na hospedagem da aplicação ou um proxy/pooler seguro.

Caracteres especiais no usuário ou na senha precisam estar codificados para URL. Por exemplo, `@` vira `%40`.

## 3. Configurar as variáveis

Cadastre `DATABASE_URL`, `DATABASE_SSL` e `DATABASE_POOL_MAX` no ambiente em que a aplicação será executada. Nunca envie a URL real para o GitHub.

Para desenvolvimento local, copie `.env.example` para `.env.local` e substitua apenas os valores locais.

## 4. Criar as tabelas

Com `DATABASE_URL` disponível no terminal, execute:

```bash
npm run db:postgres:migrate
```

O script cria as tabelas e índices necessários. Ele pode ser executado novamente com segurança.

## 5. Ativar na Vercel

Adicione as variáveis nos ambientes `Production` e `Preview` do projeto `ortofernandeslab` e faça uma nova implantação. A primeira consulta ao catálogo preenche automaticamente os produtos iniciais quando a tabela estiver vazia.

## Dados existentes

Esta preparação cria a estrutura do novo banco. Pedidos, clientes e colaboradores já existentes no Cloudflare D1 não são copiados automaticamente; a exportação e importação devem ser feitas em uma etapa separada antes da troca definitiva.
