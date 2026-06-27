"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Trash2, Edit } from "lucide-react";

function EditReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const type = searchParams?.get("type");
  const id = searchParams?.get("id");

  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!type || !id) {
      alert("잘못된 접근입니다.");
      router.push("/");
    }
  }, [type, id, router]);

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsLoading(true);
    try {
      const table = type === "sunday-school" ? "sunday_school_reports" : "parish_reports";
      
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        alert("보고서를 찾을 수 없거나 데이터베이스 오류가 발생했습니다.");
      } else if (data.password === password) {
        setIsAuthenticated(true);
        setReportData(data);
      } else {
        alert("비밀번호가 일치하지 않습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말로 이 보고서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const table = type === "sunday-school" ? "sunday_school_reports" : "parish_reports";
      
      // Cascade delete is configured in SQL schema (ON DELETE CASCADE), so related records will be deleted automatically.
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("id", id);

      if (error) throw error;

      alert("성공적으로 삭제되었습니다.");
      router.push("/");
    } catch (err: any) {
      console.error(err);
      alert("삭제 중 오류가 발생했습니다: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    // For now, since edit requires full form rendering, we guide them to delete and recreate, 
    // or we can implement the full edit form here.
    alert("현재 버전에서는 보고서 구조가 복잡하여 직접 수정 기능이 준비 중입니다.\n보고서를 삭제하신 후 다시 작성해 주시면 감사하겠습니다.");
  };

  if (!type || !id) return null;

  return (
    <div className="max-w-md mx-auto space-y-6 pt-10">
      <div className="flex items-center gap-4 border-b pb-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">보고서 수정 / 삭제</h1>
        </div>
      </div>

      {!isAuthenticated ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">비밀번호 확인</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyPassword} className="space-y-4">
              <p className="text-sm text-slate-500">
                보고서를 작성할 때 설정한 비밀번호를 입력해 주세요.
              </p>
              <Input 
                type="password" 
                placeholder="비밀번호 입력"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "확인 중..." : "확인"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">보고서 관리</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
              <p className="text-sm font-medium text-slate-700">작성자: {reportData?.author}</p>
              <p className="text-sm text-slate-500 mt-1">작성일: {new Date(reportData?.created_at).toLocaleDateString()}</p>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={handleEdit}
              >
                <Edit className="w-4 h-4 mr-2" />
                수정하기
              </Button>
              
              <Button 
                variant="outline" 
                className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? "삭제 중..." : "삭제하기"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function EditReportPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-500">로딩 중...</div>}>
      <EditReportContent />
    </Suspense>
  );
}
