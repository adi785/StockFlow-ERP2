import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatters';

interface SummaryCard {
  title: string;
  description: string;
  value: string;
  icon: React.ReactNode;
  className?: string;
}

interface SummaryCardsProps {
  cards: SummaryCard[];
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card, index) => (
        <Card key={index} className={card.className}>
          <CardHeader className="flex flex-col space-y-1.5">
            <CardTitle className="flex items-center gap-2">
              {card.icon}
              {card.title}
            </CardTitle>
            <CardDescription>{card.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};