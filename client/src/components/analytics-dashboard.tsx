import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Eye, FileText, Upload } from "lucide-react";
import type { Document, User } from "@shared/schema";

type DocumentWithUser = Document & { sharedByUser: User };

export default function AnalyticsDashboard() {
  const { data: documents, isLoading } = useQuery<DocumentWithUser[]>({
    queryKey: ["/api/documents"],
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="text-red-600" size={20} />;
      case "excel":
        return <FileText className="text-green-600" size={20} />;
      case "word":
        return <FileText className="text-blue-600" size={20} />;
      default:
        return <FileText className="text-slate-600" size={20} />;
    }
  };

  const getFileIconBg = (type: string) => {
    switch (type) {
      case "pdf":
        return "bg-red-100";
      case "excel":
        return "bg-green-100";
      case "word":
        return "bg-blue-100";
      default:
        return "bg-slate-100";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-800">Shared Documents</h3>
          <Button size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-slate-600">Loading documents...</div>
            </div>
          ) : documents && documents.length > 0 ? (
            documents.map((document) => (
              <div key={document.id} className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className={`w-10 h-10 ${getFileIconBg(document.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  {getFileIcon(document.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{document.name}</p>
                  <p className="text-sm text-slate-500">
                    Shared by <span>{document.sharedByUser.name}</span> • {formatDate(new Date(document.createdAt!))}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 text-slate-400 hover:text-slate-600">
                    <Eye size={16} />
                  </button>
                  <button className="p-1 text-slate-400 hover:text-slate-600">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-600 mb-4">No documents shared yet</p>
              <Button size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Upload First Document
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
