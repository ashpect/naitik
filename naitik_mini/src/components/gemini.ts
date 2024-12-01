let session: chrome.aiOriginTrial.languageModel.Session | null = null;

// Define the input format type
interface InputData {
  [id: string]: string;
}

// Function to process each sentence and get the response
async function analyzeDarkPatterns(inputData: InputData): Promise<{ [id: string]: string }> {
  console.log('Analyzing dark patterns...somyaaaaaaaaaaaaaaaaaaa');
  const results: { [id: string]: string } = {};

  // Iterate through each sentence with its ID
  for (const [id, sentence] of Object.entries(inputData)) {
    const prompt = sentence.trim();
    
    // Prepare parameters for API call
    const params = {
      systemPrompt: 'Analyze the given text to identify whether it contains any dark patterns...',
      temperature: parseFloat('1'),  // Default to 0 if null
      topK: parseInt('3'),  // Default to 0 if null
    };

    try {
      const response = await runPrompt('The given string is: ' + prompt, params);
      results[id] = response;  // Store response with the ID
    } catch (e) {
      results[id] = 'Error: ' + (e instanceof Error ? e.message : 'Unknown error');  // Handle error and return it for this sentence
    }
  }

  return results;
}

async function runPrompt(prompt: string, params: any): Promise<string> {
  try {
    if (!session) {
      console.log('Creating new session');
      session = await chrome.aiOriginTrial.languageModel.create(params);
    }
    return session.prompt(prompt);
  } catch (e) {
    console.log('Prompt failed');
    console.error(e);
    console.log('Prompt:', prompt);
    // Reset session
    await reset();
    throw e;
  }
}

async function reset(): Promise<void> {
  if (session) {
    session.destroy();
  }
  session = null;
}

export default analyzeDarkPatterns;
