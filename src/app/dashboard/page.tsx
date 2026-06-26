"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { mockDepartments } from "@/lib/mockData";

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "1234") { // Mock password
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">주간 대시보드</h1>
        <p className="text-slate-500">이번 주 사역 보고 현황 및 통계입니다.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 출석 인원</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245명</div>
            <p className="text-xs text-slate-500">전주 대비 +12명</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">주일학교 학생</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">340명</div>
            <p className="text-xs text-slate-500">제출 완료 5/6 부서</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">새가족 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8명</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">심방 예정</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12건</div>
            <p className="text-xs text-slate-500">이번 주 교구 심방 총합</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>부서별 보고 요약</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockDepartments.slice(0, 4).map(dept => (
                <div key={dept.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-md">
                  <div>
                    <div className="font-medium">{dept.name}</div>
                    <div className="text-sm text-slate-500">제출 완료 (작성자: 김간사)</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary">출석 45명</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>주중 교구 심방 스케줄</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { day: "월", target: "1교구 김성도 가정", type: "위로" },
                { day: "수", target: "2교구 최집사 가정", type: "심방" },
                { day: "금", target: "1교구 박권사 병원", type: "병상" },
                { day: "토", target: "3교구 신혼부부", type: "개업" },
              ].map((schedule, i) => (
                <div key={i} className="flex gap-4 p-3 bg-slate-50 rounded-md border border-slate-100">
                  <div className="flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-white font-bold text-primary border border-primary/20">
                    {schedule.day}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{schedule.target}</div>
                    <div className="text-xs text-slate-500">{schedule.type} 심방</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
