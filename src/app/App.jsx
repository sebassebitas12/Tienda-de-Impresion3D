import { RouterProvider } from 'react-router-dom';
import { AppProviders } from './providers/AppProviders.jsx';
import { router } from './routes/router.js';
import { jsonServerAuthAdapter } from '../services/jsonServerAuthAdapter.js';
import '../styles/shell.css';

export default function App() {
  return <AppProviders authAdapter={jsonServerAuthAdapter}><RouterProvider router={router} /></AppProviders>;
}
