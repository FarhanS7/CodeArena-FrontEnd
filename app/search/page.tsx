'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchService } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Loader2, Star } from 'lucide-react';
import Link from 'next/link';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [difficulty, setDifficulty] = useState<string | undefined>(undefined);

  const performSearch = async () => {
    setIsLoading(true);
    try {
      const response = await SearchService.searchProblems(query, difficulty);
      setResults(response.data.data);
      setTotal(response.data.total);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    performSearch();
  }, [difficulty]);

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 space-y-8">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filters
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-slate-500 mb-2 block">Difficulty</label>
                <div className="flex flex-wrap gap-2">
                  {['EASY', 'MEDIUM', 'HARD'].map((d) => (
                    <Button
                      key={d}
                      variant={difficulty === d ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDifficulty(difficulty === d ? undefined : d)}
                      className="rounded-full"
                    >
                      {d}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Search Results */}
        <div className="flex-1 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && performSearch()}
              placeholder="Search by problem title, description or tags..."
              className="pl-12 h-12 text-lg rounded-2xl bg-white dark:bg-white/5 border-slate-200 dark:border-white/10"
            />
            <Button 
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl"
              onClick={performSearch}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Found <span className="font-bold text-slate-900 dark:text-white">{total}</span> results
            </p>
          </div>

          <div className="grid gap-4">
            {results.map((problem) => (
              <Link key={problem.id} href={`/problems/${problem.id}`}>
                <Card className="hover:border-blue-500/50 transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {problem.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge 
                            variant="secondary"
                            className={
                              problem.difficulty === 'EASY' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                              problem.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                              'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }
                          >
                            {problem.difficulty}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-slate-500">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{problem.acceptanceRate || 0}% Accuracy</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        Solve Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            
            {results.length === 0 && !isLoading && (
              <div className="py-24 text-center">
                <div className="bg-slate-100 dark:bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">No problems found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your search query or filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
