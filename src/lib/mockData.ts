export type DepartmentType = 'sunday_school' | 'parish';

export interface Department {
  id: string;
  name: string;
  type: DepartmentType;
}

export interface Member {
  id: string;
  department_id: string;
  area: string; // e.g., '1-1'
  name: string;
}

export const mockDepartments: Department[] = [
  { id: 'dept-1', name: '영아부', type: 'sunday_school' },
  { id: 'dept-2', name: '유치부', type: 'sunday_school' },
  { id: 'dept-3', name: '유년부', type: 'sunday_school' },
  { id: 'dept-4', name: '초등부', type: 'sunday_school' },
  { id: 'dept-5', name: '중고등부', type: 'sunday_school' },
  { id: 'dept-6', name: '청년부', type: 'sunday_school' },
  { id: 'dept-p1', name: '1교구', type: 'parish' },
  { id: 'dept-p2', name: '2교구', type: 'parish' },
  { id: 'dept-p3', name: '3교구', type: 'parish' },
];

export const mockMembers: Member[] = [
  // 1교구
  { id: 'm-1', department_id: 'dept-p1', area: '1-1', name: '김성도' },
  { id: 'm-2', department_id: 'dept-p1', area: '1-1', name: '이집사' },
  { id: 'm-3', department_id: 'dept-p1', area: '1-2', name: '박권사' },
  { id: 'm-4', department_id: 'dept-p1', area: '1-2', name: '최장로' },
  
  // 2교구
  { id: 'm-5', department_id: 'dept-p2', area: '2-1', name: '정성도' },
  { id: 'm-6', department_id: 'dept-p2', area: '2-1', name: '강집사' },
  
  // 3교구
  { id: 'm-7', department_id: 'dept-p3', area: '3-1', name: '조권사' },
  { id: 'm-8', department_id: 'dept-p3', area: '3-2', name: '윤장로' },
];
