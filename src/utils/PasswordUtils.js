export const passwordValidator = (password) => {
  if (password.length > 5){
    return true;
  }
  return false;
}