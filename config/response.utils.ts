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
  USERID_EMPTY: {
    isSuccess: false,
    code: 2017,
    message: '유저 아이디를 입력해주세요.',
  },
  INVALID_USERID: {
    isSuccess: false,
    code: 2018,
    message: '유저 아이디는 0보다 큰 값을 입력해주세요.',
  },
  SAME_PASSWORD: {
    isSuccess: false,
    code: 2019,
    message: '기존과 같은 비밀번호입니다.',
  },
  START_AT_EMPTY: {
    isSuccess: false,
    code: 2020,
    message: '출발 날짜를 입력해주세요.',
  },
  INVALID_DATE_FORMAT: {
    isSuccess: false,
    code: 2021,
    message: '날짜는 YYYY-MM-DD 형식으로 입력해주세요.',
  },
  END_AT_EMPTY: {
    isSuccess: false,
    code: 2022,
    message: '도착 날짜를 입력해주세요.',
  },
  SCHEDULE_NAME_EMPTY: {
    isSuccess: false,
    code: 2023,
    message: '일정의 이름을 입력해주세요.',
  },
  INVALID_SCHEDULE_NAME: {
    isSuccess: false,
    code: 2024,
    message: '일정의 이름은 10자 이내로 입력해주세요.',
  },
  DEPARTURE_AIRPORT_ID_EMPTY: {
    isSuccess: false,
    code: 2025,
    message: '출발 공항의 아이디를 입력해주세요.',
  },
  INVALID_AIRPORT_ID: {
    isSuccess: false,
    code: 2026,
    message: '공항 아이디는 0보다 큰 값을 입력해주세요.',
  },
  ARRIVAL_AIRPORT_ID_EMPTY: {
    isSuccess: false,
    code: 2027,
    message: '도착 공항의 아이디를 입력해주세요.',
  },
  AIRLINE_ID_EMPTY: {
    isSuccess: false,
    code: 2028,
    message: '항공사 아이디를 입력해주세요.',
  },
  INVALID_AIRLINE_ID: {
    isSuccess: false,
    code: 2029,
    message: '항공사의 아이디는 0보다 큰 값을 입력해주세요.',
  },
  DEPARTURE_AIRPORT_SERVICE_IDS_EMPTY: {
    isSuccess: false,
    code: 2030,
    message: '출발 공항의 서비스 아이디 리스트를 입력해주세요.',
  },
  ARRIVAL_AIRPORT_SERVICE_IDS_EMPTY: {
    isSuccess: false,
    code: 2031,
    message: '도착 공항의 서비스 아이디 리스트를 입력해주세요.',
  },
  AIRLINE_SERVICE_IDS_EMPTY: {
    isSuccess: false,
    code: 2032,
    message: '항공사의 서비스 아이디 리스트를 입력해주세요.',
  },
  USER_ERROR_TYPE: {
    isSuccess: false,
    code: 2033,
    message: '유저 아이디를 확인해주세요.',
  },
  NON_EXIST_AIRPORT: {
    isSuccess: false,
    code: 2034,
    message: '존재하지 않는 공항입니다.',
  },
  NON_EXIST_AIRLINE: {
    isSuccess: false,
    code: 2035,
    message: '존재하지 않는 항공사입니다.',
  },
  NON_EXIST_AIRPORT_SERVICE: {
    isSuccess: false,
    code: 2036,
    message: '존재하지 않는 공항 서비스입니다.',
  },
  NON_EXIST_AIRLINE_SERVICE: {
    isSuccess: false,
    code: 2037,
    message: '존재하지 않는 항공사 서비스입니다.',
  },
  AIRPORT_ID_EMPTY: {
    isSuccess: false,
    code: 2038,
    message: '공항 아이디를 입력해주세요.',
  },
  ERROR: {
    isSuccess: false,
    code: 4000,
    message: '서버 에러',
  },
};
