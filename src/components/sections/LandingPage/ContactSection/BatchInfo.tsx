import { Calendar, Target, DollarSign, Clock, Monitor } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BatchInfoProps {
  batchStartDate?: string;
  targetExams?: string;
  fees?: string;
  classSchedule?: string;
  classMode?: string;
}

export function BatchInfo({
  batchStartDate = "Soon",
  targetExams = "2027",
  fees,
  classSchedule,
  classMode,
}: BatchInfoProps) {
  // Format fees: if it's a plain number, prefix ₹ and add commas
  const displayFees = fees
    ? /^\d+$/.test(fees.trim())
      ? `\u20B9${Number(fees).toLocaleString("en-IN")}`
      : fees
    : undefined;
  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Batch Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Batch Starts:</p>
            <p className="text-sm text-muted-foreground">{batchStartDate}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Target Exam Dates:</p>
            <p className="text-sm text-muted-foreground">{targetExams}</p>
          </div>
          {classSchedule && (
            <div className="space-y-2">
              <p className="text-sm font-medium flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                Class Timings:
              </p>
              <p className="text-sm text-muted-foreground">{classSchedule}</p>
            </div>
          )}
          {classMode && (
            <div className="space-y-2">
              <p className="text-sm font-medium flex items-center gap-1.5">
                <Monitor className="h-3.5 w-3.5 text-primary" />
                Mode:
              </p>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {classMode}
              </span>
            </div>
          )}
          <div className="space-y-2">
            <p className="text-sm font-medium">Level:</p>
            <p className="text-sm text-muted-foreground">CFA Level 1 (Level 2 coming soon)</p>
          </div>
        </CardContent>
      </Card>

      {displayFees && (
        <Card className="border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Course Fees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{displayFees}</p>
          </CardContent>
        </Card>
      )}

      <Card className="border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Our Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Let&apos;s build your career in finance — step by step, level by level! 
            Our mission is to provide quality education with personal attention to 
            help you achieve your CFA dreams.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
