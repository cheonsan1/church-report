"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SundaySchoolReport() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState<{id: string, name: string}[]>([]);
  
  // 폼 상태
  const [reportDate, setReportDate] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [author, setAuthor] = useState("");
  const [preacher, setPreacher] = useState("");
  const [presider, setPresider] = useState("");
  const [prayer, setPrayer] = useState("");
  const [praiseLeader, setPraiseLeader] = useState("");
  const [attStudent, setAttStudent] = useState("0");
  const [attTeacher, setAttTeacher] = useState("0");
  const [attNewcomer, setAttNewcomer] = useState("0");
  const [ministryReport, setMinistryReport] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    async function fetchDepartments() {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name')
        .eq('type', 'sunday_school')
        .order('name');
      
      if (data) {
        setDepartments(data);
      }
    }
    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('sunday_school_reports')
      .insert({
        department_id: selectedDept,
        report_date: reportDate,
        author: author,
        preacher: preacher,
        presider: presider,
        pray_er: prayer,
        praise_leader: praiseLeader,
        attendance_student: parseInt(attStudent) || 0,
        attendance_teacher: parseInt(attTeacher) || 0,
        attendance_newcomer: parseInt(attNewcomer) || 0,
        ministry_report: ministryReport,
        password: password
      });

    setIsSubmitting(false);

    if (error) {
      alert("오류가 발생했습니다: " + error.message);
    } else {
      alert("주일학교 보고서 제출이 완료되었습니다.");
      router.push("/");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">주일학교 보고서 작성</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">일시 (주일)</label>
                <Input type="date" required value={reportDate} onChange={e => setReportDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">부서 선택</label>
                <Select 
                  required
                  value={selectedDept}
                  onChange={e => setSelectedDept(e.target.value)}
                  placeholder="부서를 선택해주세요"
                  options={departments.map(d => ({ label: d.name, value: d.id }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">예배 담당자</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">작성자</label>
                  <Input placeholder="이름 입력" required value={author} onChange={e => setAuthor(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">설교자</label>
                  <Input placeholder="이름 입력" required value={preacher} onChange={e => setPreacher(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">사회자</label>
                  <Input placeholder="이름 입력" value={presider} onChange={e => setPresider(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">기도자</label>
                  <Input placeholder="이름 입력" value={prayer} onChange={e => setPrayer(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">찬양 인도자</label>
                  <Input placeholder="이름 입력" value={praiseLeader} onChange={e => setPraiseLeader(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">출석 통계</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">학생 (명)</label>
                  <Input type="number" min="0" required value={attStudent} onChange={e => setAttStudent(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">교사 (명)</label>
                  <Input type="number" min="0" required value={attTeacher} onChange={e => setAttTeacher(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">새가족 (명)</label>
                  <Input type="number" min="0" required value={attNewcomer} onChange={e => setAttNewcomer(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium border-b pb-2 block text-lg font-semibold mb-4">
                주간 사역 보고 및 기도 제목
              </label>
              <Textarea 
                placeholder="이번 주 주요 활동 내역, 다음 주 계획, 그리고 기도 제목을 자유롭게 작성해 주세요." 
                className="min-h-[150px]"
                required 
                value={ministryReport}
                onChange={e => setMinistryReport(e.target.value)}
              />
            </div>

            <div className="space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <label className="text-sm font-semibold flex items-center text-slate-700">
                비밀번호 (수정/삭제용)
              </label>
              <p className="text-xs text-slate-500 mb-2">추후 보고서를 수정하거나 삭제할 때 필요한 비밀번호(숫자 4자리 등)를 입력해주세요.</p>
              <Input 
                type="password" 
                placeholder="비밀번호 입력" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="max-w-[200px]"
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "제출 중..." : "제출하기"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
