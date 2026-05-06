'use client';

import { useActivityFeed } from '@/hooks/useSocial';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, User, Award, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ActivityFeedPage() {
  const { activities, isLoading, error, reload } = useActivityFeed();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'SOLVED': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'FOLLOWED': return <User className="w-4 h-4 text-blue-500" />;
      case 'ACHIEVEMENT': return <Award className="w-4 h-4 text-yellow-500" />;
      default: return <RefreshCw className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Social Feed</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Stay updated with your network's progress</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => reload()} disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          Refresh
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {activities.length === 0 && !isLoading && (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center text-slate-500">
              No recent activity to show. Follow some users to see their progress!
            </CardContent>
          </Card>
        )}

        {activities.map((activity) => (
          <Card key={activity.id} className="overflow-hidden hover:border-blue-500/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-slate-100 dark:bg-white/5 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {activity.userId}
                    </span>
                    <span className="text-xs text-slate-400">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    {activity.content}
                  </p>
                  {activity.metadata && (
                    <div className="mt-3 p-3 bg-slate-50 dark:bg-white/5 rounded-lg text-sm">
                      {/* Detailed metadata display could go here */}
                      <pre className="text-xs opacity-50 overflow-auto">
                        {JSON.stringify(activity.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}
      </div>
    </div>
  );
}
