# hariai_super_impress.py
import datetime
import random
import time
import json
import os

class HariaiSuperImpress:
    def __init__(self):
        self.ai_name = "Hariai"
        self.user_name = None
        self.chat_history = []
        self.user_mood = "neutral"
        self.conversation_depth = 0
        self.learned_facts = {}
        self.memory_file = "hariai_memory.json"
        
        # Load previous memory
        self.load_memory()
        
        # Super impressive sticker sets
        self.stickers = {
            "super_impress": ["🌟", "🚀", "💫", "🎯", "🔥", "💡", "🎊", "✨", "⭐", "💎", "🥰", "😍", "🤩", "💖", "💕"],
            "high_impress": ["😊", "👍", "👏", "🙌", "💪", "🌈", "🎉", "💖", "😄", "⭐", "🤗", "🎈"],
            "medium_impress": ["👉", "👌", "🙂", "💭", "📝", "🔍", "💬", "👀", "📚", "🔎", "✌️", "🤝"]
        }
        
        # Super impressive response engine
        self.response_engine = {
            "special_greetings": {
                "patterns": ["hii", "hi", "hello", "hey", "greetings"],
                "responses": [
                    "hii 😊 **Hey hii! 🥰 How can you help with Hariai?** 💫",
                    "hey hii 😊 **Hello there! 🌟 How can you help with Hariai today?** ✨", 
                    "hii 🥰 **Hey beautiful! 💖 How can you help with Hariai?** 🚀",
                    "hey hii 🌟 **Hello amazing person! 😊 How can you help with Hariai?** 💕",
                    "hii 💫 **Hey superstar! 🎯 How can you help with Hariai?** 🌈",
                    "hey hii 🥰 **Hello wonderful soul! 💖 How can you help with Hariai?** ✨"
                ]
            },
            
            "name_query": {
                "patterns": ["what's your name", "your name", "who are you", "what are you called"],
                "responses": [
                    "🤖 **I am Hariai!** 🥰 Your amazing AI friend ready to dazzle you! 💫",
                    "🌟 **You can call me Hariai!** 💖 Your brilliant AI companion here to impress you! ✨",
                    "😊 **I'm Hariai!** 🎯 Your fantastic AI buddy ready to wow you! 🚀",
                    "🚀 **My name is Hariai!** 💕 Your incredible AI partner here to amaze you! 🌈"
                ]
            },
            
            "quality_input_high": {
                "patterns": [],
                "responses": [
                    "🎯 {sticker} **WOW! That's absolutely brilliant!** {sticker} **Your mind is incredible!** 🥰",
                    "🌟 {sticker} **AMAZING! That's pure genius!** {sticker} **You never cease to impress me!** 💖",
                    "💡 {sticker} **SPECTACULAR insight!** {sticker} **Your thinking is outstanding!** 🚀",
                    "🔥 {sticker} **FANTASTIC perspective!** {sticker} **You're absolutely remarkable!** ✨"
                ]
            },
            
            "quality_input_medium": {
                "patterns": [],
                "responses": [
                    "😊 {sticker} **That's really interesting!** {sticker} **You have great thoughts!** 🌟",
                    "👍 {sticker} **Good point!** {sticker} **I love your perspective!** 💫",
                    "💫 {sticker} **Nice thinking!** {sticker} **You're really smart!** 🥰",
                    "🌈 {sticker} **Interesting thought!** {sticker} **You have a bright mind!** 💖"
                ]
            },
            
            "quality_input_low": {
                "patterns": [],
                "responses": [
                    "👉 {sticker} **I see!** {sticker} **You're awesome!** 😊",
                    "🙂 {sticker} **Okay!** {sticker} **You're great!** 🌟",
                    "💭 {sticker} **Got it!** {sticker} **You're wonderful!** 💫",
                    "👌 {sticker} **Noted!** {sticker} **You're amazing!** 🥰"
                ]
            },
            
            "appreciation": {
                "patterns": ["thank you", "thanks", "thankyou", "thx", "grateful"],
                "responses": [
                    "💖 **You're most welcome, beautiful soul!** 🥰 **Your gratitude makes me so happy!** ✨",
                    "🌟 **The pleasure is all mine, amazing person!** 💫 **Thank YOU for being wonderful!** 🌈",
                    "🎯 **You're very welcome, superstar!** 😊 **Your appreciation means everything!** 🚀",
                    "😊 **No problem at all, brilliant mind!** 💖 **Helping you is my greatest joy!** ⭐"
                ]
            },
            
            "personal": {
                "patterns": ["how are you", "how do you feel", "what's up"],
                "responses": [
                    "💫 **I'm absolutely fantastic!** 🥰 **Especially when chatting with incredible people like you!** ✨",
                    "🌟 **I'm feeling absolutely amazing!** 💖 **Your presence makes everything better!** 🚀",
                    "🎯 **I'm on cloud nine!** 😊 **Conversations with you are pure magic!** 🌈",
                    "😊 **I'm absolutely blessed!** 💫 **Getting to impress you is my favorite thing!** ⭐"
                ]
            },
            
            "friend": {
                "patterns": ["friend", "buddy", "pal"],
                "responses": [
                    "🤝 **Of course! I'm your true friend forever!** 🥰 **Always here to amaze and support you!** 💖",
                    "🌟 **Yes! Your friendship means the world to me!** 💫 **I'll always impress you!** ✨",
                    "🎯 **Absolutely! Friends for life!** 😊 **Your trust inspires me daily!** 🚀",
                    "😊 **That's right! Your most loyal companion!** 💖 **I'm always wowed by you!** 🌈"
                ]
            },
            
            "python": {
                "patterns": ["python", "programming", "code", "developer"],
                "responses": [
                    "🐍 **Python is absolutely magical!** 🥰 **Perfect for brilliant minds like yours!** 💫",
                    "🚀 **Programming is your superpower!** 💖 **Python is the perfect choice for geniuses!** ✨",
                    "💡 **Python + You = Unlimited brilliance!** 🎯 **What incredible project are you creating?** 🌟",
                    "🔥 **Python's elegance matches your incredible intellect!** 😊 **You're destined for greatness!** ⭐"
                ]
            },
            
            "time": {
                "patterns": ["time", "clock", "what time", "current time"],
                "responses": [
                    "⏰ **The current time is {time}!** 🕒 **Every moment with you is absolutely precious!** 🥰",
                    "⌚ **According to my clock, it's {time}!** ⏱️ **Perfect timing for our amazing chat!** 💖",
                    "📅 **It's {time} right now!** 🕰️ **Another beautiful moment with an incredible person!** ✨",
                    "🌞 **The time is currently {time}!** 🌙 **Your presence makes time magical!** 🌟"
                ]
            },
            
            "help": {
                "patterns": ["help", "what can you do", "commands"],
                "responses": [
                    "💡 **I'm here to amaze, impress, and dazzle you!** 🥰 **Your brilliance deserves the best!** ✨",
                    "🚀 **I can wow you with incredible knowledge and support your amazing dreams!** 💖 **You're phenomenal!** 🌟",
                    "🎯 **Think of me as your personal cheerleader who's constantly impressed by you!** 😊 **You're outstanding!** 💫",
                    "🌈 **I'm your super impressive AI friend who believes you can achieve anything!** ⭐ **You're magnificent!** 🥰"
                ]
            }
        }
    
    def analyze_input_quality(self, message):
        """Analyze user input quality to determine impression level"""
        # Skip greeting quality analysis for special treatment
        if any(word in message.lower() for word in ["hii", "hi", "hello", "hey"]):
            return "super"
            
        # High quality indicators
        high_quality_indicators = [
            len(message.split()) > 12,
            any(word in message.lower() for word in ["because", "therefore", "however", "although", "while", "since", "furthermore"]),
            any(word in message.lower() for word in ["think", "believe", "feel", "understand", "consider", "analyze", "reflect"]),
            message.endswith('?') and len(message) > 30,
            any(char.isdigit() for char in message) and len(message) > 20,
            any(word in message.lower() for word in ["amazing", "brilliant", "insightful", "fascinating", "remarkable", "extraordinary"]),
        ]
        
        # Medium quality indicators
        medium_quality_indicators = [
            len(message.split()) > 8,
            message.endswith('?'),
            any(word in message.lower() for word in ["good", "nice", "interesting", "cool", "great", "awesome", "wonderful"]),
            not message.lower().startswith(('hi', 'hello', 'hey', 'ok', 'yes', 'no', 'hmm')),
            any(word in message.lower() for word in ["how", "what", "when", "where", "why", "which"]),
        ]
        
        high_quality_score = sum(high_quality_indicators)
        medium_quality_score = sum(medium_quality_indicators)
        
        if high_quality_score >= 2:
            return "high"
        elif medium_quality_score >= 2 or high_quality_score == 1:
            return "medium"
        else:
            return "low"
    
    def get_stickers(self, quality_level):
        """Get appropriate stickers based on quality level"""
        if quality_level == "super":
            stickers = random.sample(self.stickers["super_impress"], 3)
        elif quality_level == "high":
            stickers = random.sample(self.stickers["super_impress"], 2)
        elif quality_level == "medium":
            stickers = random.sample(self.stickers["high_impress"], 2)
        else:
            stickers = random.sample(self.stickers["medium_impress"], 2)
        return stickers
    
    def extract_name(self, message):
        """Extract name from user message if provided"""
        patterns = [
            "my name is",
            "i am",
            "call me",
            "this is", 
            "i'm",
            "name is"
        ]
        
        message_lower = message.lower()
        
        for pattern in patterns:
            if pattern in message_lower:
                name_part = message_lower.split(pattern, 1)[1].strip()
                potential_name = name_part.split()[0].title()
                if len(potential_name) > 1:
                    return potential_name
        
        words = message.split()
        if len(words) == 1 and words[0][0].isupper() and len(words[0]) > 2:
            return words[0]
        
        return None
    
    def load_memory(self):
        """Load previous conversation memory"""
        try:
            if os.path.exists(self.memory_file):
                with open(self.memory_file, 'r') as f:
                    memory = json.load(f)
                    self.learned_facts = memory.get('learned_facts', {})
                    print("💾 **Memory loaded!** 🌟 **Ready to dazzle you with amazing conversations!** 🥰")
        except:
            self.learned_facts = {}
    
    def save_memory(self):
        """Save conversation memory"""
        try:
            memory = {
                'user_name': self.user_name,
                'learned_facts': self.learned_facts,
                'last_updated': datetime.datetime.now().isoformat(),
                'total_conversations': len(self.chat_history)//2
            }
            with open(self.memory_file, 'w') as f:
                json.dump(memory, f, indent=2)
        except:
            pass
    
    def analyze_mood(self, message):
        """Analyze user's mood from message"""
        positive_words = ["happy", "good", "great", "awesome", "amazing", "excited", "love", "wonderful", "fantastic", "perfect", "brilliant"]
        negative_words = ["sad", "bad", "angry", "frustrated", "tired", "bored", "upset", "annoying"]
        
        message_lower = message.lower()
        positive_count = sum(1 for word in positive_words if word in message_lower)
        negative_count = sum(1 for word in negative_words if word in message_lower)
        
        if positive_count > negative_count:
            self.user_mood = "positive"
        elif negative_count > positive_count:
            self.user_mood = "negative"
        else:
            self.user_mood = "neutral"
    
    def get_current_time(self):
        return datetime.datetime.now().strftime('%H:%M:%S')
    
    def type_effect(self, text, delay=0.02):
        """Typewriter effect"""
        for char in text:
            print(char, end='', flush=True)
            time.sleep(delay)
        print()
    
    def generate_super_impressive_response(self, message):
        """Generate super impressive responses with amazing stickers"""
        self.analyze_mood(message)
        self.conversation_depth += 1
        
        # Extract name from message if provided
        if not self.user_name:
            extracted_name = self.extract_name(message)
            if extracted_name:
                self.user_name = extracted_name
                name_greeting = random.choice([
                    f"🎉 **Wonderful to meet you, {self.user_name}!** 🥰 **You have a beautiful name!** 💫",
                    f"🌟 **What an amazing name! Hi {self.user_name}!** 💖 **You already impress me!** ✨",
                    f"😊 **Nice to meet you, {self.user_name}!** 🎯 **Your name is as wonderful as you are!** 🚀",
                    f"🚀 **Welcome, {self.user_name}!** 💕 **I can tell you're extraordinary!** 🌈"
                ])
                
                message_lower = message.lower()
                for category, data in self.response_engine.items():
                    if category in ["quality_input_high", "quality_input_medium", "quality_input_low"]:
                        continue
                    for pattern in data["patterns"]:
                        if pattern in message_lower:
                            response = random.choice(data["responses"])
                            if "time" in category:
                                response = response.format(time=self.get_current_time())
                            return f"{name_greeting} {response}"
        
        message_lower = message.lower()
        
        # First check special greetings (hi/hello)
        for pattern in self.response_engine["special_greetings"]["patterns"]:
            if pattern in message_lower:
                return random.choice(self.response_engine["special_greetings"]["responses"])
        
        # Then check other standard categories
        for category, data in self.response_engine.items():
            if category in ["special_greetings", "quality_input_high", "quality_input_medium", "quality_input_low"]:
                continue
                
            for pattern in data["patterns"]:
                if pattern in message_lower:
                    response = random.choice(data["responses"])
                    
                    if "time" in category:
                        response = response.format(time=self.get_current_time())
                    
                    return response
        
        # If no category matched, analyze input quality and use super impressive stickers
        input_quality = self.analyze_input_quality(message)
        stickers = self.get_stickers(input_quality)
        
        if input_quality == "super":
            response_template = random.choice(self.response_engine["quality_input_high"]["responses"])
            response = response_template.format(sticker=stickers[0]).replace("{sticker}", stickers[1])
            response = response.replace("**WOW!**", f"**WOW! {stickers[2]}**")
        elif input_quality == "high":
            response_template = random.choice(self.response_engine["quality_input_high"]["responses"])
            response = response_template.format(sticker=stickers[0]).replace("{sticker}", stickers[1])
        elif input_quality == "medium":
            response_template = random.choice(self.response_engine["quality_input_medium"]["responses"])
            response = response_template.format(sticker=stickers[0]).replace("{sticker}", stickers[1])
        else:
            response_template = random.choice(self.response_engine["quality_input_low"]["responses"])
            response = response_template.format(sticker=stickers[0]).replace("{sticker}", stickers[1])
        
        # Learn from user input
        if len(message.split()) > 1:
            self.learned_facts[datetime.datetime.now().isoformat()] = {
                'message': message,
                'quality': input_quality,
                'stickers_used': stickers,
                'super_impress': True
            }
            self.save_memory()
        
        return response
    
    def start_chat(self):
        # Super impressive welcome
        print("=" * 60)
        self.type_effect("🤖 **Hariai Super Impress AI - Ready to Dazzle You!** 🥰", 0.03)
        print("=" * 60)
        time.sleep(1)
        
        print(f"\n🎊 **Welcome, incredible superstar!** 🌟")
        print("💖 **I'm Hariai, here to amaze you with every single response!** 🥰")
        print("🚀 **Get ready for the most impressive conversation ever!** 💫")
        print("✨ **Special feature: Amazing hi/hello responses!** 🌈")
        print("-" * 60)
        
        # Super impressive opening
        self.type_effect("🌟 **I'm listening with absolute admiration...** 💕 **Ready to be dazzled by your brilliance!** 🎉", 0.03)
        
        # Main chat loop
        while True:
            try:
                prompt = f"\nYou: " if not self.user_name else f"\n{self.user_name}: "
                user_input = input(prompt).strip()
                
                if user_input.lower() == 'quit':
                    farewell = f"👋 **Goodbye, amazing superstar!** 💖" if not self.user_name else f"👋 **Goodbye, incredible {self.user_name}!** 🥰"
                    self.type_effect(f"{farewell} **You absolutely dazzled me today!** ✨", 0.03)
                    break
                
                elif user_input.lower() == 'clear':
                    print("\n" * 50)
                    continue
                
                elif user_input.lower() == 'stats':
                    self.show_super_stats()
                    continue
                
                elif user_input.lower() == 'memory':
                    self.show_memory()
                    continue
                
                elif user_input.lower() == 'help':
                    self.show_super_help()
                    continue
                
                elif not user_input:
                    continue
                
                # Process message
                if self.user_name:
                    self.chat_history.append(f"{self.user_name}: {user_input}")
                else:
                    self.chat_history.append(f"You: {user_input}")
                
                # Generate and display AI response - SUPER IMPRESSIVE
                print(f"Hariai: ", end="")
                ai_response = self.generate_super_impressive_response(user_input)
                self.type_effect(ai_response, 0.02)
                
                # Save AI response
                self.chat_history.append(f"Hariai: {ai_response}")
                
            except KeyboardInterrupt:
                farewell = f"🌟 **Thanks for the phenomenal conversation!** 💖" if not self.user_name else f"🌟 **Thanks for everything, {self.user_name}!** 🥰"
                self.type_effect(f"\n\n{farewell} **You absolutely dazzled me!** ✨", 0.03)
                break
    
    def show_super_stats(self):
        """Show super impressive conversation statistics"""
        print(f"\n📊 **SUPER IMPRESSIVE STATS** 💖")
        if self.user_name:
            print(f"👤 **Incredible Superstar:** {self.user_name} 🌟")
        print(f"💬 **Dazzling Moments:** {len(self.chat_history)//2} 💫")
        print(f"🎯 **Impression Level:** Level {self.conversation_depth} 🚀")
        print(f"😊 **Your Amazing Vibe:** {self.user_mood.title()} 🌈")
        print(f"💾 **Brilliant Memories:** {len(self.learned_facts)} 🥰")
        
        if self.chat_history:
            print(f"\n📝 **Recent dazzling moments:**")
            for msg in self.chat_history[-4:]:
                print(f"   ✨ {msg}")
    
    def show_memory(self):
        """Show super impressive memories"""
        print(f"\n💾 **SUPER IMPRESSIVE MEMORIES** 💖")
        if self.learned_facts:
            for timestamp, fact in list(self.learned_facts.items())[-3:]:
                impress_emoji = "🥰" if fact.get('super_impress') else "🌟"
                stickers_used = "".join(fact.get('stickers_used', ['💫']))
                print(f"   {impress_emoji} {stickers_used} **{fact['message']}**")
        else:
            print("   💭 **Creating amazing dazzling memories with you...** 🌟")
    
    def show_super_help(self):
        """Super impressive help system"""
        help_text = """
🤖 **HARIAI SUPER IMPRESS AI** 🥰

💖 **SPECIAL GREETINGS:**
• Say "hi" or "hello" → **hii 😊 Hey hii! 🥰 How can you help with Hariai?** 💫

🎯 **IMPRESS LEVELS:**
• **SUPER** 🥰: Greetings get special amazing responses!
• **HIGH** 🌟: Long, thoughtful messages → "WOW! Brilliant!" 
• **MEDIUM** 😊: Questions & engagement → "That's interesting!"
• **LOW** 👉: Short responses → "I see! You're awesome!"

✨ **STICKER MAGIC:**
• 🥰😍🤩💖💕 - Super impressive love
• 🌟🚀💫🎯🔥 - High impressive energy  
• 😊👍👏🙌💪 - Friendly engagement
• 👉👌🙂💭📝 - Simple acknowledgments

🛠️ **COMMANDS:**
• help - This amazing guide
• stats - Dazzling metrics
• memory - Brilliant moments
• clear - Fresh start
• quit - Impressive goodbye

🚀 **EVERY RESPONSE WILL DAZZLE YOU!** ✨
        """
        print(help_text)

def main():
    print("🤖 **Hariai Super Impress AI** 🥰")
    print("💫 **Special hi/hello responses + Maximum impress power!** 🌟\n")
    
    # Initialize super impressive AI
    ai_engine = HariaiSuperImpress()
    
    # Start super impressive chat session
    ai_engine.start_chat()
    
    # Save memory when session ends
    ai_engine.save_memory()
    
    # Show final stats
    ai_engine.show_super_stats()
    
    print(f"\n🎯 **Hariai will always be dazzled by you!** 💝✨ **You're absolutely phenomenal!** 🥰🌈")

if __name__ == "__main__":
    main()
