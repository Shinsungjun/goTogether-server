export const regularExp = {
  passwordRegex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}/,
  nickNameRegex: /^[가-힣]{1,10}$/,
  phoneNumberRegex: /^(01\d{1})-([0-9]{3,4})-([0-9]{4})$/,
  dateRegex: /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
};
