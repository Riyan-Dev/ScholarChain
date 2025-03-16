import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function LoanDetailsSkeleton() {
  return (
    <div className="space-y-8">
      <LoanSummaryCardSkeleton />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LoanProgressSkeleton />
        <LoanTimelineSkeleton />
      </div>

      <InstallmentTableSkeleton />
    </div>
  )
}

function LoanSummaryCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-4 w-48 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}

function LoanProgressSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-36" />
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-2 w-full" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 text-center p-4 rounded-lg bg-muted/50">
              <Skeleton className="h-10 w-16 mx-auto" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </div>
            <div className="space-y-2 text-center p-4 rounded-lg bg-muted/50">
              <Skeleton className="h-10 w-16 mx-auto" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function LoanTimelineSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-40" />
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div className="mb-6 p-4 border rounded-lg bg-muted/30">
            <Skeleton className="h-5 w-32 mb-2" />
            <div className="flex justify-between items-center">
              <div>
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>

          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="h-5 w-5 rounded-full mt-1" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function InstallmentTableSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Skeleton className="h-5 w-8" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-5 w-24" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-5 w-24" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-5 w-24" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-5 w-16" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-5 w-8" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16" />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}

