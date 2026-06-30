# 🐾 UriPet Web

Frontend web de **UriPet**, una plataforma para la gestión de mascotas desarrollada para el curso **Desarrollo Basado en Plataformas (DBP)**.

## Tecnologías

- React
- TypeScript
- Vite
- Axios
- React Router
- React Toastify

## Funcionalidades

- Inicio de sesión y registro
- Dashboard de mascotas
- Búsqueda de mascotas
- Crear, editar y eliminar mascotas
- Gestión de responsables
- Historial médico
- Perfil público mediante código QR
- Subida de hasta 3 imágenes por mascota
- Integración con el backend mediante API REST

## Requisitos

- Node.js 20 o superior
- npm

## Instalación

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` con el siguiente contenido:

```env
VITE_API_URL=http://localhost:8080
```

> En producción, reemplazar la URL por la del backend desplegado.

## Ejecutar en desarrollo

```bash
npm run dev
```

## Generar versión de producción

```bash
npm run build
```

## Vista previa de producción

```bash
npm run preview
```

## Estructura del proyecto

```
src/
├── api/
├── components/
├── pages/
├── types/
├── assets/
└── App.tsx
```

## Integración

Este proyecto consume el backend de UriPet mediante una API REST protegida con JWT.