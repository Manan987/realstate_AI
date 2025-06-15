import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { TeamActivity, User } from "@shared/schema";

type TeamActivityWithUser = TeamActivity & { user: User };

export default function TeamActivity() {
  const [commentInput, setCommentInput] = useState("");
  const { toast } = useToast();

  const { data: activities, isLoading } = useQuery<TeamActivityWithUser[]>({
    queryKey: ["/api/team-activity"],
  });

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", "/api/comments", {
        userId: 1, // Default user ID
        content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/comments"] });
      setCommentInput("");
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddComment = () => {
    if (commentInput.trim()) {
      addCommentMutation.mutate(commentInput.trim());
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-800">Team Activity</h3>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-slate-600">Loading activity...</div>
            </div>
          ) : activities && activities.length > 0 ? (
            activities.slice(0, 3).map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-600 text-sm font-medium">
                    {activity.user.initials}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-800">
                    <span className="font-medium">{activity.user.name}</span> {activity.description}
                    {activity.relatedProperty && (
                      <span className="text-primary-600"> {activity.relatedProperty}</span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatTimeAgo(new Date(activity.createdAt!))}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-600">No recent activity</p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Add a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
              className="flex-1 text-sm"
            />
            <Button 
              size="sm" 
              onClick={handleAddComment}
              disabled={!commentInput.trim() || addCommentMutation.isPending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
