import prompts from 'prompts';

const dealQuestions = async (questions) => {
  const result = await prompts(questions);
  return result;
}

export default dealQuestions;
