```mermaid
erDiagram
    Usuarios {
        uuid id_usuario PK
        varchar email UK
        varchar password_hash
        enum rol
        timestamp fecha_creacion
        timestamp fecha_actualizacion
    }

    PerfilesEmpresas {
        uuid id_perfil_empresa PK
        uuid id_usuario FK
        varchar nombre_empresa
        text descripcion
        varchar sitio_web
        varchar direccion
        varchar logo_url
    }

    PerfilesEstudiantes {
        uuid id_perfil_estudiante PK
        uuid id_usuario FK
        uuid id_universidad FK
        varchar nombres
        varchar apellidos
        varchar carrera
        varchar cv_url
        varchar perfil_linkedin
    }

    Universidades {
        uuid id_universidad PK
        varchar nombre UK
        varchar dominio_email UK
    }

    Pasantias {
        uuid id_pasantia PK
        uuid id_usuario_publica FK
        uuid id_perfil_empresa FK
        uuid id_categoria FK
        varchar titulo
        text descripcion
        text responsabilidades
        text requisitos
        enum modalidad
        varchar duracion
        enum estado
        timestamp fecha_publicacion
        date fecha_limite
    }

    Aplicaciones {
        uuid id_aplicacion PK
        uuid id_pasantia FK
        uuid id_usuario_estudiante FK
        enum estado
        timestamp fecha_aplicacion
    }

    Categorias {
        uuid id_categoria PK
        varchar nombre UK
    }

    Habilidades {
        uuid id_habilidad PK
        varchar nombre UK
    }

    Pasantias_Habilidades {
        uuid id_pasantia FK
        uuid id_habilidad FK
    }

    Estudiantes_Habilidades {
        uuid id_perfil_estudiante FK
        uuid id_habilidad FK
    }

    %% RELACIONES

    Usuarios ||--|| PerfilesEmpresas : "tiene"
    Usuarios ||--|| PerfilesEstudiantes : "tiene"
    Universidades ||--o{ PerfilesEstudiantes : "pertenece"
    Usuarios ||--o{ Pasantias : "publica"
    PerfilesEmpresas ||--o{ Pasantias : "ofrece"
    Categorias ||--o{ Pasantias : "clasifica"
    Pasantias ||--o{ Aplicaciones : "recibe"
    Usuarios ||--o{ Aplicaciones : "postula"
    Pasantias ||--o{ Pasantias_Habilidades : "requiere"
    Habilidades ||--o{ Pasantias_Habilidades : "posee"
    PerfilesEstudiantes ||--o{ Estudiantes_Habilidades : "tiene"
    Habilidades ||--o{ Estudiantes_Habilidades : "posee"
```

---

## 1. Estructura del Proyecto

```plaintext
📂 src
├── app.css / app.d.ts / app.html / hooks.server.ts / i18n.ts
├── lib/               # Librerías internas y componentes reutilizables
│   ├── components/    # Componentes UI (auth, chat, forms, skeletons, ui, etc.)
│   ├── config/        # Configuración (API, Firebase, permisos)
│   ├── constants/     # Constantes globales (app, navegación, etc.)
│   ├── defaults/      # Valores por defecto y JSONs iniciales
│   ├── icons/         # Íconos SVG en formato .svelte
│   ├── interface/     # Definición de interfaces TypeScript
│   ├── services/      # Lógica de negocio (auth, chat, items, etc.)
│   ├── stores/        # Estado global (Svelte stores)
│   ├── types/         # Tipos adicionales
│   ├── utils/         # Funciones auxiliares (UID, storage, fecha, zod, etc.)
│   └── validation/    # Validaciones centralizadas
├── routes/            # Rutas SvelteKit (+page.svelte, +layout.svelte, etc.)
│   ├── auth/          # Autenticación (sign-in, sign-up)
│   ├── settings/      # Configuración (usuarios, API keys, estadísticas, etc.)
│   ├── stream/        # Streaming (sessionId dinámico)
└── hooks/             # Hooks de servidor (autenticación, middlewares)
```

---

## 2. Diagrama de Componentes

```mermaid
flowchart TD
subgraph UI["lib/components"]
A[Navbar.svelte]
B[Sidebar.svelte]
C[UI Elements]
D[Auth Components]
E[Chat Components]
F[Charts]
end

    subgraph Stores["lib/stores"]
        US[userStore.ts]
        TS[themeStore.ts]
        CS[chatMessagesStore.ts]
        AS[authStore.ts]
    end

    subgraph Services["lib/services"]
        AuthS[auth.service.ts]
        ChatS[chatSSE.service.ts]
        UserS[user.service.ts]
    end

    UI --> Stores
    Stores --> Services
    Services --> API[(Backend API)]
```

---

## 3. Diagrama de Flujo de Datos

```mermaid
sequenceDiagram
participant User as Usuario
participant UI as Componente Svelte
participant Store as Store (userStore, authStore, etc.)
participant Service as Servicio (auth.service, chat.service)
participant API as Backend API

    User->>UI: Interacción (click, input, navegación)
    UI->>Store: Actualiza estado (set/update)
    Store-->>UI: Dispara reactividad ($store)
    UI->>Service: Invoca función (login, fetchChat, etc.)
    Service->>API: fetch() datos
    API-->>Service: Devuelve JSON
    Service->>Store: Guarda datos en estado
    Store-->>UI: Renderiza cambios en pantalla
```

---

## 4. Diagrama de Arquitectura y Rutas

```mermaid
classDiagram
    class routes {
      +auth/ (sign-in, sign-up)
      +settings/ (users, api-keys, statistics, system-prompts)
      +stream/ [[sessionId]]
    }

    class lib {
      +components/
      +config/
      +constants/
      +defaults/
      +icons/
      +interface/
      +services/
      +stores/
      +utils/
      +validation/
    }

    class hooks {
      +server.ts
    }

    src --> routes
    src --> lib
    src --> hooks
```
