-- 부서 테이블
CREATE TABLE departments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('sunday_school', 'parish')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 성도 명단 테이블
CREATE TABLE members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  area TEXT NOT NULL, -- 구역 (예: '1-1')
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 주일학교 보고서 테이블
CREATE TABLE sunday_school_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  author TEXT, -- 작성자 (프론트에서 입력받는 경우)
  preacher TEXT, -- 설교자
  presider TEXT, -- 사회자
  pray_er TEXT, -- 기도자
  praise_leader TEXT, -- 찬양 인도자
  attendance_student INTEGER DEFAULT 0,
  attendance_teacher INTEGER DEFAULT 0,
  attendance_newcomer INTEGER DEFAULT 0,
  ministry_report TEXT, -- 주간사역보고
  password TEXT, -- 보고서 수정/삭제용 비밀번호
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 교구 보고서 메인 테이블
CREATE TABLE parish_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  area TEXT NOT NULL,
  report_date DATE NOT NULL,
  author TEXT, -- 작성자
  password TEXT, -- 보고서 수정/삭제용 비밀번호
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 출결 기록 테이블
CREATE TABLE attendance_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  report_id UUID REFERENCES parish_reports(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('present', 'absent', '')),
  notes TEXT, -- 유고사항
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 심방 일정 테이블
CREATE TABLE visitation_schedules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  report_id UUID REFERENCES parish_reports(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL,
  target TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------
-- 초기 데이터 (Mock Data) Insert 스크립트
-- --------------------------------------------------------
INSERT INTO departments (id, name, type) VALUES
('b27ab087-0d53-4eb0-bb2e-333333333301', '영아부', 'sunday_school'),
('b27ab087-0d53-4eb0-bb2e-333333333302', '유치부', 'sunday_school'),
('b27ab087-0d53-4eb0-bb2e-333333333303', '유년부', 'sunday_school'),
('b27ab087-0d53-4eb0-bb2e-333333333304', '초등부', 'sunday_school'),
('b27ab087-0d53-4eb0-bb2e-333333333305', '중고등부', 'sunday_school'),
('b27ab087-0d53-4eb0-bb2e-333333333306', '청년부', 'sunday_school'),
('b27ab087-0d53-4eb0-bb2e-333333333307', '1교구', 'parish'),
('b27ab087-0d53-4eb0-bb2e-333333333308', '2교구', 'parish'),
('b27ab087-0d53-4eb0-bb2e-333333333309', '3교구', 'parish');

INSERT INTO members (id, department_id, area, name) VALUES
('c17ab087-0d53-4eb0-bb2e-444444444401', 'b27ab087-0d53-4eb0-bb2e-333333333307', '1-1', '김성도'),
('c17ab087-0d53-4eb0-bb2e-444444444402', 'b27ab087-0d53-4eb0-bb2e-333333333307', '1-1', '이집사'),
('c17ab087-0d53-4eb0-bb2e-444444444403', 'b27ab087-0d53-4eb0-bb2e-333333333307', '1-2', '박권사'),
('c17ab087-0d53-4eb0-bb2e-444444444404', 'b27ab087-0d53-4eb0-bb2e-333333333307', '1-2', '최장로'),
('c17ab087-0d53-4eb0-bb2e-444444444405', 'b27ab087-0d53-4eb0-bb2e-333333333308', '2-1', '정성도'),
('c17ab087-0d53-4eb0-bb2e-444444444406', 'b27ab087-0d53-4eb0-bb2e-333333333308', '2-1', '강집사'),
('c17ab087-0d53-4eb0-bb2e-444444444407', 'b27ab087-0d53-4eb0-bb2e-333333333309', '3-1', '조권사'),
('c17ab087-0d53-4eb0-bb2e-444444444408', 'b27ab087-0d53-4eb0-bb2e-333333333309', '3-2', '윤장로');
