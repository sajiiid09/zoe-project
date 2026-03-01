import { ValidationError } from '../utils/errors.js';

const normalizeValidationFailure = (message, details = null) => {
  throw new ValidationError(message, details);
};

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      let parsed;

      if (typeof schema === 'function') {
        parsed = await schema(req);
      } else if (schema?.safeParseAsync) {
        const result = await schema.safeParseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });

        if (!result.success) {
          normalizeValidationFailure('Validation failed', result.error?.issues || null);
        }

        parsed = result.data;
      } else if (schema?.parseAsync) {
        parsed = await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });
      } else {
        throw new Error('Invalid validation schema');
      }

      if (parsed?.body) {
        req.body = parsed.body;
      }

      if (parsed?.query) {
        req.query = parsed.query;
      }

      if (parsed?.params) {
        req.params = parsed.params;
      }

      req.validated = parsed;
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        return next(error);
      }

      return next(
        new ValidationError(error.message || 'Validation failed', error.details || null)
      );
    }
  };
};
