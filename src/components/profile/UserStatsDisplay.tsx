import { Trophy, CheckCircle, BarChart3, Zap } from 'lucide-react';

interface Stats {
  problemsSolved: number;
  submissionAccepted: number;
  submissionTotal: number;
  contestsParticipated: number;
  rating: number;
  maxRating: number;
  acceptanceRate: number;
  averageTime: number;
  globalRank: number;
  totalUsers: number;
  percentile: number;
}

interface UserStatsDisplayProps {
  stats: Stats;
}

/**
 * UserStatsDisplay Component - Displays 4 main statistics cards
 * Shows: problems solved, acceptance rate, current rating, contests participated
 */
export function UserStatsDisplay({ stats }: UserStatsDisplayProps) {
  const statCards = [
    {
      label: 'Problems Solved',
      value: stats.problemsSolved,
      testId: 'problems-solved',
      icon: Trophy,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Acceptance Rate',
      value: `${(stats.acceptanceRate * 100).toFixed(0)}%`,
      testId: 'acceptance-rate',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Current Rating',
      value: stats.rating,
      testId: 'current-rating',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Contests Participated',
      value: stats.contestsParticipated,
      testId: 'contests-participated',
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <>
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.testId} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">{card.label}</p>
                <p data-testid={card.testId} className="text-3xl font-bold text-slate-900">
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
