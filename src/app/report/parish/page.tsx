"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

type AttendanceRecord = {
  memberId: string;
  status: "present" | "absent" | "";
  notes: string;
};

type Schedule = {
  dayOfWeek: string;
  target: string;
  description: string;
};

export default function ParishReport() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 데이터 상태
  const [departments, setDepartments] = useState<{id: string, name: string}[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [members, setMembers] = useState<{id: string, name: string}[]>([]);
  
  // 폼 상태
  const [reportDate, setReportDate] = useState("");
  const [author, setAuthor] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [attendances, setAttendances] = useState<Record<string, AttendanceRecord>>({});
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    async function fetchDepartments() {
      const { data } = await supabase
        .from('departments')
        .select('id, name')
        .eq('type', 'parish')
        .order('name');
      if (data) setDepartments(data);
    }
    fetchDepartments();
  }, []);

  useEffect(() => {
    async function fetchAreas() {
      if (!selectedDept) {
        setAreas([]);
        return;
      }
      const { data } = await supabase
        .from('members')
        .select('area')
        .eq('department_id', selectedDept);
      
      if (data) {
        const uniqueAreas = Array.from(new Set(data.map(d => d.area))).sort();
        setAreas(uniqueAreas);
      }
    }
    fetchAreas();
  }, [selectedDept]);

  useEffect(() => {
    async function fetchMembers() {
      if (!selectedDept || !selectedArea) {
        setMembers([]);
        return;
      }
      const { data } = await supabase
        .from('members')
        .select('id, name')
        .eq('department_id', selectedDept)
        .eq('area', selectedArea)
        .order('name');
      
      if (data) {
        setMembers(data);
        // Reset attendances
        const initAtt: Record<string, AttendanceRecord> = {};
        data.forEach(m => {
          initAtt[m.id] = { memberId: m.id, status: "", notes: "" };
        });
        setAttendances(initAtt);
      }
    }
    fetchMembers();
  }, [selectedDept, selectedArea]);

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDept(e.target.value);
    setSelectedArea("");
  };

  const updateAttendance = (memberId: string, field: keyof AttendanceRecord, value: string) => {
    setAttendances(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [field]: value,
      }
    }));
  };

  const addSchedule = () => {
    setSchedules(prev => [...prev, { dayOfWeek: "월", target: "", description: "" }]);
  };

  const updateSchedule = (index: number, field: keyof Schedule, value: string) => {
    const newSchedules = [...schedules];
    newSchedules[index] = { ...newSchedules[index], [field]: value };
    setSchedules(newSchedules);
  };

  const removeSchedule = (index: number) => {
    setSchedules(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDept || !selectedArea) {
      alert("교구와 구역을 선택해주세요.");
      return;
    }
    
    setIsSubmitting(true);
    
    // 1. parish_reports 인서트
    const { data: reportData, error: reportError } = await supabase
      .from('parish_reports')
      .insert({
        department_id: selectedDept,
        area: selectedArea,
        report_date: reportDate,
        author: author
      })
      .select('id')
      .single();

    if (reportError) {
      alert("보고서 저장 중 오류가 발생했습니다: " + reportError.message);
      setIsSubmitting(false);
      return;
    }

    const reportId = reportData.id;

    // 2. 출결 기록 인서트
    const attendanceInserts = Object.values(attendances)
      .filter(att => att.status !== "") // 상태가 기록된 것만
      .map(att => ({
        report_id: reportId,
        member_id: att.memberId,
        status: att.status,
        notes: att.notes
      }));
    
    if (attendanceInserts.length > 0) {
      await supabase.from('attendance_records').insert(attendanceInserts);
    }

    // 3. 심방 일정 인서트
    const scheduleInserts = schedules
      .filter(s => s.target.trim() !== "")
      .map(s => ({
        report_id: reportId,
        day_of_week: s.dayOfWeek,
        target: s.target,
        description: s.description
      }));
    
    if (scheduleInserts.length > 0) {
      await supabase.from('visitation_schedules').insert(scheduleInserts);
    }

    setIsSubmitting(false);
    alert("교구 보고서 제출이 완료되었습니다.");
    router.push("/");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">교구 보고서 작성</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">일시</label>
                <Input type="date" required value={reportDate} onChange={e => setReportDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">작성자</label>
                <Input placeholder="이름 입력" required value={author} onChange={e => setAuthor(e.target.value)} />
              </div>
            </div>

            {/* 상단: 교구/구역 선택 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">교구 선택</label>
                <Select 
                  required
                  value={selectedDept}
                  onChange={handleDeptChange}
                  placeholder="교구를 선택해주세요"
                  options={departments.map(d => ({ label: d.name, value: d.id }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">구역 선택</label>
                <Select 
                  required
                  value={selectedArea}
                  onChange={e => setSelectedArea(e.target.value)}
                  disabled={!selectedDept}
                  placeholder="구역을 선택해주세요"
                  options={areas.map(a => ({ label: `${a} 구역`, value: a }))}
                />
              </div>
            </div>

            {/* 중단: 명단 출결 리스트 */}
            {selectedArea && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">성도 출결 및 유고사항</h3>
                {members.length === 0 ? (
                  <p className="text-sm text-slate-500">등록된 성도가 없습니다.</p>
                ) : (
                  <div className="space-y-4">
                    {members.map(member => (
                      <div key={member.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-slate-100 rounded-md bg-slate-50/50">
                        <div className="w-24 font-medium">{member.name}</div>
                        
                        <div className="flex gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => updateAttendance(member.id, 'status', 'present')}
                            className={`px-4 py-1.5 text-sm rounded-md border transition-colors ${
                              attendances[member.id]?.status === 'present' 
                                ? 'bg-primary text-white border-primary' 
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            출석
                          </button>
                          <button
                            type="button"
                            onClick={() => updateAttendance(member.id, 'status', 'absent')}
                            className={`px-4 py-1.5 text-sm rounded-md border transition-colors ${
                              attendances[member.id]?.status === 'absent' 
                                ? 'bg-red-500 text-white border-red-500' 
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            결석
                          </button>
                        </div>

                        <div className="flex-1">
                          <Input 
                            placeholder="유고사항 입력 (결석 사유 등)" 
                            value={attendances[member.id]?.notes || ""}
                            onChange={(e) => updateAttendance(member.id, 'notes', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 하단: 심방 일정 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-lg font-semibold">주중 심방 일정</h3>
                <Button type="button" variant="outline" size="sm" onClick={addSchedule}>
                  <Plus className="w-4 h-4 mr-1" />
                  추가하기
                </Button>
              </div>
              
              {schedules.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-md">
                  등록된 심방 일정이 없습니다.
                </p>
              ) : (
                <div className="space-y-3">
                  {schedules.map((schedule, index) => (
                    <div key={index} className="flex items-start gap-2 sm:gap-4 p-3 border border-slate-200 rounded-md">
                      <Select
                        className="w-24 shrink-0"
                        value={schedule.dayOfWeek}
                        onChange={(e) => updateSchedule(index, 'dayOfWeek', e.target.value)}
                        options={[
                          { label: '월', value: '월' },
                          { label: '화', value: '화' },
                          { label: '수', value: '수' },
                          { label: '목', value: '목' },
                          { label: '금', value: '금' },
                          { label: '토', value: '토' },
                          { label: '일', value: '일' },
                        ]}
                      />
                      <div className="flex-1 space-y-2">
                        <Input 
                          placeholder="대상 (예: 김성도 가정)" 
                          value={schedule.target}
                          onChange={(e) => updateSchedule(index, 'target', e.target.value)}
                          required
                        />
                        <Input 
                          placeholder="상세 내용" 
                          value={schedule.description}
                          onChange={(e) => updateSchedule(index, 'description', e.target.value)}
                        />
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeSchedule(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
