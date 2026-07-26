import Word from "../models/wordModel.js";

/**
 * Rule-based chatbot controller to handle queries from students learning English/Hindi.
 */
export const handleChatQuery = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "Invalid query. Please provide a string query." });
    }

    const lowerQuery = query.toLowerCase().trim();
    let reply = "";

    // 1. Direct dictionary lookup checks
    const meaningMatch = lowerQuery.match(/(?:meaning of|define|translate|what is the meaning of)\s+([a-zA-Z\s]+)/i) ||
                         lowerQuery.match(/^([a-zA-Z]+)\s+meaning$/i);

    if (meaningMatch) {
      const targetWord = meaningMatch[1].trim();
      const wordRecord = await Word.findOne({
        english: new RegExp(`^${targetWord}$`, "i")
      });

      if (wordRecord) {
        reply = `📖 **Word Information**:
• **English**: ${wordRecord.english}
• **Hindi Translation**: ${wordRecord.hindi}
• **Pronunciation**: ${wordRecord.pronunciation?.join(", ") || "N/A"}
• **Part of Speech**: ${wordRecord.partOfSpeech || "N/A"}`;
        return res.json({ reply });
      } else {
        reply = `🔍 I couldn't find the word "${targetWord}" in our database. Let me know if you want me to search for another word, or try checking its spelling!`;
        return res.json({ reply });
      }
    }

    // 2. Help/Features & Greetings
    if (
      lowerQuery.includes("hi") ||
      lowerQuery.includes("hello") ||
      lowerQuery.includes("hey") ||
      lowerQuery.includes("greetings")
    ) {
      reply = `👋 **Hello! Welcome to Lernit!**
I'm your personal student assistant. I can help you navigate the app, learn English, or look up words.

Try asking me questions like:
• "What can I learn here?"
• "How does the quiz work?"
• "Meaning of hello"
• "How do I practice sentences?"`;
    } else if (
      lowerQuery.includes("what can i learn") ||
      lowerQuery.includes("features") ||
      lowerQuery.includes("about") ||
      lowerQuery.includes("what is this") ||
      lowerQuery.includes("help")
    ) {
      reply = `📚 **Here is what you can learn and do on Lernit:**
1. 🔤 **Word Learning**: Explore common words, search translations, and test your vocabulary with customized Quizzes by Part of Speech.
2. 🗣️ **Sentence Practice**: Learn how to translate sentences and build correct grammar.
3. 📰 **Paragraph Reading**: Read english paragraphs with side-by-side Hindi translation, key vocabulary lists, and practice comprehension exercises!
4. 📈 **Progress Tracking**: View your profile, progress, and performance statistics on the **Progress** page.

Just type any topic you want help with, or type "meaning of [word]" to look up a word!`;
    }

    // 3. Quizzes & Word learning instruction
    else if (
      lowerQuery.includes("quiz") ||
      lowerQuery.includes("vocabulary") ||
      lowerQuery.includes("vocab") ||
      lowerQuery.includes("word")
    ) {
      reply = `🔤 **Word Section & Quizzes**:
• Head over to the **Word** tab using the top navigation bar.
• You can search any English word to get its Hindi translation, pronunciation guides, and usage examples.
• Ready for a challenge? You can start a vocabulary **Quiz** based on parts of speech: Nouns, Verbs, Adjectives, Adverbs, and Interjections. It will test your knowledge with interactive multiple-choice questions!`;
    }

    // 4. Sentence practice instructions
    else if (
      lowerQuery.includes("sentence") ||
      lowerQuery.includes("sentences") ||
      lowerQuery.includes("phrases")
    ) {
      reply = `🗣️ **Sentence Practice**:
• Click on the **Sentence** tab in the navigation menu.
• In this section, you'll find various English sentences along with their exact Hindi translation. This is highly recommended for understanding syntax and context!`;
    }

    // 5. Paragraph & exercise instructions
    else if (
      lowerQuery.includes("paragraph") ||
      lowerQuery.includes("paragraphs") ||
      lowerQuery.includes("exercise") ||
      lowerQuery.includes("exercises") ||
      lowerQuery.includes("reading")
    ) {
      reply = `📰 **Paragraph Reading & Exercises**:
• Navigate to the **Paragraph** tab in the menu.
• You will see comprehensive english passages side-by-side with Hindi translations.
• Each paragraph highlights key **keywords** to expand your vocabulary.
• Scroll down to the bottom of each paragraph to complete **Comprehension Exercises** and check your understanding!`;
    }

    // 6. Progress and Profile
    else if (
      lowerQuery.includes("progress") ||
      lowerQuery.includes("profile") ||
      lowerQuery.includes("score") ||
      lowerQuery.includes("stat") ||
      lowerQuery.includes("stats")
    ) {
      reply = `📈 **Tracking Your Progress**:
• Click on your **User Profile circle/initial icon** at the top right of the navigation bar.
• Select the **Progress** option from the dropdown.
• There, you can see your basic account details and keep track of your performance statistics!`;
    }

    // 7. General Pronunciation / English tips
    else if (
      lowerQuery.includes("pronounce") ||
      lowerQuery.includes("pronunciation") ||
      lowerQuery.includes("how to speak")
    ) {
      reply = `🗣️ **Tips for improving your Pronunciation**:
• Check out the word details in our **Word** learning page; we include pronunciation guides (like IPA or phonetic guides) for each word.
• Try reading English sentences and paragraphs out loud.
• Listen carefully to English speakers, podcasts, or videos, and repeat after them!`;
    } else if (
      lowerQuery.includes("grammar") ||
      lowerQuery.includes("noun") ||
      lowerQuery.includes("verb") ||
      lowerQuery.includes("adjective")
    ) {
      reply = `📝 **English Grammar Quick Guide**:
• **Noun**: A name of a person, place, or thing (e.g., *dog, school, water*).
• **Verb**: An action word (e.g., *run, speak, learn*).
• **Adjective**: A word describing a noun (e.g., *beautiful, happy, fast*).
• You can practice these categories by starting specialized quizzes in the **Word** section of Lernit!`;
    } else if (
      lowerQuery.includes("thank") ||
      lowerQuery.includes("thanks") ||
      lowerQuery.includes("awesome") ||
      lowerQuery.includes("great")
    ) {
      reply = `😊 You're very welcome! I'm glad I could help you. Let me know if you have any other questions about Lernit or English learning! Happy studying! 🚀`;
    }

    // 8. Catch-all / Fallback
    else {
      reply = `🤖 I'm here to support your English learning! I didn't quite catch that.

You can ask me:
• "What are the features of Lernit?"
• "How can I practice sentences or paragraphs?"
• "How does the vocabulary quiz work?"
• Or ask me the meaning of a word, like: **"meaning of hello"**`;
    }

    return res.json({ reply });
  } catch (err) {
    console.error("Error in handleChatQuery:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
