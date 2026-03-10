import { DocumentUploadForm } from "@/components/document-upload-form";

export default function UploadDocumentPage() {
  return (
    <div className="grid gap-6 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Upload Document</h1>
        <p className="text-ink/70">Store private contracts or paperwork locally for your own account only.</p>
      </div>
      <DocumentUploadForm />
    </div>
  );
}
