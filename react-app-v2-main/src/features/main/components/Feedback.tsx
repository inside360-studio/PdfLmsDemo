import { FC } from 'react';
import { FeedbackResponse } from '../mainApi';

interface FeedbackProps {
  feedbackData: FeedbackResponse;
}

const Feedback: FC<FeedbackProps> = ({ feedbackData }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Feedback</h1>
      {feedbackData.feedback.map((item, index) => (
        <div key={index} className="mb-4 p-4 border rounded shadow">
          <h2 className="text-xl font-semibold">{item.question}</h2>
          <p className="text-gray-700">Your Answer: {item.userAnswer}</p>
          <p className={`text-${item.isCorrect ? 'green' : 'red'}-500`}>
            {item.isCorrect ? 'Correct' : 'Incorrect'}
          </p>
          <p className="text-gray-700">{item.feedback}</p>
        </div>
      ))}
    </div>
  );
};

export default Feedback;
