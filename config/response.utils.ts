export const response = {
  SUCCESS: {
    isSuccess: true,
    code: 1000,
    message: '성공',
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
  ERROR: {
    isSuccess: false,
    code: 4000,
    message: '서버 에러',
  },
};
