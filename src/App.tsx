import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AppToastProvider } from './components/ui/toaster';

export default function App() {
  return (
    <AppToastProvider>
      <RouterProvider router={router} />
    </AppToastProvider>
  )
}
