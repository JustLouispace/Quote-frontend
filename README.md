# Qoute Frontend

A modern, responsive web application built with Next.js and Tailwind CSS for managing and displaying quotes. This project includes authentication, filtering, and charting features.

## Features
- User authentication (login/register)
- Quote management and filtering
- Data visualization with charts
- Responsive UI using Tailwind CSS

## Technologies Used
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PostCSS](https://postcss.org/)

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Qoute-frontend.git
   cd Qoute-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Development Server
```bash
npm run dev
# or
yarn dev
```
Visit [http://localhost:3000](http://localhost:3000) to view the app.

### Building for Production
```bash
npm run build
npm start
```

## Environment Variables
Create a `.env.local` file in the root directory for your environment variables (such as API endpoints, secrets, etc.). **Do not commit this file to GitHub.**

Example:
```
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Folder Structure
- `src/` - Main application source code
- `src/app/` - App routes and pages
- `src/hooks/` - Custom React hooks

## Contribution
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)

---

Feel free to customize this README for your own needs.
