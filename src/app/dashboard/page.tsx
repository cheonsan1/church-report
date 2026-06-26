"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { supabase } from "@/lib/supabase";

type SundaySchoolReport = {
  id: string;
  report_date: string;
  author: string;
  attendance_student: number;
  attendance_teacher: number;
  attendance_newcomer: number;
  ministry_report: string;
  departments: { name: string };
};

type ParishReport = {
  id: string;
  report_date: string;
  author: string;
  area: string;
  departments: { name: string };
};

type Schedule = {
  id: string;
  day_of_week: string;
  target: string;
  description: string;
};

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const [ssReports, setSsReports] = useState<SundaySchoolReport[]>([]);
  const [parishReports, setParishReports] = useState<ParishReport[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  
  // Stats
  const [totalSsAttendance, setTotalSsAttendance] = useState(0);
  const [totalNewcomers, setTotalNewcomers] = useState(0);
  const [totalParishAttendance, setTotalParishAttendance] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  async function fetchDashboardData() {
    // 1. 주일학교 보고서
    const { data: ssData } = await supabase
      .from("sunday_school_reports")
      .select("*, departments(name)")
      .order("created_at", { ascending: false });
    
    if (ssData) {
      setSsReports(ssData);
      const attSum = ssData.reduce((acc, curr) => acc + curr.attendance_student + curr.attendance_teacher, 0);
      const newSum = ssData.reduce((acc, curr) => acc + curr.attendance_newcomer, 0);
      setTotalSsAttendance(attSum);
      setTotalNewcomers(newSum);
    }

    // 2. 교구 보고서
    const { data: parishData } = await supabase
      .from("parish_reports")
      .select("*, departments(name)")
      .order("created_at", { ascending: false });
    
    if (parishData) {
      setParishReports(parishData);
    }

    // 3. 교구 출석 (총합계산용)
    const { count } = await supabase
      .from("attendance_records")
      .select("*", { count: 'exact', head: true })
      .eq("status", "present");
    
    setTotalParishAttendance(count || 0);

    // 4. 심방 일정
    const { data: scheduleData } = await supabase
      .from("visitation_schedules")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);
    
    if (scheduleData) {
      setSchedules(scheduleData);
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "1234") {
      setIsAuthenticated(true);
    } else {
      alert("비밀번호가 틀렸습니다. (임시 비밀번호: 1234)");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-center">대시보드 접근</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input 
                  type="password" 
                  placeholder="관리자 비밀번호를 입력하세요" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">접속하기</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">주간 대시보드</h1>
          <p className="text-slate-500">제출된 사역 보고 현황 및 통계입니다.</p>
        </div>
        <Button variant="outline" onClick={() => window.location.href = '/dashboard/reports'}>
          전체 보고서 보기
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 출석 (주일학교+교구)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSsAttendance + totalParishAttendance}명</div>
            <p className="text-xs text-slate-500">전체 누적 출석</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">주일학교 출석</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSsAttendance}명</div>
            <p className="text-xs text-slate-500">제출된 보고서 {ssReports.length}건 합산</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">새가족 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNewcomers}명</div>
            <p className="text-xs text-slate-500">주일학교 기준</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">교구 심방 예정</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schedules.length}건</div>
            <p className="text-xs text-slate-500">제출된 전체 일정</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* 최근 제출된 보고서 목록 */}
        <Card className="lg:col-span-4 flex flex-col h-full">
          <CardHeader>
            <CardTitle>최근 제출된 보고서</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto max-h-[500px]">
            <div className="space-y-4">
              
              {/* 주일학교 보고서 표시 */}
              {ssReports.map(report => (
                <div key={report.id} className="p-4 border border-blue-100 bg-blue-50/30 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-blue-700">{report.departments?.name} (주일학교)</div>
                    <div className="text-sm text-slate-500">{report.report_date} / 작성: {report.author}</div>
                  </div>
                  <div className="text-sm text-slate-700 mb-2">
                    학생 {report.attendance_student}명 / 교사 {report.attendance_teacher}명 / 새가족 {report.attendance_newcomer}명
                  </div>
                  <div className="text-xs text-slate-600 bg-white p-2 rounded border border-slate-100 whitespace-pre-wrap">
                    {report.ministry_report}
                  </div>
                </div>
              ))}

              {/* 교구 보고서 표시 */}
              {parishReports.map(report => (
                <div key={report.id} className="p-4 border border-green-100 bg-green-50/30 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-green-700">{report.departments?.name} - {report.area}구역</div>
                    <div className="text-sm text-slate-500">{report.report_date} / 작성: {report.author}</div>
                  </div>
                  <div className="text-xs text-slate-600">
                    * 상세 출결 및 심방 일정은 취합되었습니다.
                  </div>
                </div>
              ))}

              {ssReports.length === 0 && parishReports.length === 0 && (
                <div className="text-center text-slate-500 py-8">아직 제출된 보고서가 없습니다.</div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* 통합 심방 스케줄 */}
        <Card className="lg:col-span-3 flex flex-col h-full">
          <CardHeader>
            <CardTitle>통합 심방 스케줄</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto max-h-[500px]">
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="flex gap-4 p-3 bg-slate-50 rounded-md border border-slate-100">
                  <div className="flex shrink-0 items-center justify-center w-10 h-10 rounded-full bg-white font-bold text-primary border border-primary/20 shadow-sm">
                    {schedule.day_of_week}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{schedule.target}</div>
                    <div className="text-xs text-slate-500 truncate mt-1">
                      {schedule.description || "상세 내용 없음"}
                    </div>
                  </div>
                </div>
              ))}

              {schedules.length === 0 && (
                <div className="text-center text-slate-500 py-8">등록된 심방 일정이 없습니다.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
