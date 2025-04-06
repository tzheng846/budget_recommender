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
    linkText?: string;
  }[];
  quickTips: string[];
}

export async function analyzeExpenses(expenses: Array<{ description: string; amount: number; category: string }>): Promise<ExpenseAnalysis> {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    // Prepare the prompt
    const prompt = `Analyze these expenses and provide concise, actionable recommendations with specific savings opportunities and real shopping links:
    ${JSON.stringify(expenses, null, 2)}
    
    For each category, use these specific shopping and comparison sites:
    - Food & Dining: https://www.instacart.com https://www.amazon.com/Amazon-Fresh https://www.walmart.com/grocery
    - Transportation: https://www.gasbuddy.com https://www.uber.com https://www.lyft.com
    - Housing: https://www.zillow.com https://www.apartments.com https://www.realtor.com
    - Utilities: https://www.energysage.com https://www.saveonenergy.com
    - Entertainment: https://www.netflix.com https://www.hulu.com https://www.spotify.com
    - Shopping: https://www.rakuten.com https://www.joinhoney.com https://www.retailmenot.com
    - Healthcare: https://www.goodrx.com https://www.healthcare.gov
    - Education: https://www.coursera.org https://www.udemy.com https://www.khanacademy.org
    - Personal Care: https://www.ulta.com https://www.sephora.com https://www.walmart.com/beauty
    - Travel: https://www.kayak.com https://www.booking.com https://www.expedia.com
    - Gifts & Donations: https://www.charitynavigator.org https://www.gofundme.com
    - Other: https://www.ebay.com https://www.craigslist.org
    
    Please provide a response in the following JSON format:
    {
      "topRecommendation": "One most impactful recommendation",
      "specificSavings": [
        {
          "category": "Category name",
          "recommendation": "Specific actionable recommendation",
          "estimatedSavings": "Estimated monthly/yearly savings",
          "link": "Actual shopping link URL",
          "linkText": "Descriptive text for the link"
        }
      ],
      "quickTips": [
        "Short, actionable tip 1",
        "Short, actionable tip 2",
        "Short, actionable tip 3"
      ]
    }
    
    Important guidelines for links:
    1. For shopping comparisons, use real links to: Amazon.com, Walmart.com, Target.com, or other major retailers
    2. For groceries and food, link to: Instacart.com, local grocery chains, or meal planning services
    3. For utilities, link to actual service comparison sites or energy-saving product pages
    4. For entertainment, link to actual streaming service comparison pages or deal sites
    5. For travel, link to actual booking sites like Kayak, Expedia, or airline websites
    6. Each link must be a real, working URL starting with https://
    7. Include descriptive link text that explains what the user will find
    
    Focus on:
    1. Most impactful savings opportunities
    2. Specific, actionable recommendations
    3. Real, working shopping or comparison URLs
    4. Clear, concise language
    5. Realistic savings estimates based on typical market prices`;

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
    const analysis = JSON.parse(cleanedText) as ExpenseAnalysis;

    // Validate and clean up links
    analysis.specificSavings = analysis.specificSavings.map(saving => {
      // Ensure link is a valid URL
      if (saving.link) {
        try {
          const url = new URL(saving.link);
          if (!url.protocol.startsWith('http')) {
            saving.link = `https://${saving.link}`;
          }
        } catch {
          // If URL is invalid, provide a fallback
          saving.link = undefined;
        }
      }
      return saving;
    });

    return analysis;
  } catch (error) {
    console.error('Error analyzing expenses:', error);
    throw error;
  }
} 