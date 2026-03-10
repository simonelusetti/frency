import { VideoUploadForm } from "@/components/video-upload-form";

export default function UploadVideoPage() {
  return (
    <div className="grid gap-6 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Upload Highlight Video</h1>
        <p className="text-ink/70">Attach an MP4 highlight reel to your public profile.</p>
      </div>
      <VideoUploadForm />
    </div>
  );
}
