import { HttpContextToken } from '@angular/common/http';

export const CatchApiError = new HttpContextToken<boolean>(() => true);
