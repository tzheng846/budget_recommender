import { useState, useEffect } from 'react';
import { analyzeExpenses } from '../../services/gemini';

interface Expense {
  description: string;
  amount: number;
  category: string;
}

interface ExpenseAnalysis {
  topRecommendation: string;
  specificSavings: {
    category: string;
    recommendation: string;
    estimatedSavings: string;
    link?: string;
  }[];
  quickTips: string[];
}

export function Recommendations({ expenses }: { expenses: Expense[] }) {
  const [recommendations, setRecommendations] = useState<ExpenseAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getRecommendations = async () => {
      if (expenses.length === 0) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const analysis = await analyzeExpenses(expenses);
        setRecommendations(analysis);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get recommendations');
      } finally {
        setLoading(false);
      }
    };

    getRecommendations();
  }, [expenses]);

  if (loading) {
    return <div className="recommendations-loading">Analyzing your expenses...</div>;
  }

  if (error) {
    return <div className="recommendations-error">Error: {error}</div>;
  }

  if (!recommendations) {
    return null;
  }

  return (
    <div className="recommendations-container">
      <h2>AI-Powered Recommendations</h2>
      <div className="recommendations-content">
        <div className="top-recommendation">
          <h3>Top Recommendation</h3>
          <p>{recommendations.topRecommendation}</p>
        </div>

        <div className="specific-savings">
          <h3>Specific Savings Opportunities</h3>
          {recommendations.specificSavings.map((saving, index) => (
            <div key={index} className="saving-item">
              <div className="saving-header">
                <span className="category">{saving.category}</span>
                <span className="estimated-savings">{saving.estimatedSavings}</span>
              </div>
              <p className="recommendation">{saving.recommendation}</p>
              {saving.link && (
                <div className="action-links">
                  <a 
                    href={saving.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="action-link primary"
                  >
                    Shop Now
                  </a>
                  <a 
                    href={saving.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="action-link secondary"
                  >
                    Compare Prices
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="quick-tips">
          <h3>Quick Tips</h3>
          <ul>
            {recommendations.quickTips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 