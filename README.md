<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Testing Teslo Shop API

## Descripción

Pruebas de la API REST Teslo Shop en [Nest](https://github.com/nestjs/nest), basada en el curso "NestJS + Testing: Pruebas unitarias y end to end (e2e)" en Udemy de [DevTalles](https://cursos.devtalles.com/).

## Preparar el proyecto

1. Instalar NestJS CLI

```bash
npm i -g @nestjs/cli
```

2. Clonar el repositorio

3. Instalar las dependencias

```bash
$ npm install
```

4. Clonar el archivo ```.env.template``` y renombrar la copia a ```.env```.

5. Completar las variables de entorno en el archivo ```.env```.

6. Levantar la base de datos

```bash
$ docker compose up -d
```

## Compilar y ejecutar el proyecto

```bash
# desarrollo
$ npm run start

# modo observación
$ npm run start:dev

# modo producción
$ npm run build
$ npm run start:prod
```

## Ejecutar SEED

<http://localhost:3000/api/seed>

## Ejecutar pruebas

```bash
# pruebas unitarias
$ npm run test

# pruebas e2e
$ npm run test:e2e

# prueba de cobertura
$ npm run test:cov
```
