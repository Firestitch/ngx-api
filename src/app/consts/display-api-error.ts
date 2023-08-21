import { HttpContextToken } from '@angular/common/http';

export const DisplayApiError = new HttpContextToken<boolean>(() => true);
