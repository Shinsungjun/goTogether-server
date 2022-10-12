export const response = {
  SUCCESS: {
    isSuccess: true,
    code: 1000,
    message: '성공',
  },
  CHECK_JWT_TOKEN: {
    isSuccess: false,
    code: 2000,
    message: 'jwt 검증 실패.',
  },
  USER_PHONENUMBER_EMPTY: {
    isSuccess: false,
    code: 2001,
    message: '전화번호를 입력해주세요.',
  },
  INVALID_USER_PHONENUMBER: {
    isSuccess: false,
    code: 2002,
    message: '전화번호의 형식을 확인해주세요.',
  },
  USER_USERNAME_EMPTY: {
    isSuccess: false,
    code: 2003,
    message: '아이디를 입력해주세요.',
  },
  INVALID_USER_USERNAME: {
    isSuccess: false,
    code: 2004,
    message: '아이디의 길이를 확인해주세요.',
  },
  USER_PASSWORD_EMPTY: {
    isSuccess: false,
    code: 2005,
    message: '비밀번호를 입력해주세요.',
  },
  INVALID_USER_PASSWORD: {
    isSuccess: false,
    code: 2006,
    message: '비밀번호의 형식을 확인해주세요.',
  },
  USER_NICKNAME_EMPTY: {
    isSuccess: false,
    code: 2007,
    message: '닉네임을 입력해주세요.',
  },
  INVALID_USER_NICKNAME: {
    isSuccess: false,
    code: 2008,
    message: '닉네임의 형식을 확인해주세요.',
  },
  EXIST_PHONENUMBER: {
    isSuccess: false,
    code: 2009,
    message: '존재하는 전화번호입니다.',
  },
  EXIST_USERNAME: {
    isSuccess: false,
    code: 2010,
    message: '존재하는 아이디입니다.',
  },
  VERIFY_CODE_EMPTY: {
    isSuccess: false,
    code: 2011,
    message: '인증번호를 입력해주세요.',
  },
  INVALID_VERIFY_CODE: {
    isSuccess: false,
    code: 2012,
    message: '인증번호는 6자리로 입력해주세요.',
  },
  VERIFY_CODE_NOT_MATCH: {
    isSuccess: false,
    code: 2013,
    message: '인증번호가 일치하지 않습니다.',
  },
  NON_EXIST_USER: {
    isSuccess: false,
    code: 2014,
    message: '존재하지 않는 유저입니다.',
  },
  SIGN_IN_ERROR: {
    isSuccess: false,
    code: 2015,
    message: '아이디 혹은 비밀번호가 틀렸습니다.',
  },
  USER_PHONENUMBER_ERROR: {
    isSuccess: false,
    code: 2016,
    message: '전화번호가 틀렸습니다.',
  },
  ERROR: {
    isSuccess: false,
    code: 4000,
    message: '서버 에러',
  },
};
