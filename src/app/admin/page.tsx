"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { mockDepartments, mockMembers } from "@/lib/mockData";
import { Settings, Users, FolderTree } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">설정 및 관리</h1>
          <p className="text-slate-500">기초 데이터(부서, 교구, 성도 명단)를 관리합니다.</p>
        </div>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          시스템 설정
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 부서 관리 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center">
              <FolderTree className="w-5 h-5 mr-2 text-primary" />
              부서 및 교구 관리
            </CardTitle>
            <Button size="sm">추가</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mt-4">
              <div className="text-sm font-semibold text-slate-500 mb-2">주일학교</div>
              {mockDepartments.filter(d => d.type === 'sunday_school').map(dept => (
                <div key={dept.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-md border border-transparent hover:border-slate-100">
                  <span className="text-sm">{dept.name}</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 text-xs">수정</Button>
                  </div>
                </div>
              ))}
              
              <div className="text-sm font-semibold text-slate-500 mb-2 mt-4">교구</div>
              {mockDepartments.filter(d => d.type === 'parish').map(dept => (
                <div key={dept.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-md border border-transparent hover:border-slate-100">
                  <span className="text-sm">{dept.name}</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 text-xs">수정</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 성도 명단 관리 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary" />
              성도 명단 관리
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4 mt-4">
              <Input placeholder="이름으로 검색..." className="flex-1" />
              <Button>검색</Button>
            </div>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {mockMembers.map(member => (
                <div key={member.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-md bg-white">
                  <div>
                    <div className="font-medium text-sm">{member.name}</div>
                    <div className="text-xs text-slate-500">
                      {mockDepartments.find(d => d.id === member.department_id)?.name} / {member.area}구역
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs text-red-500 hover:text-red-600 border-red-200">
                    삭제
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
