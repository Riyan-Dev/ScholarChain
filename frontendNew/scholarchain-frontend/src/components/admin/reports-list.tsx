"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"

export function ReportsList() {
  // Sample reports data
  const reports = [
    {
      id: "REP001",
      name: "Monthly Financial Summary - March 2023",
      type: "Financial",
      date: "2023-04-01",
      format: "PDF",
      size: "1.2 MB",
    },
    {
      id: "REP002",
      name: "Loan Performance Report - Q1 2023",
      type: "Loan",
      date: "2023-04-05",
      format: "XLSX",
      size: "3.5 MB",
    },
    {
      id: "REP003",
      name: "Donor Contributions - March 2023",
      type: "Donor",
      date: "2023-04-02",
      format: "PDF",
      size: "0.8 MB",
    },
    {
      id: "REP004",
      name: "Default Analysis - Q1 2023",
      type: "Risk",
      date: "2023-04-10",
      format: "PDF",
      size: "2.1 MB",
    },
    {
      id: "REP005",
      name: "University Distribution Report - Q1 2023",
      type: "Analytics",
      date: "2023-04-08",
      format: "XLSX",
      size: "4.2 MB",
    },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Generated Reports</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Report Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Format</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {report.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      report.type === "Financial"
                        ? "default"
                        : report.type === "Loan"
                          ? "secondary"
                          : report.type === "Donor"
                            ? "outline"
                            : report.type === "Risk"
                              ? "destructive"
                              : "default"
                    }
                  >
                    {report.type}
                  </Badge>
                </TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>
                  {report.format} ({report.size})
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

