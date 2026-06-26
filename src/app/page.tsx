import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Users, UsersRound } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-md border-none shadow-none bg-transparent sm:bg-white sm:shadow-sm sm:border-slate-200">
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
