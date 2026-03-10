import app from './app.js';
import { assertJwtSecretConfigured } from './utils/auth.js';

export const startServer = () => {
  assertJwtSecretConfigured();

  const PORT = process.env.PORT || 5000;
  return app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}
