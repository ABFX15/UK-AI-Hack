from typing import Dict
from textblob import TextBlob

class SentimentAnalyzer:
    def __init__(self):
        # Emotion keywords for basic emotion detection
        self.emotion_keywords = {
            'enthusiasm': ['excited', 'thrilled', 'passionate', 'eager', 'motivated'],
            'frustration': ['frustrated', 'annoyed', 'disappointed', 'upset'],
            'concern': ['worried', 'concerned', 'uncertain', 'nervous'],
            'confidence': ['confident', 'sure', 'certain', 'positive'],
            'satisfaction': ['satisfied', 'happy', 'pleased', 'content'],
            'dissatisfaction': ['unhappy', 'unsatisfied', 'displeased']
        }

    async def analyze(self, text: str, context: str = "general") -> Dict:
        """
        Analyze sentiment and emotions in text
        """
        try:
            # Use TextBlob for basic sentiment analysis
            blob = TextBlob(text)
            
            # Get polarity (-1 to 1) and subjectivity (0 to 1)
            polarity = blob.sentiment.polarity
            subjectivity = blob.sentiment.subjectivity
            
            # Convert polarity to sentiment label
            if polarity > 0.1:
                sentiment = "positive"
            elif polarity < -0.1:
                sentiment = "negative"
            else:
                sentiment = "neutral"
            
            # Calculate confidence based on absolute polarity and subjectivity
            confidence = min(1.0, abs(polarity) + (subjectivity * 0.5))
            
            # Detect emotions
            emotions = self._detect_emotions(text.lower())
            
            # Context-specific adjustments
            if context == "interview_feedback":
                sentiment, confidence = self._adjust_for_interview_context(
                    text, sentiment, confidence
                )
            elif context == "job_application":
                sentiment, confidence = self._adjust_for_application_context(
                    text, sentiment, confidence
                )
            
            return {
                "sentiment": sentiment,
                "confidence": round(confidence, 3),
                "emotions": emotions
            }
            
        except Exception as e:
            raise Exception(f"Failed to analyze sentiment: {str(e)}")

    def _detect_emotions(self, text: str) -> Dict[str, float]:
        """
        Detect basic emotions in text based on keywords
        """
        emotions = {}
        total_keywords = 0
        
        for emotion, keywords in self.emotion_keywords.items():
            count = sum(1 for keyword in keywords if keyword in text)
            if count > 0:
                emotions[emotion] = count
                total_keywords += count
        
        # Normalize to percentages
        if total_keywords > 0:
            for emotion in emotions:
                emotions[emotion] = round(emotions[emotion] / total_keywords, 3)
        
        return emotions

    def _adjust_for_interview_context(self, text: str, sentiment: str, confidence: float) -> tuple:
        """
        Adjust sentiment analysis for interview feedback context
        """
        # Look for specific interview-related positive/negative indicators
        positive_indicators = [
            'impressed', 'strong candidate', 'good fit', 'recommended',
            'skilled', 'experienced', 'knowledgeable'
        ]
        negative_indicators = [
            'not a fit', 'lacks experience', 'concerning', 'red flag',
            'unprepared', 'inexperienced'
        ]
        
        text_lower = text.lower()
        
        # Boost confidence if we find specific indicators
        pos_count = sum(1 for indicator in positive_indicators if indicator in text_lower)
        neg_count = sum(1 for indicator in negative_indicators if indicator in text_lower)
        
        if pos_count > neg_count and sentiment == "positive":
            confidence = min(1.0, confidence + 0.2)
        elif neg_count > pos_count and sentiment == "negative":
            confidence = min(1.0, confidence + 0.2)
        
        return sentiment, confidence

    def _adjust_for_application_context(self, text: str, sentiment: str, confidence: float) -> tuple:
        """
        Adjust sentiment analysis for job application context
        """
        # Look for enthusiasm and interest indicators
        enthusiasm_indicators = [
            'excited', 'passionate about', 'love to', 'thrilled',
            'perfect opportunity', 'dream job', 'ideal role'
        ]
        
        text_lower = text.lower()
        enthusiasm_count = sum(1 for indicator in enthusiasm_indicators if indicator in text_lower)
        
        if enthusiasm_count > 0 and sentiment in ["positive", "neutral"]:
            sentiment = "positive"
            confidence = min(1.0, confidence + (enthusiasm_count * 0.1))
        
        return sentiment, confidence
