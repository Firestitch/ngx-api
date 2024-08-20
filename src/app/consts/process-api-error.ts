import { HttpContextToken } from '@angular/common/http';

export const ProcessApiError = new HttpContextToken<boolean>(() => true);
