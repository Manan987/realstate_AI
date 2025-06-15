import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, MessageSquare, Users, Activity } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTeamActivitySchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { TeamActivity, User, Comment } from "@shared/schema";
import { z } from "zod";

type TeamActivityWithUser = TeamActivity & { user: User };
type CommentWithUser = Comment & { user: User };

const activityFormSchema = insertTeamActivitySchema.extend({
  relatedProperty: z.string().optional(),
});

export default function Team() {
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: teamMembers } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: activities } = useQuery<TeamActivityWithUser[]>({
    queryKey: ["/api/team-activity"],
  });

  const { data: comments } = useQuery<CommentWithUser[]>({
    queryKey: ["/api/comments"],
  });

  const form = useForm<z.infer<typeof activityFormSchema>>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      userId: 1,
      action: "",
      description: "",
      relatedProperty: "",
    },
  });

  const addActivityMutation = useMutation({
    mutationFn: async (data: z.infer<typeof activityFormSchema>) => {
      return apiRequest("POST", "/api/team-activity", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team-activity"] });
      setIsActivityDialogOpen(false);
      form.reset();
      toast({
        title: "Activity logged",
        description: "Your activity has been shared with the team.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to log activity. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof activityFormSchema>) => {
    addActivityMutation.mutate(data);
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
    <>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Team Workspace</h2>
            <p className="text-slate-600">Collaborate and share insights with your team</p>
          </div>
          <Dialog open={isActivityDialogOpen} onOpenChange={setIsActivityDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Log Activity
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Team Activity</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="action"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Action Type</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., updated pricing, added listing" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe what you did..." 
                            className="resize-none"
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="relatedProperty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Related Property (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Property address or name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsActivityDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={addActivityMutation.isPending}>
                      {addActivityMutation.isPending ? "Logging..." : "Log Activity"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        {/* Team Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Users className="text-primary-600" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{teamMembers?.length || 4}</p>
                  <p className="text-slate-600 text-sm">Team Members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <Activity className="text-success-600" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{activities?.length || 0}</p>
                  <p className="text-slate-600 text-sm">Recent Activities</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="text-amber-600" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{comments?.length || 0}</p>
                  <p className="text-slate-600 text-sm">Team Comments</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Team Members */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Team Members</h3>
              <div className="space-y-4">
                {teamMembers?.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-600 font-medium text-sm">{member.initials}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{member.name}</p>
                      <p className="text-sm text-slate-600">{member.role}</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Online
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {activities && activities.length > 0 ? (
                  activities.slice(0, 5).map((activity) => (
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
                            <span className="text-primary-600"> for {activity.relatedProperty}</span>
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
                    <p className="text-slate-600 mb-4">No recent activity</p>
                    <Button size="sm" onClick={() => setIsActivityDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Log First Activity
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Comments */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Team Comments</h3>
            <div className="space-y-4">
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-600 text-sm font-medium">
                        {comment.user.initials}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-slate-800">{comment.user.name}</span>
                        <span className="text-xs text-slate-500">
                          {formatTimeAgo(new Date(comment.createdAt!))}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700">{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-600">No comments yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
