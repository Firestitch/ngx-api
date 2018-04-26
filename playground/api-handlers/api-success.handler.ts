import { TestService } from '../app/services/test.service';


export function ApiSuccessHandler(test: TestService) {
  return function (event, config) {
    event.body = event.body.data;
    if (config.key) {
      event.body = event.body[config.key];
    }

    console.log('Success', event, test);
  }
}
