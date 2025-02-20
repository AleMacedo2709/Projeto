import { AxiosError } from 'axios';
import { i18n } from '../i18n';

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export class AppError extends Error {
  public code: string;
  public details?: Record<string, any>;

  constructor(error: ApiError) {
    super(error.message);
    this.code = error.code;
    this.details = error.details;
  }
}

export const handleApiError = (error: unknown): AppError => {
  const { t } = i18n.global;

  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const data = error.response?.data;

    switch (status) {
      case 401:
        return new AppError({
          code: 'UNAUTHORIZED',
          message: t('errors.unauthorized')
        });
      case 403:
        return new AppError({
          code: 'FORBIDDEN',
          message: t('errors.forbidden')
        });
      case 404:
        return new AppError({
          code: 'NOT_FOUND',
          message: t('errors.notFound')
        });
      case 422:
        return new AppError({
          code: 'VALIDATION_ERROR',
          message: t('errors.validation'),
          details: data?.errors
        });
      case 500:
        return new AppError({
          code: 'SERVER_ERROR',
          message: t('errors.server')
        });
      default:
        return new AppError({
          code: 'UNKNOWN_ERROR',
          message: t('errors.unknown')
        });
    }
  }

  if (error instanceof Error) {
    return new AppError({
      code: 'APP_ERROR',
      message: error.message
    });
  }

  return new AppError({
    code: 'UNKNOWN_ERROR',
    message: t('errors.unknown')
  });
};

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof AxiosError && !error.response;
};

export const isValidationError = (error: unknown): boolean => {
  return error instanceof AppError && error.code === 'VALIDATION_ERROR';
};

export const getValidationErrors = (error: AppError): Record<string, string[]> => {
  if (!isValidationError(error) || !error.details) {
    return {};
  }
  return error.details;
}; 