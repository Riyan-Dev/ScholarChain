"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, CheckCircle, AlertCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// List of required documents
const REQUIRED_DOCUMENTS = [
  { id: "CNIC", label: "CNIC", description: "National Identity Card" },
  { id: "gaurdian_CNIC", label: "Guardian CNIC", description: "Guardian's National Identity Card" },
  { id: "intermediate_result", label: "Intermediate Result", description: "Intermediate education certificate" },
  { id: "bank_statements", label: "Bank Statements", description: "Last 3 months bank statements" },
  { id: "salary_slips", label: "Salary Slips", description: "Last 3 months salary slips" },
  { id: "gas_bills", label: "Gas Bills", description: "Recent gas utility bills" },
  { id: "electricity_bills", label: "Electricity Bills", description: "Recent electricity utility bills" },
  { id: "reference_letter", label: "Reference Letter", description: "Letter of recommendation" },
]

export default function DocumentUploadPage() {
  // State to track uploaded documents
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, File>>({})
  const [currentDocumentType, setCurrentDocumentType] = useState<string | null>(null)

  // Calculate progress
  const uploadedCount = Object.keys(uploadedDocuments).length
  const totalCount = REQUIRED_DOCUMENTS.length
  const progressPercentage = Math.round((uploadedCount / totalCount) * 100)

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!currentDocumentType || acceptedFiles.length === 0) return

      // Take only the first file if multiple are dropped
      const file = acceptedFiles[0]

      setUploadedDocuments((prev) => ({
        ...prev,
        [currentDocumentType]: file,
      }))

      // Reset current document type after upload
      setCurrentDocumentType(null)
    },
    [currentDocumentType],
  )

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxFiles: 1,
  })

  // Remove a document
  const removeDocument = (documentId: string) => {
    setUploadedDocuments((prev) => {
      const newDocs = { ...prev }
      delete newDocs[documentId]
      return newDocs
    })
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Document Upload</CardTitle>
          <CardDescription>Please upload all required documents to complete your application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Upload Progress</span>
              <span className="text-sm font-medium">
                {uploadedCount}/{totalCount} Documents
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Drag & Drop Area */}
          {currentDocumentType ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-1">
                Upload {REQUIRED_DOCUMENTS.find((doc) => doc.id === currentDocumentType)?.label}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">Drag & drop your file here, or click to select</p>
              <p className="text-xs text-muted-foreground">Supported formats: PDF, JPG, PNG (Max size: 10MB)</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentDocumentType(null)
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <FileText className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-1">Select a document to upload</h3>
              <p className="text-sm text-muted-foreground">Choose from the document list below</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {REQUIRED_DOCUMENTS.map((document) => {
          const isUploaded = document.id in uploadedDocuments
          const uploadedFile = uploadedDocuments[document.id]

          return (
            <Card
              key={document.id}
              className={`transition-colors ${isUploaded ? "bg-primary/5 border-primary/20" : ""}`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{document.label}</CardTitle>
                    <CardDescription className="text-xs mt-1">{document.description}</CardDescription>
                  </div>
                  {isUploaded ? (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isUploaded ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <FileText className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm truncate">{uploadedFile.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeDocument(document.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => setCurrentDocumentType(document.id)}>
                    Upload Document
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <Button disabled={uploadedCount < totalCount} className="px-8">
          Submit Documents
        </Button>
      </div>
    </div>
  )
}

