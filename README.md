# generic-vite Web UI

generic-vite Web UI is the frontend component of the generic-vite project. It is a **React-based web application** designed to provide an intuitive and seamless interface for users interacting with generic-vite's transcription, streaming, and summarization features.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Authentication Process](#authentication-process)
- [Installation and Setup](#installation-and-setup)
- [Development](#development)
- [Building and Deployment](#building-and-deployment)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

## Tech Stack

generic-vite Web UI utilizes the following technologies:

- **React** - Frontend framework for building UI components.
- **Vite** - Fast build tool for modern frontend applications.
- **Tailwind CSS** - Utility-first CSS framework for styling.
- **AWS Cognito** - Authentication and user management.
- **AWS Amplify** - Integration with Cognito for authentication flows.
- **React Router** - Client-side routing.
- **Jest & React Testing Library** - Testing framework.

## Authentication Process

generic-vite Web UI authenticates users via **AWS Cognito**, using a secure OAuth-based login flow. Below is the detailed authentication workflow:

1. **User Login Initiation**
   - The user navigates to `/login`.
   - The UI redirects the user to AWS Cognito’s hosted login page.

2. **Authentication with Cognito**
   - The user enters their credentials (email/password or social login via Google/Meta).
   - If authentication succeeds, Cognito redirects back to the UI with an authentication code.

3. **Token Exchange**
   - The frontend exchanges the authentication code for an **ID Token, Access Token, and Refresh Token** using Cognito’s OAuth endpoint.
   - Tokens are securely stored in **HTTP-only cookies** (not in localStorage/sessionStorage).

4. **Session Management**
   - **Access tokens** are used for API authentication (sent in the `Authorization: Bearer` header).
   - **Refresh tokens** allow automatic re-authentication without requiring the user to log in again.
   - Tokens expire based on Cognito's configured TTL.

5. **User Logout**
   - Upon logout, tokens are cleared from cookies.
   - The user is redirected to the login page.

### Authorization Flow
- **Public Routes:** Some pages (e.g., login, signup) are accessible without authentication.
- **Protected Routes:** If a user attempts to access protected routes without authentication, they are redirected to `/login`.

## Installation and Setup

To set up the project locally:

```sh
# Clone the repository
git clone https://github.com/generic-vite/generic-vite-web-ui.git
cd generic-vite-web-ui

# Install dependencies
npm install
```

### Environment Variables
Create a `.env` file and configure the necessary environment variables:

```ini
VITE_REQUEST_TIMEOUT=10000
VITE_MAX_RETRIES=3
VITE_API_BASE_URL=http://localhost:3010
```

## Development

Run the development server:

```sh
yarn dev
```

This will start the Vite development server on `http://localhost:3000/`.

## Building and Deployment

To create a production build:

```sh
yarn build
```

The output will be in the `dist/` folder, which can be deployed to a hosting provider such as **AWS S3 + CloudFront**.

## Folder Structure

```
📦 generic-vite-web-ui
├── 📂 src
│   ├── 📂 components    # Reusable UI components
│   ├── 📂 pages         # Page components (e.g., Login, Dashboard)
│   ├── 📂 hooks         # Custom React hooks
│   ├── 📂 utils         # Helper functions
│   ├── 📂 services      # API and authentication logic
│   ├── 📂 context       # Global state management (React Context)
│   ├── 📂 assets        # Static files
│   ├── main.tsx        # Entry point
│   ├── App.tsx         # Main application component
├── 📂 public           # Public static assets
├── 📄 vite.config.ts   # Vite configuration
├── 📄 tailwind.config.ts # Tailwind CSS configuration
├── 📄 tsconfig.json    # TypeScript configuration
├── 📄 package.json     # Dependencies and scripts
```

## Contributing

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Make changes and commit: `git commit -m "Add feature"`.
4. Push to the branch: `git push origin feature-name`.
5. Create a pull request.

---

For questions or support, contact the generic-vite development team. 🚀
