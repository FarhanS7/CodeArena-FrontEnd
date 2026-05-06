'use client';

import { useAchievements } from '@/hooks/useSocial';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export function UserAchievements({ userId }: { userId: string }) {
  const { achievements, isLoading, error } = useAchievements(userId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {achievements.length === 0 ? (
        <Card className="col-span-full border-dashed">
          <CardContent className="py-12 text-center text-slate-500">
            No achievements earned yet. Solve more problems to unlock them!
          </CardContent>
        </Card>
      ) : (
        achievements.map((achievement) => (
          <Card key={achievement.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{achievement.title}</h4>
                  <Badge variant="secondary" className="mt-1 bg-slate-100 dark:bg-white/5 text-[10px]">
                    {achievement.achievementType}
                  </Badge>
                  <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>Earned {format(new Date(achievement.earnedAt), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
