"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Users, UsersRound, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [recentSubmissions, setRecentSubmissions] = useState<{name: string, type: string, time: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecent() {
      try {
        const sixDaysAgo = new Date();
        sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
        const dateString = sixDaysAgo.toISOString();

        const [ssRes, parishRes] = await Promise.all([
          supabase
            .from("sunday_school_reports")
            .select("created_at, departments(name)")
            .gte("created_at", dateString)
            .order("created_at", { ascending: false }),
          supabase
            .from("parish_reports")
            .select("created_at, area, departments(name)")
            .gte("created_at", dateString)
            .order("created_at", { ascending: false })
        ]);

        const ssData = (ssRes.data || []).map((d: any) => ({
          name: d.departments?.name || '알 수 없음',
          type: '주일학교',
          time: d.created_at
        }));

        const parishData = (parishRes.data || []).map((d: any) => ({
          name: `${d.departments?.name || '알 수 없음'} ${d.area}구역`,
          type: '교구',
          time: d.created_at
        }));

        const combined = [...ssData, ...parishData].sort((a, b) => 
          new Date(b.time).getTime() - new Date(a.time).getTime()
        );

        setRecentSubmissions(combined);
      } catch (error) {
        console.error("Failed to fetch recent submissions", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecent();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-8">
      <Card className="w-full max-w-md border-none shadow-none bg-transparent sm:bg-white sm:shadow-sm sm:border-slate-200 mb-8">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-2xl font-bold text-slate-900">
            사역보고서 작성
          </CardTitle>
          <p className="text-sm text-slate-500 mt-2">
            본인의 역할에 맞는 보고서를 선택해 주세요.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/report/sunday-school" className="block w-full">
            <Button size="lg" className="w-full h-16 text-lg justify-start px-6">
              <UsersRound className="mr-4 h-6 w-6" />
              주일학교 보고서 작성
            </Button>
          </Link>
          
          <Link href="/report/parish" className="block w-full">
            <Button size="lg" variant="outline" className="w-full h-16 text-lg justify-start px-6 border-primary text-primary hover:bg-primary/5">
              <Users className="mr-4 h-6 w-6" />
              교구 보고서 작성
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* 최근 제출된 보고서 목록 */}
      <div className="w-full max-w-md px-4 sm:px-0">
        <h3 className="text-sm font-semibold text-slate-500 mb-3 flex items-center">
          <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
          최근 제출 완료 부서 (최근 7일)
        </h3>
        
        {isLoading ? (
          <div className="text-sm text-slate-400 flex items-center justify-center py-4 bg-slate-50 rounded-lg border border-slate-100">
            <Clock className="w-4 h-4 mr-2 animate-spin" /> 불러오는 중...
          </div>
        ) : recentSubmissions.length > 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <ul className="divide-y divide-slate-100 max-h-[250px] overflow-y-auto">
              {recentSubmissions.map((sub, idx) => {
                const date = new Date(sub.time);
                const formattedDate = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
                
                return (
                  <li key={idx} className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full mr-3 ${
                        sub.type === '주일학교' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {sub.type}
                      </span>
                      <span className="font-medium text-sm text-slate-800">{sub.name}</span>
                    </div>
                    <span className="text-xs text-slate-400">{formattedDate}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="text-sm text-slate-500 text-center py-6 bg-slate-50 rounded-lg border border-slate-100">
            최근 제출된 보고서가 없습니다.
          </div>
        )}
      </div>
      
      <div className="mt-12 text-center">
        <Link 
          href="/dashboard" 
          className="text-sm text-slate-500 underline underline-offset-4 hover:text-slate-900 transition-colors"
        >
          관리자 / 대시보드 접속하기
        </Link>
      </div>
    </div>
  );
}
