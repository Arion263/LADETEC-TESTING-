# Task Manager - Sistema de Gestión de Tareas

## Descripción
Sistema de gestión de tareas desarrollado con Vue 3 + TypeScript en el frontend y Django REST Framework en el backend. Permite la gestión completa de tareas con autenticación JWT, filtros dinámicos y una interfaz de usuario moderna usando Vuetify 3.

## Requisitos Previos
- Node.js (v16 o superior)
- Python (3.8 o superior)
- pip (gestor de paquetes de Python)
- npm o yarn
- Git

## Instalación

### 1. Clonar el Repositorio
bash
`git clone https://github.com/Arion263/LADETEC-TESTING-.git`

### 2. Configuración del Backend (Django)

#### 2.1. Crear y activar entorno virtual

`python -m venv LADETEC`

cd `LADETEC`

`cd backend`

-En Windows

`LADETEC\Scripts\activate` o utilizar el comando en shell $activate_ladetec.ps1 adjunto para activar el ambiente en la direccion predeterminada

-En Linux/Mac

`source venv/bin/activate`

#### 2.2. Instalar dependencias

`pip install -r requirements.txt`

#### 2.3. Aplicar migraciones

`python manage.py migrate`

#### 2.4. Crear superusuario (opcional)

`python manage.py createsuperuser`

#### 2.5. Iniciar servidor de desarrollo

`python manage.py runserver`

### 3. Configuración del Frontend (Vue)

#### 3.1. Navegar al directorio frontend

`cd frontend`

#### 3.2. Instalar dependencias

`npm install`

o

`yarn install`

o

`pnpm install`

#### 3.3. Iniciar servidor de desarrollo

`npm run dev`

o

`yarn dev`

o

`pnpm dev`
