import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface ExpenseAnalysis {
  topRecommendation: string;
  specificSavings: {
    category: string;
    recommendation: string;
    estimatedSavings: string;
    link?: string;
  }[];
  quickTips: string[];
}

export async function analyzeExpenses(expenses: Array<{ description: string; amount: number; category: string }>): Promise<ExpenseAnalysis> {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    // Prepare the prompt
    const prompt = `Analyze these expenses and provide concise, actionable recommendations with specific savings opportunities and relevant shopping links:
    ${JSON.stringify(expenses, null, 2)}
    
    Please provide a response in the following JSON format:
    {
      "topRecommendation": "One most impactful recommendation",
      "specificSavings": [
        {
          "category": "Category name",
          "recommendation": "Specific actionable recommendation",
          "estimatedSavings": "Estimated monthly/yearly savings",
          "link": "Relevant shopping or comparison site link"
        }
      ],
      "quickTips": [
        "Short, actionable tip 1",
        "Short, actionable tip 2",
        "Short, actionable tip 3"
      ]
    }
    
    Focus on:
    1. Most impactful savings opportunities
    2. Specific, actionable recommendations
    3. Real, relevant shopping or comparison site links
    4. Clear, concise language
    5. Realistic savings estimates`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the response text by removing markdown code block formatting
    const cleanedText = text
      .replace(/```json\n?/g, '')  // Remove opening ```json
      .replace(/```\n?/g, '')      // Remove closing ```
      .trim();                     // Remove any extra whitespace

    // Parse the JSON response
    return JSON.parse(cleanedText) as ExpenseAnalysis;
  } catch (error) {
    console.error('Error analyzing expenses:', error);
    throw error;
  }
} 