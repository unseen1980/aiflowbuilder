"use client"

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Plus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast"

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      toast({
        title: "File uploaded successfully",
        description: `${result.fileName} (${result.fileSize} bytes)`,
      })
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error uploading file",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">AI Flow Builder Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="file">File</Label>
              <Input id="file" type="file" onChange={handleFileChange} />
            </div>
            <Button className="mt-4" onClick={handleUpload} disabled={!file}>
              <Upload className="mr-2 h-4 w-4" /> Upload
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Pipelines</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Create and manage your AI pipelines.</p>
            <Link href="/pipeline-editor" passHref>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create New Pipeline
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}