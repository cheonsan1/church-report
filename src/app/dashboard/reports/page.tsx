"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, User, Calendar, MessageSquare, Plus, FileText, CheckCircle, XCircle } from "lucide-react";

type SundaySchoolReport = {
  id: string;
  report_date: string;
  author: string;
  preacher: string;
  presider: string;
  pray_er: string;
  praise_leader: string;
  attendance_student: number;
  attendance_teacher: number;
  attendance_newcomer: number;
  ministry_report: string;
  departments: { name: string };
  created_at: string;
};

type ParishReport = {
  id: string;
  report_date: string;
  author: string;
  area: string;
  departments: { name: string };
  created_at: string;
  attendance_records: {
    status: string;
    notes: string;
    members: { name: string };
  }[];
  visitation_schedules: {
    day_of_week: string;
    target: string;
    description: string;
  }[];
};

export default function ReportsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const [activeTab, setActiveTab] = useState<"sunday" | "parish">("sunday");
  const [ssReports, setSsReports] = useState<SundaySchoolReport[]>([]);
  const [parishReports, setParishReports] = useState<ParishReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  async function fetchData() {
    setIsLoading(true);
    
    // 주일학교
    const { data: ssData } = await supabase
      .from("sunday_school_reports")
      .select("*, departments(name)")
      .order("created_at", { ascending: false });
    
    if (ssData) setSsReports(ssData);

    // 교구
    const { data: parishData } = await supabase
      .from("parish_reports")
      .select("*, departments(name), attendance_records(status, notes, members(name)), visitation_schedules(*)")
      .order("created_at", { ascending: false });
    
    if (parishData) setParishReports(parishData);

    setIsLoading(false);
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
            <CardTitle className="text-center">보고서 조회 접근</CardTitle>
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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 border-b pb-4">
        <Button variant="ghost" size="sm" onClick={() => window.location.href = '/dashboard'}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">전체 보고서 상세 조회</h1>
          <p className="text-slate-500">지금까지 제출된 모든 사역 보고서의 세부 내역을 확인합니다.</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button 
          variant={activeTab === "sunday" ? "default" : "outline"} 
          onClick={() => setActiveTab("sunday")}
        >
          주일학교 보고서
        </Button>
        <Button 
          variant={activeTab === "parish" ? "default" : "outline"} 
          onClick={() => setActiveTab("parish")}
        >
          교구 보고서
        </Button>
      </div>

      {isLoading && <div className="text-center text-slate-500 py-10">데이터를 불러오는 중입니다...</div>}

      {!isLoading && activeTab === "sunday" && (
        <div className="space-y-4">
          {ssReports.map(report => (
            <Card key={report.id} className="overflow-hidden border-blue-100">
              <CardHeader className="bg-blue-50/50 pb-4 border-b border-blue-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-blue-800">{report.departments?.name}</CardTitle>
                  <span className="text-sm text-slate-500 font-medium">{report.report_date}</span>
                </div>
                <div className="text-sm text-slate-600 mt-1">작성자: {report.author}</div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold flex items-center text-slate-700 mb-2">
                        <User className="w-4 h-4 mr-1 text-blue-500" /> 예배 담당자
                      </h4>
                      <ul className="text-sm space-y-1 text-slate-600 bg-slate-50 p-3 rounded-md border border-slate-100">
                        <li><span className="font-medium">설교자:</span> {report.preacher || "-"}</li>
                        <li><span className="font-medium">사회자:</span> {report.presider || "-"}</li>
                        <li><span className="font-medium">기도자:</span> {report.pray_er || "-"}</li>
                        <li><span className="font-medium">찬양 인도:</span> {report.praise_leader || "-"}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold flex items-center text-slate-700 mb-2">
                        <Users className="w-4 h-4 mr-1 text-green-500" /> 출석 인원
                      </h4>
                      <ul className="text-sm space-y-1 text-slate-600 bg-slate-50 p-3 rounded-md border border-slate-100">
                        <li><span className="font-medium">학생:</span> {report.attendance_student}명</li>
                        <li><span className="font-medium">교사:</span> {report.attendance_teacher}명</li>
                        <li><span className="font-medium">새가족:</span> {report.attendance_newcomer}명</li>
                        <li className="pt-1 mt-1 border-t border-slate-200 font-bold">
                          총계: {report.attendance_student + report.attendance_teacher + report.attendance_newcomer}명
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center text-slate-700 mb-2">
                      <FileText className="w-4 h-4 mr-1 text-purple-500" /> 주간 사역 보고
                    </h4>
                    <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-md border border-slate-100 whitespace-pre-wrap min-h-[150px]">
                      {report.ministry_report || "내용 없음"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {ssReports.length === 0 && <div className="text-center py-10 text-slate-500">제출된 주일학교 보고서가 없습니다.</div>}
        </div>
      )}

      {!isLoading && activeTab === "parish" && (
        <div className="space-y-4">
          {parishReports.map(report => (
            <Card key={report.id} className="overflow-hidden border-green-100">
              <CardHeader className="bg-green-50/50 pb-4 border-b border-green-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-green-800">{report.departments?.name} - {report.area}구역</CardTitle>
                  <span className="text-sm text-slate-500 font-medium">{report.report_date}</span>
                </div>
                <div className="text-sm text-slate-600 mt-1">작성자: {report.author}</div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* 출결 내역 */}
                  <div>
                    <h4 className="font-semibold flex items-center text-slate-700 mb-2">
                      <Users className="w-4 h-4 mr-1 text-blue-500" /> 성도 출결 내역
                    </h4>
                    <div className="bg-slate-50 rounded-md border border-slate-100 divide-y divide-slate-100">
                      {report.attendance_records && report.attendance_records.length > 0 ? (
                        report.attendance_records.map((att, idx) => (
                          <div key={idx} className="p-3 text-sm flex items-start gap-2">
                            {att.status === 'present' ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                            )}
                            <div>
                              <span className="font-medium mr-2">{att.members?.name}</span>
                              {att.notes && <span className="text-slate-500">({att.notes})</span>}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-sm text-slate-500 text-center">기록된 출결이 없습니다.</div>
                      )}
                    </div>
                  </div>
                  
                  {/* 심방 일정 */}
                  <div>
                    <h4 className="font-semibold flex items-center text-slate-700 mb-2">
                      <Calendar className="w-4 h-4 mr-1 text-orange-500" /> 주중 심방 일정
                    </h4>
                    <div className="space-y-2">
                      {report.visitation_schedules && report.visitation_schedules.length > 0 ? (
                        report.visitation_schedules.map((schedule, idx) => (
                          <div key={idx} className="flex gap-3 p-3 bg-slate-50 border border-slate-100 rounded-md">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-bold border border-slate-200 text-slate-700 shrink-0">
                              {schedule.day_of_week}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{schedule.target}</div>
                              {schedule.description && <div className="text-xs text-slate-500 mt-1">{schedule.description}</div>}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-slate-50 border border-slate-100 rounded-md p-4 text-sm text-slate-500 text-center">
                          계획된 심방 일정이 없습니다.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {parishReports.length === 0 && <div className="text-center py-10 text-slate-500">제출된 교구 보고서가 없습니다.</div>}
        </div>
      )}
    </div>
  );
}

// Users 아이콘 추가 임포트용 컴포넌트
function Users(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
