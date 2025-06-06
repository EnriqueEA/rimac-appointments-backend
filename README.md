# Sistema de Gestión de Citas Rimac - Backend

Un servicio serverless para la gestión de citas médicas desarrollado con TypeScript y arquitectura hexagonal, desplegado en AWS.

## 📋 Descripción

Este sistema permite crear y gestionar citas médicas para diferentes países (Perú y Chile), utilizando una arquitectura de microservicios basada en eventos y colas de mensajes.

## 🏗️ Arquitectura

El proyecto implementa **Clean Architecture** (Arquitectura Hexagonal) con las siguientes capas:

```
src/
├── domain/          # Entidades y reglas de negocio
├── application/     # Casos de uso y DTOs
├── infrastructure/  # Implementaciones de repositorios y servicios
└── presentation/    # Controladores y handlers HTTP/SQS
```

### Componentes de AWS

- **AWS Lambda**: Funciones serverless para procesamiento
- **DynamoDB**: Base de datos NoSQL para almacenamiento principal
- **MySQL**: Bases de datos relacionales por país (PE/CL)
- **SNS**: Notificaciones para distribución de mensajes
- **SQS**: Colas para procesamiento asíncrono
- **EventBridge**: Bus de eventos para comunicación entre servicios
- **API Gateway**: Exposición de endpoints REST

## 🚀 Características

- ✅ **Gestión de citas médicas** por país (PE/CL)
- ✅ **Arquitectura orientada a eventos** con SNS/SQS
- ✅ **Persistencia híbrida** (DynamoDB + MySQL)
- ✅ **Validación de datos** y manejo de errores
- ✅ **Testing unitario** con Jest
- ✅ **Documentación automática** con Swagger
- ✅ **Linting y formateo** con ESLint y Prettier

## 📚 Flujo de Procesamiento

1. **Cliente** envía solicitud de cita via HTTP
2. **API Gateway** → **Lambda principal** almacena en DynamoDB
3. **SNS** distribuye mensaje según país (PE/CL)
4. **SQS** encola por país específico
5. **Lambda específico** procesa y persiste en MySQL
6. **EventBridge** publica evento de completado
7. **SQS de completion** actualiza estado en DynamoDB

## 🛠️ Tecnologías

- **Runtime**: Node.js 20.x
- **Lenguaje**: TypeScript
- **Framework**: Serverless Framework
- **Base de datos**: DynamoDB, MySQL (TypeORM)
- **Servicios AWS**: Lambda, SNS, SQS, EventBridge, API Gateway
- **Testing**: Jest
- **Linting**: ESLint + Prettier

## 📦 Instalación

### Prerrequisitos

- Node.js 20.x o superior
- AWS CLI configurado
- Serverless Framework

### Configuración

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd rimac-appointments-backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

4. **Compilar el proyecto**
   ```bash
   npm run build
   ```

## 🚀 Despliegue

### Desarrollo local
```bash
# Ejecutar en modo offline
npm run dev
```

### Despliegue en AWS
```bash
# Desplegar a AWS
npm run deploy

# Generar documentación Swagger
npm run swagger
```

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm test

# Ejecutar linting
npm run lint

# Formatear código
npm run format
```

## 📍 Endpoints API

### Crear Cita
```http
POST /
Content-Type: application/json

{
  "insuredId": "12345",
  "scheduleId": 1,
  "countryISO": "PE"
}
```

### Listar Citas por Asegurado
```http
GET /appointments/{insuredId}
```

## 🗂️ Estructura del Proyecto

```text
├── src/
│   ├── application/
│   │   ├── dtos/              # Data Transfer Objects
│   │   ├── ports/             # Interfaces/Contratos
│   │   └── use-cases/         # Casos de uso de negocio
│   ├── domain/
│   │   ├── entities/          # Entidades de dominio
│   │   └── value-objects/     # Objetos de valor
│   ├── infrastructure/
│   │   ├── database/          # Configuración de BD
│   │   ├── repositories/      # Implementación repositorios
│   │   └── services/          # Servicios externos
│   └── presentation/
│       ├── controllers/       # Handlers Lambda
│       ├── handlers/          # Manejadores HTTP/SQS
│       └── validators/        # Validaciones
├── tests/                     # Tests unitarios
├── serverless.yml            # Configuración Serverless
└── package.json
```

## 🔧 Variables de Entorno

```bash
# Base de datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=password
DB_NAME_PE=appointments_peru
DB_NAME_CL=appointments_chile

# Las variables de AWS se configuran automáticamente via Serverless
```

## 📖 Patrones Implementados

- **Repository Pattern**: Abstracción de acceso a datos
- **Use Case Pattern**: Encapsulación de lógica de negocio
- **Factory Pattern**: Creación de conexiones de BD
- **Mapper Pattern**: Transformación entre capas
- **Dependency Injection**: Inversión de dependencias
