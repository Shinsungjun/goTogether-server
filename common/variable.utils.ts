export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

export enum AirportServiceType {
  DEPARTURE = 'DEPARTURE',
  ARRIVAL = 'ARRIVAL',
}

export enum ReviewStatus {
  COMPLETED = '작성완료',
  BEFORE = '작성전',
}

export const GetSchedulesType = ['future', 'past'];

export const GetSchedulesSort = ['latest', 'oldest', 'boardingTime'];
