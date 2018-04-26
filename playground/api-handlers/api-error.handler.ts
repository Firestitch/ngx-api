export function ApiErrorHandler(event) {
  alert(event.statusText);
  console.log('Error', event);
}
