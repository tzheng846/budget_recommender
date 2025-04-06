import { useState } from 'react';
import { analyzeExpenses } from '../services/gemini';

export default function TestGemini() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testGemini = async () => {
    setLoading(true);
    try {
      const testExpenses = [
        { description: 'Grocery shopping', amount: 150, category: 'Food' },
        { description: 'Electric bill', amount: 80, category: 'Utilities' },
        { description: 'Netflix subscription', amount: 15, category: 'Entertainment' }
      ];

      const analysis = await analyzeExpenses(testExpenses);
      setResult(JSON.stringify(analysis, null, 2));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={testGemini}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Gemini API'}
      </button>
      
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
} 