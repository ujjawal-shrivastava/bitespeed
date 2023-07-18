
# Bitespeed Backend Task: Identity Reconciliation

I have successfully completed and tested the given task.




## Tech Stack

**Database:** PostgreSQL (Docker Image)

**Server:** Typescript, Node, Express, Prisma




## Hosted API

I have hosted the API on my own server at https://bitespeed.ujjawal.co/

*Postman collection is also added to the repo.*

**Endpoint:** `/identify`

**Postman Documentation:** https://documenter.getpostman.com/view/15719295/2s946h8CdB
## Environment Variables

To start with, you will need to add the following environment variables to your .env file

```bash
PORT=8000
POSTGRES_USER='bitespeed'
POSTGRES_PASSWORD='somesecurepassword'
POSTGRES_DB='bitespeed'
POSTGRES_HOST='postgres'
POSTGRES_PORT=6500
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"
```

## Docker

To start the API and Postgres services run

```bash
  docker compose up
```

