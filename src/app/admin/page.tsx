"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Settings, Users, FolderTree, Plus, Trash2, Edit2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Department = {
  id: string;
  name: string;
  type: string;
};

type Member = {
  id: string;
  name: string;
  area: string;
  department_id: string;
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const [departments, setDepartments] = useState<Department[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // 새 성도 추가용 상태
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberArea, setNewMemberArea] = useState("");
  const [newMemberDeptId, setNewMemberDeptId] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  async function fetchData() {
    const [deptRes, memRes] = await Promise.all([
      supabase.from("departments").select("*").order("name"),
      supabase.from("members").select("*").order("name"),
    ]);

    if (deptRes.data) setDepartments(deptRes.data);
    if (memRes.data) setMembers(memRes.data);
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "1234") {
      setIsAuthenticated(true);
    } else {
      alert("비밀번호가 틀렸습니다. (임시 비밀번호: 1234)");
    }
  };

  // === 부서 관련 함수 ===
  const handleAddDepartment = async (type: string) => {
    const name = window.prompt(`추가할 ${type === 'sunday_school' ? '주일학교 부서' : '교구'} 이름을 입력하세요:`);
    if (!name || name.trim() === "") return;

    const { error } = await supabase.from("departments").insert({ name: name.trim(), type });
    if (error) alert("추가 실패: " + error.message);
    else fetchData();
  };

  const handleEditDepartment = async (id: string, currentName: string) => {
    const newName = window.prompt("새로운 부서 이름을 입력하세요:", currentName);
    if (!newName || newName.trim() === "" || newName === currentName) return;

    const { error } = await supabase.from("departments").update({ name: newName.trim() }).eq("id", id);
    if (error) alert("수정 실패: " + error.message);
    else fetchData();
  };

  // === 성도 관련 함수 ===
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberDeptId || !newMemberArea || !newMemberName) {
      alert("교구, 구역, 이름을 모두 입력해주세요.");
      return;
    }

    const { error } = await supabase.from("members").insert({
      department_id: newMemberDeptId,
      area: newMemberArea,
      name: newMemberName
    });

    if (error) {
      alert("추가 실패: " + error.message);
    } else {
      setNewMemberName("");
      setNewMemberArea("");
      fetchData();
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    const confirm = window.confirm(`정말 ${name} 성도를 명단에서 삭제하시겠습니까?`);
    if (!confirm) return;

    const { error } = await supabase.from("members").delete().eq("id", id);
    if (error) alert("삭제 실패: " + error.message);
    else fetchData();
  };

  const filteredMembers = members.filter(m => m.name.includes(searchQuery));

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-center">관리자 설정 접근</CardTitle>
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
          <h1 className="text-2xl font-bold tracking-tight">설정 및 관리</h1>
          <p className="text-slate-500">기초 데이터(부서, 교구, 성도 명단)를 실시간으로 관리합니다.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 부서 관리 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center">
              <FolderTree className="w-5 h-5 mr-2 text-primary" />
              부서 및 교구 관리
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-4">
              {/* 주일학교 섹션 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-slate-500">주일학교</div>
                  <Button size="sm" variant="outline" onClick={() => handleAddDepartment('sunday_school')}>
                    <Plus className="w-4 h-4 mr-1" /> 추가
                  </Button>
                </div>
                <div className="space-y-1">
                  {departments.filter(d => d.type === 'sunday_school').map(dept => (
                    <div key={dept.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-md border border-transparent hover:border-slate-100 transition-colors">
                      <span className="text-sm">{dept.name}</span>
                      <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-500" onClick={() => handleEditDepartment(dept.id, dept.name)}>
                        <Edit2 className="w-3 h-3 mr-1" /> 수정
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 교구 섹션 */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-slate-500">교구</div>
                  <Button size="sm" variant="outline" onClick={() => handleAddDepartment('parish')}>
                    <Plus className="w-4 h-4 mr-1" /> 추가
                  </Button>
                </div>
                <div className="space-y-1">
                  {departments.filter(d => d.type === 'parish').map(dept => (
                    <div key={dept.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-md border border-transparent hover:border-slate-100 transition-colors">
                      <span className="text-sm">{dept.name}</span>
                      <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-500" onClick={() => handleEditDepartment(dept.id, dept.name)}>
                        <Edit2 className="w-3 h-3 mr-1" /> 수정
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 성도 명단 관리 */}
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary" />
              성도 명단 관리
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1">
            {/* 새 성도 추가 폼 */}
            <form onSubmit={handleAddMember} className="mb-6 p-4 bg-slate-50 border border-slate-100 rounded-md space-y-3">
              <div className="text-sm font-medium">새 성도 추가</div>
              <div className="flex gap-2">
                <Select 
                  className="flex-1"
                  required
                  value={newMemberDeptId}
                  onChange={e => setNewMemberDeptId(e.target.value)}
                  placeholder="교구 선택"
                  options={departments.filter(d => d.type === 'parish').map(d => ({ label: d.name, value: d.id }))}
                />
                <Input 
                  className="w-20"
                  placeholder="구역" 
                  required
                  value={newMemberArea}
                  onChange={e => setNewMemberArea(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Input 
                  className="flex-1"
                  placeholder="이름 입력" 
                  required
                  value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                />
                <Button type="submit">추가</Button>
              </div>
            </form>

            {/* 검색 및 리스트 */}
            <div className="flex gap-2 mb-4">
              <Input 
                placeholder="이름으로 검색..." 
                className="flex-1" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 flex-1">
              {filteredMembers.map(member => (
                <div key={member.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-md bg-white hover:border-slate-300 transition-colors">
                  <div>
                    <div className="font-medium text-sm">{member.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {departments.find(d => d.id === member.department_id)?.name || '알수없음'} / {member.area}구역
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteMember(member.id, member.name)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              
              {filteredMembers.length === 0 && (
                <div className="text-center text-slate-500 text-sm py-8">
                  검색 결과가 없습니다.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
