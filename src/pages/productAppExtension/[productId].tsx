import DescriptionGenerator, { type PromptAttributes, type Result } from "~/components/DescriptionGenerator/DescriptionGenerator";

export default function ProductAppExtensionContent() {
  const isLoading = false;

  const results: Result[] = [
    {
      description: 'This is a test description',
      promptAttributes: 'Concise; 5 words; Optimized for SEO; Include product attributes; Brand voice: Upbeat, conversational, and confident; additional attributes: Organic, recycled cotton; additional instructions: Write everything in sentence case.',
    },
    {
      description: 'This is a test description 2',
      promptAttributes: 'Concise; 10 words; Optimized for SEO; Include product attributes; Brand voice: Upbeat, conversational, and confident; additional attributes: Organic, recycled cotton; additional instructions: Write everything in sentence case.',
    }
  ];

  const handleResultChange = (index: number, result: Result) => {
    // set local storage for this index
  };

  const generateDescription = (promptAttributes: PromptAttributes) => ({}); // magic

  return (
    <DescriptionGenerator isLoading={isLoading} results={results} generateDescription={generateDescription} handleResultChange={handleResultChange} />
  );
}
