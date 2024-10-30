import React, { useState } from 'react';
import { Match } from '../../../types';

interface MatchScoreEditorProps {
  match: Match;
  onUpdate: (updates: Partial<Match>) => void;
}

interface MatchDateEditorProps {
  match: Match;
  onUpdate: (updates: Partial<Match>) => void;
}

export function MatchScoreEditor({ match, onUpdate }: MatchScoreEditorProps) {
  const [homeScore, setHomeScore] = useState<number | null>(match.homeScore);
  const [awayScore, setAwayScore] = useState<number | null>(match.awayScore);

  const handleSubmit = () => {
    if (homeScore !== null && awayScore !== null) {
      onUpdate({
        homeScore,
        awayScore,
        status: 'completed'
      });
    }
  };

  return (
    <div>
      {/* Add your score editing UI here */}
    </div>
  );
}

export function MatchDateEditor({ match, onUpdate }: MatchDateEditorProps) {
  const [date, setDate] = useState<string | null>(match.date);

  const handleSubmit = () => {
    onUpdate({ date });
  };

  return (
    <div>
      {/* Add your date editing UI here */}
    </div>
  );
} 