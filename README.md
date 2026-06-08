# 🎓 App Scholar

Aplicação de gestão escolar desenvolvida com **React Native**, **Node.js**, **Express**, **Prisma** e **PostgreSQL**.


## 🎥 Apresentação do Projeto

Apresentação das funcionalidades básicas

📺 https://youtu.be/SvOF1I6b_bk


## 🛠 Tecnologias

### Backend

* Node.js + TypeScript
* Express
* Prisma ORM
* PostgreSQL
* Bcrypt
* JWT

### Frontend

* React Native
* Expo
* Axios
* React Navigation

---

## 🚀 Executando o Projeto

### Backend

```bash
cd AppScholar-API
npm install
```

Crie um arquivo `.env`:

```env
DATABASE_URL="prisma+postgres://SUA_URL_DO_PRISMA_POSTGRES"
JWT_SECRET="sua_chave_secreta"
JWT_EXPIRES_IN="1d"
```

O projeto utiliza Prisma Postgres/Accelerate.

1. Crie um banco no Prisma Postgres.
2. Copie a URL fornecida pelo painel.
3. Substitua o valor da variável `DATABASE_URL`.

Painel do Prisma:

https://console.prisma.io/login

Execute as migrations e o seed:

```bash
npx prisma migrate reset
```

> ⚠️ Este comando recria o banco de dados e remove todos os dados existentes.

Inicie a API:

```bash
npm run dev
```

### Frontend

```bash
cd AppScholar-App
npm install
```

Crie um arquivo `.env`:

```env
EXPO_PUBLIC_BASE_URL=http://SEU_IP_LOCAL:3000
EXPO_PUBLIC_VIA_CEP_URL=https://viacep.com.br/ws
```

Inicie o Expo:

```bash
npx expo start --clear
```

> Utilize o IP local da máquina e mantenha celular e computador na mesma rede.

---

## 🔑 Usuários de Teste

Senha padrão: `Senha@123`

| Perfil    | E-mail                                                              |
| --------- | ------------------------------------------------------------------- |
| ADMIN     | [admin@fatec.sp.gov.br](mailto:admin@fatec.sp.gov.br)               |
| PROFESSOR | [carlos.silva@fatec.sp.gov.br](mailto:carlos.silva@fatec.sp.gov.br) |
| STUDENT   | [adson.aluno@fatec.sp.gov.br](mailto:adson.aluno@fatec.sp.gov.br)   |

---

## 📚 Principais Entidades

* User
* Course
* Subject
* Student
* Professor
* Grade
* UserInvitation

---

## 🔐 Segurança

* JWT Authentication
* Bcrypt Password Hashing
* Controle de acesso por Roles (RBAC)
